"""Cognee Knowledge Graph Viewer - Simple local server"""
import asyncio
import json
import http.server
import socketserver
import webbrowser

PORT = 3333

def load_graph():
    import cognee
    from cognee.infrastructure.databases.graph import get_graph_engine

    async def _extract():
        graph_engine = await get_graph_engine()
        # Get all nodes and edges from the graph database
        all_nodes_raw = await graph_engine.get_graph_data()
        return all_nodes_raw

    raw = asyncio.run(_extract())

    nodes = []
    edges = []
    seen_nodes = set()

    # Debug: print type and structure
    print(f"Raw type: {type(raw)}")
    if isinstance(raw, (list, tuple)):
        print(f"Length: {len(raw)}")
        if len(raw) > 0:
            print(f"First element type: {type(raw[0])}")
            if isinstance(raw[0], (list, tuple)) and len(raw[0]) > 0:
                print(f"First sub-element type: {type(raw[0][0])}")
                first = raw[0][0]
                if hasattr(first, "__dict__"):
                    print(f"First element attrs: {list(first.__dict__.keys())[:10]}")

    # Parse based on structure
    def parse_item(item):
        """Extract dict from any object type."""
        if isinstance(item, dict):
            return item
        if hasattr(item, "__dict__"):
            return {k: v for k, v in item.__dict__.items() if k not in ("embedding", "_sa_instance_state")}
        if isinstance(item, (list, tuple)):
            return {"values": [str(v)[:100] for v in item]}
        return {"value": str(item)[:200]}

    def flatten_items(raw_data):
        """Recursively flatten nested lists/tuples."""
        items = []
        if isinstance(raw_data, (list, tuple)):
            for item in raw_data:
                if isinstance(item, (list, tuple)) and len(item) > 0 and isinstance(item[0], (list, tuple)):
                    items.extend(flatten_items(item))
                elif isinstance(item, (list, tuple)) and len(item) > 0:
                    items.extend(item)
                else:
                    items.append(item)
        return items

    all_items = flatten_items(raw)
    print(f"Total flattened items: {len(all_items)}")

    for item in all_items:
        d = parse_item(item)
        # Check if this looks like an edge (has source/target)
        src_id = d.get("source_node_id", d.get("source", None))
        tgt_id = d.get("target_node_id", d.get("target", None))

        if src_id and tgt_id:
            rel = str(d.get("relationship_name", d.get("label", d.get("type", "related_to"))))
            edges.append({"source": str(src_id), "target": str(tgt_id), "label": rel})
        else:
            # It's a node
            nid = str(d.get("id", id(item)))
            if nid in seen_nodes:
                continue
            seen_nodes.add(nid)
            label = str(d.get("name", d.get("label", d.get("text", nid)[:60])))
            if len(label) > 60:
                label = label[:57] + "..."
            node_type = str(d.get("type", d.get("node_type", type(item).__name__)))
            safe_data = {k: str(v)[:200] for k, v in d.items() if k not in ("embedding",)}
            nodes.append({"id": nid, "label": label, "type": node_type, "data": safe_data})

    return {"nodes": nodes, "edges": edges}


HTML = """<!DOCTYPE html>
<html><head>
<meta charset="utf-8">
<title>Cognee Knowledge Graph</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #0a0a0a; color: #e0e0e0; font-family: 'Segoe UI', system-ui, sans-serif; overflow: hidden; }
  #controls {
    position: fixed; top: 0; left: 0; right: 0; z-index: 10;
    background: rgba(10,10,10,0.9); backdrop-filter: blur(10px);
    padding: 12px 20px; display: flex; align-items: center; gap: 16px;
    border-bottom: 1px solid #222;
  }
  #controls h1 { font-size: 16px; font-weight: 600; color: #f4258c; }
  #controls .stat { font-size: 13px; color: #888; }
  #controls input {
    background: #1a1a1a; border: 1px solid #333; border-radius: 6px;
    padding: 6px 12px; color: #e0e0e0; font-size: 13px; width: 240px;
  }
  #controls input:focus { outline: none; border-color: #f4258c; }
  #graph { width: 100vw; height: 100vh; }
  #tooltip {
    position: fixed; display: none; background: rgba(20,20,20,0.95);
    border: 1px solid #333; border-radius: 8px; padding: 12px 16px;
    max-width: 400px; font-size: 12px; z-index: 20; pointer-events: none;
    backdrop-filter: blur(10px);
  }
  #tooltip .tt-title { color: #f4258c; font-weight: 600; font-size: 14px; margin-bottom: 4px; }
  #tooltip .tt-type { color: #888; font-size: 11px; margin-bottom: 8px; }
  #tooltip .tt-row { color: #aaa; margin: 2px 0; }
  #tooltip .tt-key { color: #e8f4f1; }
  #legend {
    position: fixed; bottom: 16px; left: 16px; z-index: 10;
    background: rgba(10,10,10,0.9); border: 1px solid #222; border-radius: 8px;
    padding: 12px 16px; font-size: 12px; backdrop-filter: blur(10px);
  }
  #legend .item { display: flex; align-items: center; gap: 8px; margin: 4px 0; }
  #legend .dot { width: 10px; height: 10px; border-radius: 50%; }
</style>
<script src="https://d3js.org/d3.v7.min.js"></script>
</head><body>
<div id="controls">
  <h1>Cognee Knowledge Graph</h1>
  <span class="stat" id="stats"></span>
  <input type="text" id="search" placeholder="Search nodes..." />
</div>
<div id="tooltip"></div>
<div id="legend"></div>
<svg id="graph"></svg>
<script>
const TYPE_COLORS = {
  'EntityNode': '#f4258c',
  'DocumentChunk': '#e8f4f1',
  'Entity': '#f4258c',
  'KnowledgeGraph': '#ff6b35',
  'Relationship': '#4ecdc4',
  'IndexSchema': '#e8f4f1',
  'unknown': '#666',
};
function getColor(type) {
  for (const [key, color] of Object.entries(TYPE_COLORS)) {
    if (type.toLowerCase().includes(key.toLowerCase())) return color;
  }
  return '#' + ((Math.abs(hashStr(type)) % 0xCCCCCC) + 0x333333).toString(16).slice(0,6);
}
function hashStr(s) { let h=0; for(let i=0;i<s.length;i++) h=((h<<5)-h)+s.charCodeAt(i); return h; }

fetch('/graph-data').then(r=>r.json()).then(data => {
  const width = window.innerWidth, height = window.innerHeight;
  const svg = d3.select('#graph').attr('width', width).attr('height', height);
  const g = svg.append('g');

  document.getElementById('stats').textContent =
    `${data.nodes.length} nodes | ${data.edges.length} edges`;

  // Build legend
  const types = [...new Set(data.nodes.map(n => n.type))];
  const legend = document.getElementById('legend');
  legend.innerHTML = types.map(t =>
    `<div class="item"><div class="dot" style="background:${getColor(t)}"></div>${t}</div>`
  ).join('');

  // Zoom
  svg.call(d3.zoom().scaleExtent([0.1, 8]).on('zoom', e => g.attr('transform', e.transform)));

  // Simulation
  const sim = d3.forceSimulation(data.nodes)
    .force('link', d3.forceLink(data.edges).id(d => d.id).distance(120))
    .force('charge', d3.forceManyBody().strength(-300))
    .force('center', d3.forceCenter(width/2, height/2))
    .force('collision', d3.forceCollide(30));

  // Edges
  const link = g.append('g').selectAll('line').data(data.edges).join('line')
    .attr('stroke', '#333').attr('stroke-width', 1).attr('stroke-opacity', 0.6);

  // Edge labels
  const edgeLabel = g.append('g').selectAll('text').data(data.edges).join('text')
    .text(d => d.label).attr('font-size', 9).attr('fill', '#555')
    .attr('text-anchor', 'middle').attr('dy', -4);

  // Nodes
  const node = g.append('g').selectAll('circle').data(data.nodes).join('circle')
    .attr('r', d => d.type === 'DocumentChunk' || d.type === 'IndexSchema' ? 6 : 10)
    .attr('fill', d => getColor(d.type))
    .attr('stroke', '#000').attr('stroke-width', 1)
    .attr('cursor', 'pointer')
    .call(d3.drag().on('start', ds).on('drag', dd).on('end', de));

  // Node labels
  const label = g.append('g').selectAll('text').data(data.nodes).join('text')
    .text(d => d.label).attr('font-size', 10).attr('fill', '#ccc')
    .attr('dx', 14).attr('dy', 4).attr('pointer-events', 'none');

  // Tooltip
  const tooltip = document.getElementById('tooltip');
  node.on('mouseover', (e, d) => {
    tooltip.style.display = 'block';
    tooltip.style.left = (e.pageX + 16) + 'px';
    tooltip.style.top = (e.pageY + 16) + 'px';
    let html = `<div class="tt-title">${d.label}</div><div class="tt-type">${d.type}</div>`;
    for (const [k,v] of Object.entries(d.data)) {
      if (k !== 'label' && k !== 'name' && k !== 'type' && k !== 'node_type')
        html += `<div class="tt-row"><span class="tt-key">${k}:</span> ${v}</div>`;
    }
    tooltip.innerHTML = html;
  }).on('mouseout', () => { tooltip.style.display = 'none'; });

  // Search
  document.getElementById('search').addEventListener('input', e => {
    const q = e.target.value.toLowerCase();
    node.attr('opacity', d => !q || d.label.toLowerCase().includes(q) ? 1 : 0.1);
    label.attr('opacity', d => !q || d.label.toLowerCase().includes(q) ? 1 : 0.1);
    link.attr('opacity', !q ? 0.6 : 0.05);
    edgeLabel.attr('opacity', !q ? 1 : 0.05);
  });

  sim.on('tick', () => {
    link.attr('x1',d=>d.source.x).attr('y1',d=>d.source.y).attr('x2',d=>d.target.x).attr('y2',d=>d.target.y);
    edgeLabel.attr('x',d=>(d.source.x+d.target.x)/2).attr('y',d=>(d.source.y+d.target.y)/2);
    node.attr('cx',d=>d.x).attr('cy',d=>d.y);
    label.attr('x',d=>d.x).attr('y',d=>d.y);
  });

  function ds(e,d){if(!e.active)sim.alphaTarget(.3).restart();d.fx=d.x;d.fy=d.y;}
  function dd(e,d){d.fx=e.x;d.fy=e.y;}
  function de(e,d){if(!e.active)sim.alphaTarget(0);d.fx=null;d.fy=null;}
});
</script>
</body></html>"""

class Handler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/graph-data':
            graph = load_graph()
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(graph).encode())
        elif self.path == '/' or self.path == '/index.html':
            self.send_response(200)
            self.send_header('Content-Type', 'text/html')
            self.end_headers()
            self.wfile.write(HTML.encode())
        else:
            self.send_error(404)

    def log_message(self, format, *args):
        pass  # Silence logs

if __name__ == '__main__':
    print("Loading graph from cognee...")
    graph = load_graph()
    print(f"Graph: {len(graph['nodes'])} nodes, {len(graph['edges'])} edges")
    print(f"\nOpen http://localhost:{PORT} in your browser")
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        webbrowser.open(f"http://localhost:{PORT}")
        httpd.serve_forever()
