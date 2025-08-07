# DiveSeeks TODO7aug Implementation Guide

## 1. Product Overview

This document provides a comprehensive implementation guide for the three core tasks outlined in TODO7aug.md: Super Admin Repository/API, Broker Repository/API, and Business Owner module. The system implements a hierarchical multi-tenant architecture where Super Admins manage Brokers, Brokers manage Business Owners, and Business Owners manage their operations including POS, inventory, orders, and funding applications.

The implementation follows NestJS best practices with TypeORM, JWT authentication, role-based access control, and comprehensive API testing using curl/httpie commands.

## 2. Core Features

### 2.1 User Roles

| Role | Registration Method | Core Permissions |
|------|---------------------|------------------|
| Super Admin | System-created with root access | Full CRUD on all entities: Brokers, Owners, Branches, POS modules, Permissions/Roles |
| Broker | Created by Super Admin | Create/manage Business Owners, set funding rates, manage client data, apply for funding |
| Business Owner | Created by Broker | POS Management, Inventory/Menu setup, Order management, Delivery integration, Funding applications |
| Staff | Created by Business Owner | Limited access to assigned modules (POS, inventory, orders) |

### 2.2 Feature Module

Our implementation consists of the following main modules:

1. **Super Admin Module**: Authentication, broker management, system-wide permissions, role management, comprehensive CRUD operations.
2. **Broker Module**: Business profile management, client onboarding, funding rate configuration, external service integration.
3. **Business Owner Module**: POS operations, inventory management, order processing, delivery integration, funding applications, reporting dashboard.

### 2.3 Page Details

| Module Name | Feature Name | Feature Description |
|-------------|--------------|--------------------|
| Super Admin | Authentication | JWT-based login with role validation, session management, password reset functionality |
| Super Admin | Broker Management | Create, read, update, delete brokers with business profile setup |
| Super Admin | Permission Management | Role-based access control configuration, permission assignment, guard implementation |
| Super Admin | System Monitoring | View all system activities, user management, audit logs |
| Broker | Profile Management | Create/edit business profile, contact information, service offerings |
| Broker | Client Onboarding | Create business owners, assign permissions, setup initial configurations |
| Broker | Funding Configuration | Set commission rates, configure funding options, manage client applications |
| Broker | External Integration | Setup POS systems, Uber Eats integration, Stripe payment processing |
| Business Owner | POS Management | Point of sale operations, transaction processing, receipt generation |
| Business Owner | Inventory Control | Product management, stock tracking, menu setup, pricing configuration |
| Business Owner | Order Processing | Order creation, status tracking, delivery management, customer communication |
| Business Owner | Funding Applications | Loan applications, grant requests, invoice financing, application tracking |
| Business Owner | Reporting Dashboard | Sales analytics, inventory reports, financial summaries, performance metrics |

## 3. Core Process

### 3.1 Super Admin Flow
1. Super Admin logs in with JWT authentication
2. Creates broker accounts with business profiles
3. Assigns permissions and roles to brokers
4. Monitors system-wide activities and manages configurations
5. Handles system maintenance and user management

### 3.2 Broker Flow
1. Broker logs in with assigned credentials
2. Sets up business profile and service configurations
3. Onboards business owners with initial setup
4. Configures funding rates and commission structures
5. Manages client relationships and funding applications
6. Integrates external services (POS, delivery, payments)

### 3.3 Business Owner Flow
1. Business Owner logs in through broker-created account
2. Completes business registration and profile setup
3. Configures POS system and inventory management
4. Processes orders and manages delivery operations
5. Applies for funding through broker relationships
6. Monitors business performance through reporting dashboard

```mermaid
graph TD
    A[Super Admin Login] --> B[Broker Management]
    B --> C[Create Broker]
    C --> D[Broker Login]
    D --> E[Business Owner Creation]
    E --> F[Owner Login]
    F --> G[POS Setup]
    G --> H[Inventory Management]
    H --> I[Order Processing]
    I --> J[Funding Applications]
    J --> K[Reporting Dashboard]
```

## 4. Technical Architecture

### 4.1 Architecture Design

```mermaid
graph TD
    A[Client Applications] --> B[NestJS API Gateway]
    B --> C[Authentication Service]
    B --> D[Super Admin Module]
    B --> E[Broker Module]
    B --> F[Business Owner Module]
    
    C --> G[JWT Strategy]
    C --> H[Role Guards]
    
    D --> I[Broker Repository]
    E --> J[Owner Repository]
    F --> K[POS Repository]
    F --> L[Inventory Repository]
    F --> M[Order Repository]
    
    I --> N[PostgreSQL Database]
    J --> N
    K --> N
    L --> N
    M --> N
    
    subgraph "External Services"
        O[Stripe API]
        P[Uber Eats API]
        Q[Email Service]
    end
    
    E --> O
    E --> P
    F --> Q
```

### 4.2 Technology Stack

- **Framework**: NestJS ^10.0.0 + TypeScript ^5.0.0
- **Database**: PostgreSQL with TypeORM ^0.3.0
- **Authentication**: JWT + Passport strategies
- **Validation**: class-validator, class-transformer
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest, Supertest, curl/httpie

### 4.3 Module Structure

```
src/modules/
├── super-admin/
│   ├── super-admin.module.ts
│   ├── super-admin.controller.ts
│   ├── super-admin.service.ts
│   ├── dto/
│   ├── entities/
│   └── guards/
├── brokers/
│   ├── brokers.module.ts
│   ├── brokers.controller.ts
│   ├── brokers.service.ts
│   ├── dto/
│   └── entities/
└── business-owners/
    ├── business-owners.module.ts
    ├── business-owners.controller.ts
    ├── business-owners.service.ts
    ├── dto/
    └── entities/
```

## 5. Implementation Steps

### 5.1 Step 1: Super Admin Module Implementation

#### 5.1.1 Generate Module
```bash
nest g res super-admin
```

#### 5.1.2 Entity Definition
```typescript
// entities/super-admin.entity.ts
@Entity('super_admins')
export class SuperAdmin {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ default: 'SUPER_ADMIN' })
  role: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

#### 5.1.3 Controller Implementation
```typescript
// super-admin.controller.ts
@Controller('super-admin')
@ApiTags('Super Admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPER_ADMIN')
export class SuperAdminController {
  constructor(private readonly superAdminService: SuperAdminService) {}

  @Post('brokers')
  @ApiOperation({ summary: 'Create a new broker' })
  async createBroker(@Body() createBrokerDto: CreateBrokerDto) {
    return this.superAdminService.createBroker(createBrokerDto);
  }

  @Get('brokers')
  @ApiOperation({ summary: 'Get all brokers' })
  async getAllBrokers() {
    return this.superAdminService.getAllBrokers();
  }

  @Put('brokers/:id')
  @ApiOperation({ summary: 'Update broker' })
  async updateBroker(@Param('id') id: string, @Body() updateBrokerDto: UpdateBrokerDto) {
    return this.superAdminService.updateBroker(id, updateBrokerDto);
  }

  @Delete('brokers/:id')
  @ApiOperation({ summary: 'Delete broker' })
  async deleteBroker(@Param('id') id: string) {
    return this.superAdminService.deleteBroker(id);
  }
}
```

#### 5.1.4 Testing Commands
```bash
# Test Super Admin Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@diveseeks.com","password":"admin123"}'

# Test Create Broker (with JWT token)
curl -X POST http://localhost:3000/super-admin/brokers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"email":"broker@example.com","firstName":"John","lastName":"Doe","companyName":"Broker LLC"}'

# Test Get All Brokers
curl -X GET http://localhost:3000/super-admin/brokers \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 5.2 Step 2: Broker Module Implementation

#### 5.2.1 Generate Module
```bash
nest g res brokers
```

#### 5.2.2 Entity Definition
```typescript
// entities/broker.entity.ts
@Entity('brokers')
export class Broker {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  companyName: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  commissionRate: number;

  @Column({ default: 'BROKER' })
  role: string;

  @OneToMany(() => BusinessOwner, owner => owner.broker)
  businessOwners: BusinessOwner[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

#### 5.2.3 Controller Implementation
```typescript
// brokers.controller.ts
@Controller('brokers')
@ApiTags('Brokers')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('BROKER', 'SUPER_ADMIN')
export class BrokersController {
  constructor(private readonly brokersService: BrokersService) {}

  @Post('business-owners')
  @ApiOperation({ summary: 'Create a new business owner' })
  async createBusinessOwner(
    @CurrentUser() broker: Broker,
    @Body() createOwnerDto: CreateBusinessOwnerDto
  ) {
    return this.brokersService.createBusinessOwner(broker.id, createOwnerDto);
  }

  @Get('business-owners')
  @ApiOperation({ summary: 'Get all business owners for this broker' })
  async getBusinessOwners(@CurrentUser() broker: Broker) {
    return this.brokersService.getBusinessOwners(broker.id);
  }

  @Put('profile')
  @ApiOperation({ summary: 'Update broker profile' })
  async updateProfile(
    @CurrentUser() broker: Broker,
    @Body() updateProfileDto: UpdateBrokerProfileDto
  ) {
    return this.brokersService.updateProfile(broker.id, updateProfileDto);
  }

  @Post('funding-rates')
  @ApiOperation({ summary: 'Set funding rates' })
  async setFundingRates(
    @CurrentUser() broker: Broker,
    @Body() fundingRatesDto: SetFundingRatesDto
  ) {
    return this.brokersService.setFundingRates(broker.id, fundingRatesDto);
  }
}
```

#### 5.2.4 Testing Commands
```bash
# Test Broker Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"broker@example.com","password":"broker123"}'

# Test Create Business Owner
curl -X POST http://localhost:3000/brokers/business-owners \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer BROKER_JWT_TOKEN" \
  -d '{"email":"owner@restaurant.com","firstName":"Jane","lastName":"Smith","businessName":"Pizza Palace","businessType":"RESTAURANT"}'

# Test Get Business Owners
curl -X GET http://localhost:3000/brokers/business-owners \
  -H "Authorization: Bearer BROKER_JWT_TOKEN"
```

### 5.3 Step 3: Business Owner Module Implementation

#### 5.3.1 Generate Module
```bash
nest g res business-owners
```

#### 5.3.2 Entity Definition
```typescript
// entities/business-owner.entity.ts
@Entity('business_owners')
export class BusinessOwner {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  businessName: string;

  @Column()
  businessType: string;

  @Column({ nullable: true })
  businessAddress: string;

  @Column({ default: 'BUSINESS_OWNER' })
  role: string;

  @ManyToOne(() => Broker, broker => broker.businessOwners)
  @JoinColumn({ name: 'broker_id' })
  broker: Broker;

  @Column()
  brokerId: string;

  @OneToMany(() => Branch, branch => branch.businessOwner)
  branches: Branch[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

#### 5.3.3 Controller Implementation
```typescript
// business-owners.controller.ts
@Controller('business-owners')
@ApiTags('Business Owners')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('BUSINESS_OWNER', 'BROKER', 'SUPER_ADMIN')
export class BusinessOwnersController {
  constructor(private readonly businessOwnersService: BusinessOwnersService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get business owner dashboard data' })
  async getDashboard(@CurrentUser() owner: BusinessOwner) {
    return this.businessOwnersService.getDashboard(owner.id);
  }

  @Post('pos/transactions')
  @ApiOperation({ summary: 'Process POS transaction' })
  async processPOSTransaction(
    @CurrentUser() owner: BusinessOwner,
    @Body() transactionDto: CreateTransactionDto
  ) {
    return this.businessOwnersService.processPOSTransaction(owner.id, transactionDto);
  }

  @Get('inventory')
  @ApiOperation({ summary: 'Get inventory items' })
  async getInventory(@CurrentUser() owner: BusinessOwner) {
    return this.businessOwnersService.getInventory(owner.id);
  }

  @Post('inventory')
  @ApiOperation({ summary: 'Add inventory item' })
  async addInventoryItem(
    @CurrentUser() owner: BusinessOwner,
    @Body() inventoryDto: CreateInventoryItemDto
  ) {
    return this.businessOwnersService.addInventoryItem(owner.id, inventoryDto);
  }

  @Post('funding/applications')
  @ApiOperation({ summary: 'Submit funding application' })
  async submitFundingApplication(
    @CurrentUser() owner: BusinessOwner,
    @Body() applicationDto: CreateFundingApplicationDto
  ) {
    return this.businessOwnersService.submitFundingApplication(owner.id, applicationDto);
  }

  @Get('reports/sales')
  @ApiOperation({ summary: 'Get sales reports' })
  async getSalesReports(
    @CurrentUser() owner: BusinessOwner,
    @Query() queryDto: ReportQueryDto
  ) {
    return this.businessOwnersService.getSalesReports(owner.id, queryDto);
  }
}
```

#### 5.3.4 Testing Commands
```bash
# Test Business Owner Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"owner@restaurant.com","password":"owner123"}'

# Test Get Dashboard
curl -X GET http://localhost:3000/business-owners/dashboard \
  -H "Authorization: Bearer OWNER_JWT_TOKEN"

# Test POS Transaction
curl -X POST http://localhost:3000/business-owners/pos/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer OWNER_JWT_TOKEN" \
  -d '{"items":[{"productId":"123","quantity":2,"price":15.99}],"total":31.98,"paymentMethod":"CARD"}'

# Test Add Inventory Item
curl -X POST http://localhost:3000/business-owners/inventory \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer OWNER_JWT_TOKEN" \
  -d '{"name":"Margherita Pizza","category":"FOOD","price":12.99,"stock":50}'
```

## 6. Database Schema

### 6.1 Core Tables

```sql
-- Super Admins Table
CREATE TABLE super_admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) DEFAULT 'SUPER_ADMIN',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Brokers Table
CREATE TABLE brokers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    commission_rate DECIMAL(5,2) DEFAULT 0,
    role VARCHAR(20) DEFAULT 'BROKER',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Business Owners Table
CREATE TABLE business_owners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    business_name VARCHAR(255) NOT NULL,
    business_type VARCHAR(50) NOT NULL,
    business_address TEXT,
    role VARCHAR(20) DEFAULT 'BUSINESS_OWNER',
    broker_id UUID REFERENCES brokers(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_business_owners_broker_id ON business_owners(broker_id);
CREATE INDEX idx_business_owners_email ON business_owners(email);
CREATE INDEX idx_brokers_email ON brokers(email);
CREATE INDEX idx_super_admins_email ON super_admins(email);
```

## 7. Authentication & Authorization

### 7.1 JWT Strategy Implementation

```typescript
// strategies/jwt.strategy.ts
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
```

### 7.2 Role-Based Guards

```typescript
// guards/roles.guard.ts
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.role === role);
  }
}
```

## 8. Testing Strategy

### 8.1 Unit Testing
```bash
# Run unit tests
npm run test

# Run tests with coverage
npm run test:cov
```

### 8.2 E2E Testing
```bash
# Run E2E tests
npm run test:e2e
```

### 8.3 API Testing with HTTPie
```bash
# Install HTTPie
pip install httpie

# Test Super Admin endpoints
http POST localhost:3000/auth/login email=admin@diveseeks.com password=admin123
http GET localhost:3000/super-admin/brokers Authorization:"Bearer TOKEN"

# Test Broker endpoints
http POST localhost:3000/auth/login email=broker@example.com password=broker123
http GET localhost:3000/brokers/business-owners Authorization:"Bearer TOKEN"

# Test Business Owner endpoints
http POST localhost:3000/auth/login email=owner@restaurant.com password=owner123
http GET localhost:3000/business-owners/dashboard Authorization:"Bearer TOKEN"
```

## 9. Deployment Considerations

### 9.1 Environment Configuration
```bash
# .env file
DATABASE_URL=postgresql://user:password@localhost:5432/diveseeks
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d
PORT=3000
```

### 9.2 Database Migrations
```bash
# Generate migration
npm run typeorm:migration:generate -- -n CreateSuperAdminBrokerOwner

# Run migrations
npm run typeorm:migration:run
```

### 9.3 Production Checklist
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] JWT secrets properly set
- [ ] CORS configuration updated
- [ ] Rate limiting enabled
- [ ] Logging configured
- [ ] Health checks implemented
- [ ] API documentation deployed

## 10. Next Steps

1. **Phase 1**: Implement Super Admin module with basic CRUD operations
2. **Phase 2**: Develop Broker module with client management capabilities
3. **Phase 3**: Create Business Owner module with POS and inventory features
4. **Phase 4**: Add funding application and reporting functionality
5. **Phase 5**: Integrate external services (Stripe, Uber Eats)
6. **Phase 6**: Implement advanced analytics and monitoring

This implementation guide provides a comprehensive roadmap for building the TODO7aug.md requirements using NestJS best practices, proper authentication, and thorough testing methodologies.