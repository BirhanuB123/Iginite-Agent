// Script to add sample knowledge base documents to Adwa-Agent
// Run: node scripts/seed-knowledge.js

const BACKEND_URL = 'http://localhost:3000';
const TENANT_ID = '00000000-0000-0000-0000-000000000001';

const sampleDocuments = [
  {
    corpus: 'internal',
    title: 'Policy Framework Development Guide',
    content: `Building a comprehensive policy framework requires careful planning and execution. Here are the key steps:

1. Define Objectives: Start by clearly identifying the purpose and goals of your policy framework. Consider regulatory requirements, organizational needs, and stakeholder expectations.

2. Identify Key Areas: Determine which areas need policies. Common areas include security, privacy, HR, compliance, IT governance, data management, and operational procedures.

3. Research and Benchmark: Review industry standards, regulatory requirements, and best practices. Look at frameworks like ISO 27001, NIST, COBIT, and competitor policies for guidance.

4. Draft Policies: Write clear, concise policies tailored to your organization. Each policy should include: purpose, scope, definitions, responsibilities, procedures, and compliance requirements.

5. Review and Approve: Have stakeholders review draft policies. Get legal review for compliance. Obtain executive approval before implementation.

6. Implement: Communicate policies to all employees. Provide training and resources. Make policies easily accessible through an internal portal.

7. Monitor and Update: Regularly review policies (at least annually). Update based on regulatory changes, incidents, or organizational changes. Track policy acknowledgment and compliance.`,
    sourceUri: 'https://example.com/policy-framework-guide'
  },
  {
    corpus: 'internal',
    title: 'Human Resources Policies',
    content: `HR Policy Framework Overview:

Our HR policies are designed to create a fair, inclusive, and productive workplace. Key policy areas:

1. Code of Conduct: Expected behaviors, ethics, and professional standards for all employees.

2. Equal Opportunity: We prohibit discrimination based on race, gender, age, religion, disability, or other protected characteristics.

3. Workplace Safety: All employees must follow safety protocols. Report incidents immediately.

4. Leave Policies: Annual leave (20 days), sick leave (10 days), parental leave (12 weeks), bereavement leave (5 days).

5. Performance Management: Annual reviews in January. Mid-year check-ins in July. 360-degree feedback process.

6. Professional Development: $2000 annual training budget per employee. Internal mentorship program available.

7. Remote Work: Hybrid policy allows 2 days remote per week. Full remote available with manager approval.

8. Confidentiality: Employees must protect company and customer information. Sign NDA on hire.

9. Conflict Resolution: Open door policy. Escalation path: Manager → HR → Executive Team.

10. Termination: Notice period is 30 days for employees, 60 days for managers. Exit interview conducted by HR.`,
    sourceUri: 'https://example.com/hr-policies'
  },
  {
    corpus: 'internal',
    title: 'Information Security Policies',
    content: `Information Security Policy Framework:

Our security policies protect organizational assets, data, and systems. All employees must comply.

1. Access Control: Use strong passwords (12+ characters, MFA enabled). Never share credentials. Request access through IT portal.

2. Data Classification: PUBLIC (marketing materials), INTERNAL (general business), CONFIDENTIAL (financial, customer data), RESTRICTED (executive, legal).

3. Data Handling: Encrypt confidential data at rest and in transit. Use approved cloud storage only (OneDrive, SharePoint). No USB drives without approval.

4. Email Security: Be cautious of phishing. Verify sender before clicking links. Report suspicious emails to security@company.com.

5. Device Security: Keep OS and software updated. Enable disk encryption. Lock screen when away. Report lost/stolen devices immediately.

6. Remote Access: Use company VPN for remote work. No public WiFi without VPN. Secure home network with WPA3 encryption.

7. Acceptable Use: Company systems are for business use. Limited personal use allowed. No illegal activities, harassment, or policy violations.

8. Incident Response: Report security incidents within 1 hour to security@company.com. Do not attempt to fix yourself. Preserve evidence.

9. Third-Party Security: Vendors must sign security agreements. Annual security assessments required for critical vendors.

10. Security Training: Mandatory annual training. Monthly security awareness emails. Quarterly phishing simulations.`,
    sourceUri: 'https://example.com/security-policies'
  },
  {
    corpus: 'internal',
    title: 'Employee Onboarding Guide',
    content: `Welcome to the Team! Complete these steps in your first 30 days:

Week 1 - Setup:
- Day 1: HR orientation (9am), receive laptop and equipment, complete paperwork
- Day 2: IT setup - email, Slack, VPN, password manager, required software
- Day 3: Security training (online, 2 hours), sign confidentiality agreement
- Day 4: Meet your team, tour office, lunch with buddy
- Day 5: Review role expectations with manager, set 30-60-90 day goals

Week 2 - Training:
- Complete product training modules (online portal)
- Shadow team members on key processes
- Set up 1-on-1s with cross-functional partners
- Review project documentation and wikis
- Attend team meetings and standups

Week 3-4 - Integration:
- Start contributing to projects
- Join relevant Slack channels and meetings
- Complete compliance training (GDPR, SOC2, etc.)
- Schedule coffee chats with other departments
- Provide onboarding feedback to HR

Ongoing Resources:
- IT Support: helpdesk@company.com
- HR Questions: hr@company.com
- Facilities: facilities@company.com
- Employee Handbook: intranet.company.com/handbook
- Learning Portal: learning.company.com`,
    sourceUri: 'https://example.com/onboarding'
  }
];

async function login() {
  console.log('🔐 Logging in...');
  const response = await fetch(`${BACKEND_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'client@acme.com',
      password: 'password123',
      tenantId: TENANT_ID
    })
  });

  if (!response.ok) {
    throw new Error(`Login failed: ${response.statusText}`);
  }

  const data = await response.json();
  console.log('✅ Logged in successfully\n');
  return data.accessToken;
}

async function ingestDocument(token, doc) {
  console.log(`📚 Adding: ${doc.title}...`);
  const response = await fetch(`${BACKEND_URL}/knowledge/ingest`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Tenant-Id': TENANT_ID,
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(doc)
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to ingest "${doc.title}": ${error}`);
  }

  const result = await response.json();
  console.log(`   ✓ Created document with ${result.chunksCreated} chunks\n`);
  return result;
}

async function main() {
  try {
    console.log('🚀 Adwa-Agent Knowledge Base Seeder\n');
    console.log('Backend URL:', BACKEND_URL);
    console.log('Tenant ID:', TENANT_ID);
    console.log('─'.repeat(50), '\n');

    // Login
    const token = await login();

    // Ingest all documents
    for (const doc of sampleDocuments) {
      await ingestDocument(token, doc);
    }

    console.log('─'.repeat(50));
    console.log('✅ All sample documents added successfully!\n');
    console.log('You can now ask questions like:');
    console.log('  • "What are the onboarding steps?"');
    console.log('  • "Tell me about our security policies"');
    console.log('  • "How do I build a policy framework?"');
    console.log('  • "What is our leave policy?"');
    console.log('\nGo to http://localhost:3001/chat to try it out! 💬');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\nMake sure:');
    console.error('  1. Backend is running on http://localhost:3000');
    console.error('  2. Database is running (docker-compose up -d)');
    console.error('  3. Database has been seeded (npx prisma db seed)');
    process.exit(1);
  }
}

main();
