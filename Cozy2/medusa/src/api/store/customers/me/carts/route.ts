import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

export async function GET(
    req: AuthenticatedMedusaRequest,
    res: MedusaResponse
) {
    const customerId = req.auth_context?.actor_id;

    if (!customerId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }

    try {
        const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

        const { data: carts } = await query.graph({
            entity: "cart",
            fields: [
                "*",
                "items.*"
            ],
            filters: {
                customer_id: customerId,
            },
        });

        res.status(200).json({ carts });
    } catch (error: any) {
        console.error("[GET Customer Carts Error]:", error);
        res.status(500).json({ error: "Failed to fetch carts." });
    }
}
