const fs = require('fs');
const path = require('path');

// List of test files that need fixing
const testFiles = [
  'src/modules/orders/orders.service.spec.ts',
  'src/modules/orders/orders.controller.spec.ts',
  'src/modules/products/products.service.spec.ts',
  'src/modules/products/products.controller.spec.ts',
  'src/modules/customers/customers.service.spec.ts',
  'src/modules/customers/customers.controller.spec.ts',
  'src/modules/payments/payments.service.spec.ts',
  'src/modules/payments/payments.controller.spec.ts',
  'src/modules/uploads/uploads/uploads.service.spec.ts',
  'src/modules/uploads/uploads/uploads.controller.spec.ts',
  'src/modules/reports/reports/reports.service.spec.ts',
  'src/modules/reports/reports/reports.controller.spec.ts',
  'src/modules/notifications/notifications.service.spec.ts',
  'src/modules/notifications/notifications.controller.spec.ts',
  'src/modules/businesses/businesses.service.spec.ts',
  'src/modules/businesses/businesses.controller.spec.ts',
  'src/modules/inventory/inventory.service.spec.ts',
  'src/modules/inventory/inventory.controller.spec.ts',
  'src/modules/pos/pos.service.spec.ts',
  'src/modules/pos/pos.controller.spec.ts',
  'src/modules/branches/branches.service.spec.ts',
  'src/modules/branches/branches.controller.spec.ts'
];

// Function to fix service test files
function fixServiceTest(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const serviceName = path.basename(filePath).replace('.spec.ts', '').split('.').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join('');
  
  const mockRepositoryMethods = `
  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    count: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };`;

  const newContent = content
    .replace(
      /import { Test, TestingModule } from '@nestjs\/testing';/,
      `import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';`
    )
    .replace(
      /providers: \[\w+Service\],/,
      `providers: [
        ${serviceName},
        {
          provide: getRepositoryToken(Object),
          useValue: mockRepository,
        },
      ],`
    )
    .replace(
      /describe\('\w+Service', \(\) => {\s*let service: \w+Service;/,
      match => match + mockRepositoryMethods
    );

  fs.writeFileSync(filePath, newContent);
}

// Function to fix controller test files
function fixControllerTest(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const serviceName = path.basename(filePath).replace('.controller.spec.ts', '').split('.').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join('') + 'Service';
  
  const mockServiceMethods = `
  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };`;

  const newContent = content
    .replace(
      /providers: \[\w+Service\],/,
      `providers: [
        {
          provide: ${serviceName},
          useValue: mockService,
        },
      ],`
    )
    .replace(
      /describe\('\w+Controller', \(\) => {\s*let controller: \w+Controller;/,
      match => match + mockServiceMethods
    );

  fs.writeFileSync(filePath, newContent);
}

// Process all test files
testFiles.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    if (file.includes('.service.spec.ts')) {
      fixServiceTest(fullPath);
      console.log(`Fixed service test: ${file}`);
    } else if (file.includes('.controller.spec.ts')) {
      fixControllerTest(fullPath);
      console.log(`Fixed controller test: ${file}`);
    }
  } else {
    console.log(`File not found: ${file}`);
  }
});

console.log('Test fixing completed!');