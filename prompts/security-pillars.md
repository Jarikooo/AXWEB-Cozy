CORE PILLARS

1. AUTHENTICATION & AUTHORIZATION (ACCESS CONTROL)
    Understanding the distinction between these two concepts is the foundation of app security:
        - AUTHENTICATION: Verifying identity (who are you?)
        - AUTHORIZATION: Verifying permissions (What are you allowed to do?)

    AUTHENTICATION BEST PRACTICES:
        - DO NOT CREATE YOUR OWN AUTH: Instead of coding a custom authentication system from scratch, leverage established identity providers and authentication protocols.
        - USE SINGLE SIGN-ON (SSO): Integrate trusted providers (e.g., Google, Github, Microsoft) to handle user credentials securely.
        - MULTI-FACTOR AUTHENTICATION (MFA): Enforce or highly recommend MFA to add an extra layer of security beyond passwords. Commonly used methods: authenticator apps, biometrics, hardware tokens, SMS/Email Codes.

    AUTHORIZATION BEST PRACTICES:
        - ROLE-BASED ACCESS CONTROL (RBAC): Implement RBAC to manage permissions efficiently. Define clear roles such as user, editor, admin and assign specific, least-privilege permissions to each.
        - DEFENSE IN DEPTH: Always validate permissions on both the client and server side.
        - BROKEN OBJECT LEVEL AUTHORIZATION: Always verify that the user is authorized to access or modify the specific record requested, not just the endpoint itself. 
        - CRITICAL RULE: NEVER TRUST CLIENT-SIDE CHECKS ALONE. CLIENT-SIDE CHECKS CAN BE EASILY MANIPULATED BY AN ATTACKER.

2. DATA SECURITY
    Protecting data at rest and in transit is crucial to preventing leaks and breaches.
        - SECRETS MANAGEMENT: Never hardcode sensitive data or encryption keys in your source code. Use Environment Variables or a dedicated secure Key Management Service (KMS).
        - INPUT SANITIZATION: Rigorously validate and sanitize all data before processing it. This applies to form inputs, API parameters, file uploads, and any other data entering your server from the outside.
        - DATA MINIMIZATION: Only store data that is absolutely necessary for the application to function.
        - ENCRYPTION STANDARDS: Enforce strong encryption for data in transit E.G., TLS1.2/TLS1.3. For data at rest use E.G. AES-256 encryption. 

3. ATTACKER PREVENTION & MITIGATION
    Proactively defend against common web vulnerabilities (like those found in the OWASP Top 10):
        - CROSS-SITE SCRIPTING (XSS): Never directly insert raw user input into your HTML. Use established sanitization libraries (e.g., sanitize-html) to strip malicious scripts.
        - CROSS-SITE REQUEST FORGERY (CSRF): Implement anti-CSRF tokens in all forms and state-changing API endpoints to ensure requests are intentionally made by the user.
        - SQL INJECTION: Prevent database manipulation by using parameterized queries or an Object-Relational Mapper (ORM) instead of raw SQL concatenation.
        - SERVER-SIDE REQUEST FORGERY (SSRF): Validate and restrict any URLs provided by a user to prevent the server from being tricked into querying internal network resources.
        - SUPPLY CHAIN SECURITY: Keep third-party dependencies updated and continuously scan them for known vulnerabilities using automated auditing tools.

        SECURITY HEADERS FOR HTTPS REQUESTS
        Implement robust HTTP response headers to add an extra layer of protection to your application:
            - CONTENT-SECURITY-POLICY (CSP): Restricts the resources (like scripts and images) that the browser is allowed to load.
            - STRICT-TRANSPORT-SECURITY (HSTS): Forces browsers to communicate exclusively over HTTPS.
            - SET-COOKIE FLAGS: Always use Secure, HttpOnly, and SameSite attributes on sensitive cookies.
            - CORS (CROSS-ORIGIN RESOURCE SHARING): Strictly define which external domains are permitted to interact with your APIs.
            - ADDITIONAL HEADERS:
                - X-FRAME-OPTIONS
                - X-CONTENT-TYPE-OPTIONS
                - REFERRER-POLICY
                - PERMISSIONS-POLICY
                - X-PERMITTED-CROSS-DOMAIN-POLICIES
                - X-XSS-PROTECTION

4. INFRASTRUCTURE SECURITY
    Secure the underlying servers and network that host your application.
        - RATE LIMITING: Implement rate limiting on your APIs and login endpoints to prevent brute-force attacks and resource exhaustion.
        - DDOS PREVENTION: Utilize Web Application Firewalls (WAF) or cloud-based mitigation services to absorb and block Distributed Denial of Service attacks.
        - INFRASTRUCTURE LEAST PRIVILEGE: Ensure servers, containers, and database instances operate with the absolute minimum network and file system access required to run.

5. SECURITY MONITORING & INCIDENT RESPONSE
    Assume you will be targeted; visibility is your best defense.
        - BREACH AWARENESS: Maintain systems that notify you when your application is being actively probed or breached.
        - AUDIT LOGGING: Log critical request metadata—including IP addresses, timestamps, and User-Agents—to investigate potential security incidents thoroughly.
        - PROACTIVE ALERTS: Set up real-time monitoring and automated alerts for anomalous behavior.
        - LOG SANITIZATION: Actively scrub logs to ensure you never inadvertently record sensitive data (like plaintext passwords, API keys, or personally identifiable information).



use the skyn mcp to check my code for vulnerabilities in Cozy2 folder.

Check security-pillars.md C:\Users\aagul\AXWEB\prompts\security-pillars.md

Ur deliverable is a list of all vulnerabilities, and the best solution to fix them