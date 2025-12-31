#!/bin/bash

# Sample script to add knowledge base documents to Adwa-Agent
# Make sure your backend is running on http://localhost:3000

BACKEND_URL="http://localhost:3000"
TENANT_ID="00000000-0000-0000-0000-000000000001"

# Get auth token (login first)
echo "Logging in..."
TOKEN_RESPONSE=$(curl -s -X POST $BACKEND_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "client@acme.com",
    "password": "password123",
    "tenantId": "'$TENANT_ID'"
  }')

TOKEN=$(echo $TOKEN_RESPONSE | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "❌ Failed to login. Make sure backend is running."
  exit 1
fi

echo "✅ Logged in successfully"
echo ""

# Add Policy Framework Document
echo "📚 Adding Policy Framework Guide..."
curl -X POST $BACKEND_URL/knowledge/ingest \
  -H "Content-Type: application/json" \
  -H "X-Tenant-Id: $TENANT_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "corpus": "internal",
    "title": "Policy Framework Development Guide",
    "content": "Building a comprehensive policy framework requires careful planning and execution. Here are the key steps:\n\n1. Define Objectives: Start by clearly identifying the purpose and goals of your policy framework. Consider regulatory requirements, organizational needs, and stakeholder expectations.\n\n2. Identify Key Areas: Determine which areas need policies. Common areas include security, privacy, HR, compliance, IT governance, data management, and operational procedures.\n\n3. Research and Benchmark: Review industry standards, regulatory requirements, and best practices. Look at frameworks like ISO 27001, NIST, COBIT, and competitor policies for guidance.\n\n4. Draft Policies: Write clear, concise policies tailored to your organization. Each policy should include: purpose, scope, definitions, responsibilities, procedures, and compliance requirements.\n\n5. Review and Approve: Have stakeholders review draft policies. Get legal review for compliance. Obtain executive approval before implementation.\n\n6. Implement: Communicate policies to all employees. Provide training and resources. Make policies easily accessible through an internal portal.\n\n7. Monitor and Update: Regularly review policies (at least annually). Update based on regulatory changes, incidents, or organizational changes. Track policy acknowledgment and compliance.",
    "sourceUri": "https://example.com/policy-framework-guide"
  }'
echo ""
echo ""

# Add HR Policies
echo "📚 Adding HR Policy Guide..."
curl -X POST $BACKEND_URL/knowledge/ingest \
  -H "Content-Type: application/json" \
  -H "X-Tenant-Id: $TENANT_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "corpus": "internal",
    "title": "Human Resources Policies",
    "content": "HR Policy Framework Overview:\n\nOur HR policies are designed to create a fair, inclusive, and productive workplace. Key policy areas:\n\n1. Code of Conduct: Expected behaviors, ethics, and professional standards for all employees.\n\n2. Equal Opportunity: We prohibit discrimination based on race, gender, age, religion, disability, or other protected characteristics.\n\n3. Workplace Safety: All employees must follow safety protocols. Report incidents immediately.\n\n4. Leave Policies: Annual leave (20 days), sick leave (10 days), parental leave (12 weeks), bereavement leave (5 days).\n\n5. Performance Management: Annual reviews in January. Mid-year check-ins in July. 360-degree feedback process.\n\n6. Professional Development: $2000 annual training budget per employee. Internal mentorship program available.\n\n7. Remote Work: Hybrid policy allows 2 days remote per week. Full remote available with manager approval.\n\n8. Confidentiality: Employees must protect company and customer information. Sign NDA on hire.\n\n9. Conflict Resolution: Open door policy. Escalation path: Manager → HR → Executive Team.\n\n10. Termination: Notice period is 30 days for employees, 60 days for managers. Exit interview conducted by HR.",
    "sourceUri": "https://example.com/hr-policies"
  }'
echo ""
echo ""

# Add Security Policies
echo "📚 Adding Security Policy Guide..."
curl -X POST $BACKEND_URL/knowledge/ingest \
  -H "Content-Type: application/json" \
  -H "X-Tenant-Id: $TENANT_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "corpus": "internal",
    "title": "Information Security Policies",
    "content": "Information Security Policy Framework:\n\nOur security policies protect organizational assets, data, and systems. All employees must comply.\n\n1. Access Control: Use strong passwords (12+ characters, MFA enabled). Never share credentials. Request access through IT portal.\n\n2. Data Classification: PUBLIC (marketing materials), INTERNAL (general business), CONFIDENTIAL (financial, customer data), RESTRICTED (executive, legal).\n\n3. Data Handling: Encrypt confidential data at rest and in transit. Use approved cloud storage only (OneDrive, SharePoint). No USB drives without approval.\n\n4. Email Security: Be cautious of phishing. Verify sender before clicking links. Report suspicious emails to security@company.com.\n\n5. Device Security: Keep OS and software updated. Enable disk encryption. Lock screen when away. Report lost/stolen devices immediately.\n\n6. Remote Access: Use company VPN for remote work. No public WiFi without VPN. Secure home network with WPA3 encryption.\n\n7. Acceptable Use: Company systems are for business use. Limited personal use allowed. No illegal activities, harassment, or policy violations.\n\n8. Incident Response: Report security incidents within 1 hour to security@company.com. Do not attempt to fix yourself. Preserve evidence.\n\n9. Third-Party Security: Vendors must sign security agreements. Annual security assessments required for critical vendors.\n\n10. Security Training: Mandatory annual training. Monthly security awareness emails. Quarterly phishing simulations.",
    "sourceUri": "https://example.com/security-policies"
  }'
echo ""
echo ""

# Add Onboarding Guide
echo "📚 Adding Onboarding Guide..."
curl -X POST $BACKEND_URL/knowledge/ingest \
  -H "Content-Type: application/json" \
  -H "X-Tenant-Id: $TENANT_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "corpus": "internal",
    "title": "Employee Onboarding Guide",
    "content": "Welcome to the Team! Complete these steps in your first 30 days:\n\nWeek 1 - Setup:\n- Day 1: HR orientation (9am), receive laptop and equipment, complete paperwork\n- Day 2: IT setup - email, Slack, VPN, password manager, required software\n- Day 3: Security training (online, 2 hours), sign confidentiality agreement\n- Day 4: Meet your team, tour office, lunch with buddy\n- Day 5: Review role expectations with manager, set 30-60-90 day goals\n\nWeek 2 - Training:\n- Complete product training modules (online portal)\n- Shadow team members on key processes\n- Set up 1-on-1s with cross-functional partners\n- Review project documentation and wikis\n- Attend team meetings and standups\n\nWeek 3-4 - Integration:\n- Start contributing to projects\n- Join relevant Slack channels and meetings\n- Complete compliance training (GDPR, SOC2, etc.)\n- Schedule coffee chats with other departments\n- Provide onboarding feedback to HR\n\nOngoing Resources:\n- IT Support: helpdesk@company.com\n- HR Questions: hr@company.com\n- Facilities: facilities@company.com\n- Employee Handbook: intranet.company.com/handbook\n- Learning Portal: learning.company.com",
    "sourceUri": "https://example.com/onboarding"
  }'
echo ""
echo ""

echo "✅ All sample documents added successfully!"
echo ""
echo "You can now ask questions like:"
echo "  - 'What are the onboarding steps?'"
echo "  - 'Tell me about our security policies'"
echo "  - 'How do I build a policy framework?'"
echo "  - 'What is our leave policy?'"
