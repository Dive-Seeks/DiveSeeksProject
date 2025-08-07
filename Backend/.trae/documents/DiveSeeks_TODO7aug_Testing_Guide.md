# DiveSeeks TODO7aug Testing and Validation Guide

## 1. Testing Overview

This guide provides comprehensive testing procedures for the three core modules implemented from TODO7aug.md:
1. **Super Admin Module** - System administration and broker management
2. **Broker Module** - Business owner onboarding and management
3. **Business Owner Module** - POS operations, inventory, and reporting

## 2. Testing Environment Setup

### 2.1 Prerequisites
```bash
# Ensure testing tools are installed
pip install httpie  # For API testing
npm install -g newman  # For Postman collection testing (optional)

# Start the application in development mode
cd e:\DiveSeeksProject\Backend
npm run start:dev

# Verify server is running
curl -X GET http://localhost:3000/health
```

### 2.2 Test Data Setup
```bash
# Create test database (if using separate test DB)
createdb diveseeks_test

# Run migrations
npm run migration:run

# Seed initial test data
npm run seed:test
```

### 2.3 Environment Variables for Testing
```bash
# Test environment configuration
export NODE_ENV=test
export DATABASE_URL=postgresql://username:password@localhost:5432/diveseeks_test
export JWT_SECRET=test-jwt-secret-key
export JWT_EXPIRATION=1h
```

## 3. Super Admin Module Testing

### 3.1 Authentication Tests

**Test Case 1: Super Admin Login**
```bash
# Test successful login
http POST localhost:3000/auth/login \
  email=admin@diveseeks.com \
  password=admin123

# Expected Response:
# {
#   "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
#   "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
#   "user": {
#     "id": "uuid",
#     "email": "admin@diveseeks.com",
#     "role": "SUPER_ADMIN"
#   }
# }

# Save token for subsequent tests
export SUPER_ADMIN_TOKEN="your_access_token_here"
```

**Test Case 2: Invalid Login Credentials**
```bash
# Test with wrong password
http POST localhost:3000/auth/login \
  email=admin@diveseeks.com \
  password=wrongpassword

# Expected Response: 401 Unauthorized
# {
#   "statusCode": 401,
#   "message": "Invalid credentials",
#   "error": "Unauthorized"
# }
```

### 3.2 Broker Management Tests

**Test Case 3: Create Broker**
```bash
# Test successful broker creation
http POST localhost:3000/super-admin/brokers \
  Authorization:"Bearer $SUPER_ADMIN_TOKEN" \
  email=broker1@example.com \
  firstName=John \
  lastName=Doe \
  companyName="Broker Solutions LLC" \
  commissionRate:=5.5 \
  phoneNumber="+1234567890" \
  address="123 Business St, City, State"

# Expected Response: 201 Created
# {
#   "id": "broker-uuid",
#   "email": "broker1@example.com",
#   "firstName": "John",
#   "lastName": "Doe",
#   "companyName": "Broker Solutions LLC",
#   "commissionRate": 5.5,
#   "temporaryPassword": "TempPass123",
#   "isActive": true,
#   "createdAt": "2024-01-15T10:30:00Z"
# }

# Save broker ID for subsequent tests
export BROKER_ID="broker-uuid-from-response"
```

**Test Case 4: Duplicate Email Validation**
```bash
# Test creating broker with existing email
http POST localhost:3000/super-admin/brokers \
  Authorization:"Bearer $SUPER_ADMIN_TOKEN" \
  email=broker1@example.com \
  firstName=Jane \
  lastName=Smith \
  companyName="Another Company"

# Expected Response: 409 Conflict
# {
#   "statusCode": 409,
#   "message": "Broker with this email already exists",
#   "error": "Conflict"
# }
```

**Test Case 5: Get All Brokers with Pagination**
```bash
# Test broker listing with pagination
http GET localhost:3000/super-admin/brokers \
  Authorization:"Bearer $SUPER_ADMIN_TOKEN" \
  page==1 \
  limit==10

# Expected Response: 200 OK
# {
#   "data": [
#     {
#       "id": "broker-uuid",
#       "email": "broker1@example.com",
#       "firstName": "John",
#       "lastName": "Doe",
#       "companyName": "Broker Solutions LLC",
#       "commissionRate": 5.5,
#       "isActive": true,
#       "createdAt": "2024-01-15T10:30:00Z"
#     }
#   ],
#   "total": 1,
#   "page": 1,
#   "totalPages": 1
# }
```

**Test Case 6: Search Brokers**
```bash
# Test broker search functionality
http GET localhost:3000/super-admin/brokers \
  Authorization:"Bearer $SUPER_ADMIN_TOKEN" \
  search==john

# Expected Response: Filtered results containing "john" in name, email, or company
```

**Test Case 7: Update Broker**
```bash
# Test broker update
http PATCH localhost:3000/super-admin/brokers/$BROKER_ID \
  Authorization:"Bearer $SUPER_ADMIN_TOKEN" \
  companyName="Updated Broker Solutions LLC" \
  commissionRate:=7.0

# Expected Response: 200 OK with updated broker data
```

**Test Case 8: Toggle Broker Status**
```bash
# Test broker status toggle
http PATCH localhost:3000/super-admin/brokers/$BROKER_ID/toggle-status \
  Authorization:"Bearer $SUPER_ADMIN_TOKEN"

# Expected Response: 200 OK with updated isActive status
```

**Test Case 9: Delete Broker**
```bash
# Test broker deletion
http DELETE localhost:3000/super-admin/brokers/$BROKER_ID \
  Authorization:"Bearer $SUPER_ADMIN_TOKEN"

# Expected Response: 200 OK
# {
#   "message": "Broker deleted successfully"
# }
```

### 3.3 Authorization Tests

**Test Case 10: Unauthorized Access**
```bash
# Test access without token
http GET localhost:3000/super-admin/brokers

# Expected Response: 401 Unauthorized
```

**Test Case 11: Invalid Role Access**
```bash
# Test access with broker token (should fail)
http GET localhost:3000/super-admin/brokers \
  Authorization:"Bearer $BROKER_TOKEN"

# Expected Response: 403 Forbidden
```

## 4. Broker Module Testing

### 4.1 Broker Authentication

**Test Case 12: Broker Login**
```bash
# Test broker login with temporary password
http POST localhost:3000/auth/login \
  email=broker1@example.com \
  password=TempPass123

# Save broker token
export BROKER_TOKEN="broker_access_token_here"
```

### 4.2 Broker Profile Management

**Test Case 13: Get Broker Profile**
```bash
# Test getting broker profile
http GET localhost:3000/brokers/profile \
  Authorization:"Bearer $BROKER_TOKEN"

# Expected Response: 200 OK with broker profile data
```

**Test Case 14: Update Broker Profile**
```bash
# Test profile update
http PATCH localhost:3000/brokers/profile \
  Authorization:"Bearer $BROKER_TOKEN" \
  firstName=UpdatedJohn \
  website=https://brokerexample.com \
  commissionRate:=6.5

# Expected Response: 200 OK with updated profile
```

### 4.3 Business Owner Management

**Test Case 15: Create Business Owner**
```bash
# Test business owner creation
http POST localhost:3000/brokers/business-owners \
  Authorization:"Bearer $BROKER_TOKEN" \
  email=owner1@restaurant.com \
  firstName=Jane \
  lastName=Smith \
  businessName="Pizza Palace" \
  businessType=RESTAURANT \
  businessAddress="456 Food St, City, State" \
  phoneNumber="+1987654321"

# Expected Response: 201 Created
# {
#   "id": "owner-uuid",
#   "email": "owner1@restaurant.com",
#   "firstName": "Jane",
#   "lastName": "Smith",
#   "businessName": "Pizza Palace",
#   "businessType": "RESTAURANT",
#   "temporaryPassword": "OwnerPass123",
#   "defaultSettings": {
#     "posLayout": "grid",
#     "taxRate": 8.5,
#     "currency": "USD",
#     "inventoryTracking": true
#   }
# }

# Save owner ID and password
export OWNER_ID="owner-uuid-from-response"
export OWNER_TEMP_PASSWORD="OwnerPass123"
```

**Test Case 16: Get Business Owners**
```bash
# Test getting business owners list
http GET localhost:3000/brokers/business-owners \
  Authorization:"Bearer $BROKER_TOKEN" \
  page==1 \
  limit==10

# Expected Response: 200 OK with paginated business owners
```

**Test Case 17: Broker Dashboard**
```bash
# Test broker dashboard data
http GET localhost:3000/brokers/dashboard \
  Authorization:"Bearer $BROKER_TOKEN"

# Expected Response: 200 OK
# {
#   "broker": { /* broker profile */ },
#   "stats": {
#     "totalClients": 1,
#     "activeClients": 1,
#     "commissionRate": 6.5
#   },
#   "recentClients": [
#     {
#       "id": "owner-uuid",
#       "businessName": "Pizza Palace",
#       "businessType": "RESTAURANT",
#       "createdAt": "2024-01-15T11:00:00Z"
#     }
#   ]
# }
```

## 5. Business Owner Module Testing

### 5.1 Business Owner Authentication

**Test Case 18: Business Owner Login**
```bash
# Test business owner login
http POST localhost:3000/auth/login \
  email=owner1@restaurant.com \
  password=$OWNER_TEMP_PASSWORD

# Save owner token
export OWNER_TOKEN="owner_access_token_here"
```

### 5.2 Dashboard and Overview

**Test Case 19: Business Owner Dashboard**
```bash
# Test dashboard data
http GET localhost:3000/business-owners/dashboard \
  Authorization:"Bearer $OWNER_TOKEN"

# Expected Response: 200 OK
# {
#   "businessOwner": {
#     "id": "owner-uuid",
#     "businessName": "Pizza Palace",
#     "businessType": "RESTAURANT"
#   },
#   "todaySales": {
#     "total": 0,
#     "count": 0
#   },
#   "weekSales": {
#     "total": 0,
#     "count": 0
#   },
#   "topProducts": [],
#   "recentOrders": [],
#   "inventoryAlerts": []
# }
```

### 5.3 Inventory Management

**Test Case 20: Add Inventory Item**
```bash
# Test adding inventory item
http POST localhost:3000/business-owners/inventory \
  Authorization:"Bearer $OWNER_TOKEN" \
  name="Margherita Pizza" \
  category=FOOD \
  price:=12.99 \
  cost:=6.50 \
  stock:=50 \
  minStock:=10 \
  description="Classic pizza with tomato and mozzarella"

# Expected Response: 201 Created
# {
#   "id": "product-uuid",
#   "name": "Margherita Pizza",
#   "category": "FOOD",
#   "price": 12.99,
#   "cost": 6.50,
#   "stockQuantity": 50,
#   "minStockLevel": 10,
#   "description": "Classic pizza with tomato and mozzarella",
#   "isActive": true
# }

# Save product ID
export PRODUCT_ID="product-uuid-from-response"
```

**Test Case 21: Get Inventory**
```bash
# Test inventory listing
http GET localhost:3000/business-owners/inventory \
  Authorization:"Bearer $OWNER_TOKEN" \
  page==1 \
  limit==20

# Expected Response: 200 OK with paginated inventory
```

### 5.4 POS Transaction Processing

**Test Case 22: Process POS Transaction**
```bash
# Test POS transaction processing
http POST localhost:3000/business-owners/pos/transactions \
  Authorization:"Bearer $OWNER_TOKEN" \
  items:='[
    {
      "productId": "'$PRODUCT_ID'",
      "name": "Margherita Pizza",
      "quantity": 2,
      "unitPrice": 12.99,
      "totalPrice": 25.98
    }
  ]' \
  total:=28.08 \
  paymentMethod=CARD \
  taxAmount:=2.10

# Expected Response: 201 Created
# {
#   "transaction": {
#     "id": "transaction-uuid",
#     "transactionId": "TXN-1642248600000-abc123def",
#     "amount": 28.08,
#     "paymentMethod": "CARD",
#     "status": "COMPLETED",
#     "processedAt": "2024-01-15T12:30:00Z"
#   },
#   "receipt": {
#     "transactionId": "TXN-1642248600000-abc123def",
#     "items": [ /* transaction items */ ],
#     "subtotal": 25.98,
#     "tax": 2.10,
#     "discount": 0,
#     "total": 28.08,
#     "paymentMethod": "CARD",
#     "timestamp": "2024-01-15T12:30:00Z"
#   }
# }
```

**Test Case 23: Multiple Item Transaction**
```bash
# Test transaction with multiple items
http POST localhost:3000/business-owners/pos/transactions \
  Authorization:"Bearer $OWNER_TOKEN" \
  items:='[
    {
      "productId": "'$PRODUCT_ID'",
      "name": "Margherita Pizza",
      "quantity": 1,
      "unitPrice": 12.99,
      "totalPrice": 12.99
    },
    {
      "productId": "product-2-id",
      "name": "Pepperoni Pizza",
      "quantity": 1,
      "unitPrice": 14.99,
      "totalPrice": 14.99
    }
  ]' \
  total:=30.17 \
  paymentMethod=CASH \
  taxAmount:=2.19

# Expected Response: 201 Created with multiple items processed
```

### 5.5 Reporting and Analytics

**Test Case 24: Sales Reports**
```bash
# Test daily sales report
http GET localhost:3000/business-owners/reports/sales \
  Authorization:"Bearer $OWNER_TOKEN" \
  startDate==2024-01-01 \
  endDate==2024-01-31 \
  groupBy==day

# Expected Response: 200 OK
# {
#   "summary": {
#     "totalSales": 58.25,
#     "totalTransactions": 2,
#     "averageTransaction": 29.125
#   },
#   "chartData": [
#     {
#       "period": "2024-01-15",
#       "totalSales": 58.25,
#       "transactionCount": 2,
#       "averageTransaction": 29.125
#     }
#   ]
# }
```

**Test Case 25: Monthly Sales Report**
```bash
# Test monthly sales report
http GET localhost:3000/business-owners/reports/sales \
  Authorization:"Bearer $OWNER_TOKEN" \
  startDate==2024-01-01 \
  endDate==2024-12-31 \
  groupBy==month

# Expected Response: 200 OK with monthly aggregated data
```

## 6. Error Handling and Edge Cases

### 6.1 Validation Error Tests

**Test Case 26: Invalid Email Format**
```bash
# Test invalid email in broker creation
http POST localhost:3000/super-admin/brokers \
  Authorization:"Bearer $SUPER_ADMIN_TOKEN" \
  email=invalid-email \
  firstName=Test \
  lastName=User \
  companyName="Test Company"

# Expected Response: 400 Bad Request
# {
#   "statusCode": 400,
#   "message": ["email must be an email"],
#   "error": "Bad Request"
# }
```

**Test Case 27: Missing Required Fields**
```bash
# Test missing required fields
http POST localhost:3000/brokers/business-owners \
  Authorization:"Bearer $BROKER_TOKEN" \
  email=test@example.com
  # Missing firstName, lastName, businessName, businessType

# Expected Response: 400 Bad Request with validation errors
```

**Test Case 28: Invalid Commission Rate**
```bash
# Test invalid commission rate (over 100%)
http POST localhost:3000/super-admin/brokers \
  Authorization:"Bearer $SUPER_ADMIN_TOKEN" \
  email=test@example.com \
  firstName=Test \
  lastName=User \
  companyName="Test Company" \
  commissionRate:=150

# Expected Response: 400 Bad Request
```

### 6.2 Resource Not Found Tests

**Test Case 29: Non-existent Broker**
```bash
# Test getting non-existent broker
http GET localhost:3000/super-admin/brokers/non-existent-uuid \
  Authorization:"Bearer $SUPER_ADMIN_TOKEN"

# Expected Response: 404 Not Found
```

**Test Case 30: Invalid UUID Format**
```bash
# Test invalid UUID format
http GET localhost:3000/super-admin/brokers/invalid-uuid \
  Authorization:"Bearer $SUPER_ADMIN_TOKEN"

# Expected Response: 400 Bad Request
```

## 7. Performance and Load Testing

### 7.1 Concurrent Request Testing

**Test Case 31: Concurrent Broker Creation**
```bash
# Create multiple brokers concurrently
for i in {1..10}; do
  http POST localhost:3000/super-admin/brokers \
    Authorization:"Bearer $SUPER_ADMIN_TOKEN" \
    email=broker$i@example.com \
    firstName=Broker$i \
    lastName=User \
    companyName="Company $i" &
done
wait

# Verify all brokers were created successfully
http GET localhost:3000/super-admin/brokers \
  Authorization:"Bearer $SUPER_ADMIN_TOKEN" \
  limit==20
```

**Test Case 32: Concurrent POS Transactions**
```bash
# Process multiple transactions concurrently
for i in {1..5}; do
  http POST localhost:3000/business-owners/pos/transactions \
    Authorization:"Bearer $OWNER_TOKEN" \
    items:='[{"productId":"'$PRODUCT_ID'","name":"Test Product","quantity":1,"unitPrice":10.00,"totalPrice":10.00}]' \
    total:=10.80 \
    paymentMethod=CARD \
    taxAmount:=0.80 &
done
wait
```

### 7.2 Database Performance Tests

**Test Case 33: Large Dataset Pagination**
```bash
# Test pagination with large datasets
# First create many business owners
for i in {1..100}; do
  http POST localhost:3000/brokers/business-owners \
    Authorization:"Bearer $BROKER_TOKEN" \
    email=owner$i@test.com \
    firstName=Owner$i \
    lastName=User \
    businessName="Business $i" \
    businessType=RETAIL > /dev/null &
  
  # Limit concurrent requests
  if (( i % 10 == 0 )); then
    wait
  fi
done
wait

# Test pagination performance
time http GET localhost:3000/brokers/business-owners \
  Authorization:"Bearer $BROKER_TOKEN" \
  page==1 \
  limit==50
```

## 8. Integration Testing

### 8.1 End-to-End Workflow Tests

**Test Case 34: Complete Business Onboarding Flow**
```bash
#!/bin/bash
# Complete workflow test script

echo "=== Starting End-to-End Test ==="

# Step 1: Super Admin creates broker
echo "Step 1: Creating broker..."
BROKER_RESPONSE=$(http POST localhost:3000/super-admin/brokers \
  Authorization:"Bearer $SUPER_ADMIN_TOKEN" \
  email=e2e-broker@test.com \
  firstName=E2E \
  lastName=Broker \
  companyName="E2E Test Company")

BROKER_ID=$(echo $BROKER_RESPONSE | jq -r '.id')
BROKER_TEMP_PASS=$(echo $BROKER_RESPONSE | jq -r '.temporaryPassword')

echo "Broker created: $BROKER_ID"

# Step 2: Broker logs in
echo "Step 2: Broker login..."
BROKER_LOGIN=$(http POST localhost:3000/auth/login \
  email=e2e-broker@test.com \
  password=$BROKER_TEMP_PASS)

BROKER_TOKEN=$(echo $BROKER_LOGIN | jq -r '.access_token')
echo "Broker logged in successfully"

# Step 3: Broker creates business owner
echo "Step 3: Creating business owner..."
OWNER_RESPONSE=$(http POST localhost:3000/brokers/business-owners \
  Authorization:"Bearer $BROKER_TOKEN" \
  email=e2e-owner@test.com \
  firstName=E2E \
  lastName=Owner \
  businessName="E2E Test Restaurant" \
  businessType=RESTAURANT)

OWNER_ID=$(echo $OWNER_RESPONSE | jq -r '.id')
OWNER_TEMP_PASS=$(echo $OWNER_RESPONSE | jq -r '.temporaryPassword')

echo "Business owner created: $OWNER_ID"

# Step 4: Business owner logs in
echo "Step 4: Business owner login..."
OWNER_LOGIN=$(http POST localhost:3000/auth/login \
  email=e2e-owner@test.com \
  password=$OWNER_TEMP_PASS)

OWNER_TOKEN=$(echo $OWNER_LOGIN | jq -r '.access_token')
echo "Business owner logged in successfully"

# Step 5: Business owner adds inventory
echo "Step 5: Adding inventory..."
PRODUCT_RESPONSE=$(http POST localhost:3000/business-owners/inventory \
  Authorization:"Bearer $OWNER_TOKEN" \
  name="E2E Test Pizza" \
  category=FOOD \
  price:=15.99 \
  cost:=8.00 \
  stock:=25 \
  minStock:=5)

PRODUCT_ID=$(echo $PRODUCT_RESPONSE | jq -r '.id')
echo "Product added: $PRODUCT_ID"

# Step 6: Process POS transaction
echo "Step 6: Processing transaction..."
TRANSACTION_RESPONSE=$(http POST localhost:3000/business-owners/pos/transactions \
  Authorization:"Bearer $OWNER_TOKEN" \
  items:='[{"productId":"'$PRODUCT_ID'","name":"E2E Test Pizza","quantity":2,"unitPrice":15.99,"totalPrice":31.98}]' \
  total:=34.58 \
  paymentMethod=CARD \
  taxAmount:=2.60)

TRANSACTION_ID=$(echo $TRANSACTION_RESPONSE | jq -r '.transaction.transactionId')
echo "Transaction processed: $TRANSACTION_ID"

# Step 7: Verify dashboard updates
echo "Step 7: Verifying dashboard..."
DASHBOARD=$(http GET localhost:3000/business-owners/dashboard \
  Authorization:"Bearer $OWNER_TOKEN")

TODAY_SALES=$(echo $DASHBOARD | jq -r '.todaySales.total')
echo "Today's sales: $TODAY_SALES"

if [ "$TODAY_SALES" = "34.58" ]; then
  echo "✅ End-to-End test PASSED"
else
  echo "❌ End-to-End test FAILED - Expected sales: 34.58, Got: $TODAY_SALES"
fi

echo "=== End-to-End Test Complete ==="
```

## 9. Security Testing

### 9.1 Authentication Security Tests

**Test Case 35: JWT Token Manipulation**
```bash
# Test with manipulated JWT token
MANIPULATED_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.manipulated.signature"

http GET localhost:3000/super-admin/brokers \
  Authorization:"Bearer $MANIPULATED_TOKEN"

# Expected Response: 401 Unauthorized
```

**Test Case 36: Expired Token**
```bash
# Test with expired token (if you have one)
EXPIRED_TOKEN="expired_jwt_token_here"

http GET localhost:3000/brokers/dashboard \
  Authorization:"Bearer $EXPIRED_TOKEN"

# Expected Response: 401 Unauthorized
```

### 9.2 Authorization Security Tests

**Test Case 37: Cross-Role Access**
```bash
# Test broker trying to access super admin endpoints
http GET localhost:3000/super-admin/brokers \
  Authorization:"Bearer $BROKER_TOKEN"

# Expected Response: 403 Forbidden
```

**Test Case 38: Cross-Tenant Data Access**
```bash
# Create second broker and business owner
# Then test if first business owner can access second's data
# This should be prevented by proper data isolation
```

## 10. Test Automation and CI/CD

### 10.1 Automated Test Suite

**Create test script: `test-suite.sh`**
```bash
#!/bin/bash

# DiveSeeks API Test Suite
set -e

echo "🚀 Starting DiveSeeks API Test Suite"

# Source environment variables
source .env.test

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counters
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Function to run test and check result
run_test() {
  local test_name="$1"
  local test_command="$2"
  local expected_status="$3"
  
  echo -e "${YELLOW}Running: $test_name${NC}"
  TOTAL_TESTS=$((TOTAL_TESTS + 1))
  
  if eval "$test_command" > /dev/null 2>&1; then
    if [ "$expected_status" = "success" ]; then
      echo -e "${GREEN}✅ PASSED: $test_name${NC}"
      PASSED_TESTS=$((PASSED_TESTS + 1))
    else
      echo -e "${RED}❌ FAILED: $test_name (expected failure but got success)${NC}"
      FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
  else
    if [ "$expected_status" = "failure" ]; then
      echo -e "${GREEN}✅ PASSED: $test_name (expected failure)${NC}"
      PASSED_TESTS=$((PASSED_TESTS + 1))
    else
      echo -e "${RED}❌ FAILED: $test_name${NC}"
      FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
  fi
}

# Setup test data
echo "📋 Setting up test data..."

# Get super admin token
SUPER_ADMIN_LOGIN=$(http POST localhost:3000/auth/login email=admin@diveseeks.com password=admin123)
SUPER_ADMIN_TOKEN=$(echo $SUPER_ADMIN_LOGIN | jq -r '.access_token')

# Run tests
echo "🧪 Running tests..."

# Authentication tests
run_test "Super Admin Login" \
  "http POST localhost:3000/auth/login email=admin@diveseeks.com password=admin123" \
  "success"

run_test "Invalid Login" \
  "http POST localhost:3000/auth/login email=admin@diveseeks.com password=wrongpass" \
  "failure"

# Super Admin tests
run_test "Create Broker" \
  "http POST localhost:3000/super-admin/brokers Authorization:'Bearer $SUPER_ADMIN_TOKEN' email=test@broker.com firstName=Test lastName=Broker companyName='Test Company'" \
  "success"

run_test "Get Brokers" \
  "http GET localhost:3000/super-admin/brokers Authorization:'Bearer $SUPER_ADMIN_TOKEN'" \
  "success"

# Add more tests here...

# Print results
echo ""
echo "📊 Test Results:"
echo -e "${GREEN}Passed: $PASSED_TESTS${NC}"
echo -e "${RED}Failed: $FAILED_TESTS${NC}"
echo "Total: $TOTAL_TESTS"

if [ $FAILED_TESTS -eq 0 ]; then
  echo -e "${GREEN}🎉 All tests passed!${NC}"
  exit 0
else
  echo -e "${RED}💥 Some tests failed!${NC}"
  exit 1
fi
```

### 10.2 Make Test Script Executable
```bash
chmod +x test-suite.sh

# Run the test suite
./test-suite.sh
```

## 11. Test Documentation and Reporting

### 11.1 Test Coverage Report
```bash
# Generate test coverage report
npm run test:cov

# View coverage report
open coverage/lcov-report/index.html
```

### 11.2 API Documentation Testing
```bash
# Test Swagger documentation accessibility
curl -X GET http://localhost:3000/api

# Verify all endpoints are documented
curl -X GET http://localhost:3000/api-json
```

This comprehensive testing guide ensures all functionality is thoroughly validated and provides a solid foundation for maintaining code quality as the project evolves.