## 2024-07-29 Todo

1. Create Super Admin Repository and API 
 Setup NestJS app with PostgreSQL 
 
 Create super-admin module 
 
 Super admin should have full CRUD permissions on: 
 
 Brokers 
 
 Owners (business clients) 
 
 Branches 
 
 POS modules 
 
 Permissions / Roles 
 
 Add JWT authentication for the admin 
 
 Add user role-based guard (SuperAdmin, Broker, Owner, Staff) 
 
 Admin panel can be created using nestjs-admin, adminjs, or similar 
 
 Add basic test cases to verify: 
 
 Super admin creation 
 
 Login / auth working 
 
 Broker creation endpoint works 
 
 ✅ Test & Confirm: 
 Log in as super admin, create a test broker, ensure it's saved and accessible. 
 
 2. Create Broker Repository and API 
 After the admin creates a broker, automatically generate a dedicated repo/module for each broker (optional but helpful for separation). 
 The broker should be able to: 
 
 Create/edit their business profile 
 
 Onboard business owners 
 
 Set funding rates or agency commission 
 
 View and manage all their connected clients 
 
 Apply for funding on behalf of clients 
 
 Integrate external services (POS setup, Uber Eats, Stripe, etc.) 
 
 🔧 Setup: 
 
 Create broker module 
 
 Secure all routes with broker JWT auth 
 
 Broker can: 
 
 Create clients (owners) 
 
 Assign POS/restaurant store info 
 
 Configure their agency/funding configuration 
 
 View submissions from business owners 
 
 Optional: Create separate schema per broker if using a multi-schema PostgreSQL setup 
 
 ✅ Test & Confirm: 
 Log in as broker, create test business owners, assign data, check database integrity and permissions. 
 
 3. Broker Adds Business Owner (Client) 
 Business owners are added by brokers and will have access to: 
 
 POS Management 
 
 Inventory & Menu setup 
 
 Order management 
 
 Delivery / takeaway integration 
 
 Funding application (loan, grant, invoice finance) 
 
 Report dashboard 
 
 🔧 Setup: 
 
 Create owner module 
 
 Add createOwnerByBroker() endpoint 
 
 Include business registration details (name, address, type, sector) 
 
 Assign plan or permissions 
 
 Automatically create default settings (inventory, taxes, POS layout, etc.) 
 
 ✅ Test & Confirm: 
 Log in as broker, add an owner, make sure data propagates correctly, and that owner can log in and access their resources.#