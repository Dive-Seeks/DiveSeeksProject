# NestJS Backend Project Rules

## 1. Repository Creation
Every new repository must be created using the NestJS CLI command: `nest g res <repository-name>`.

## 2. Swagger Documentation
Swagger documentation must always be properly applied to created repositries.

## 3. Code Nesting
After repository creation, code following `.spec.ts` must adhere to NestJS nesting conventions.

## 4. Logical Testing
New repositories must be logically tested on the terminal using one of the following methods:

✅ 1. `curl` (built into most terminals)
   Example: Testing a GET endpoint
   ```bash
   curl -X GET http://localhost:3000/products
   ```
   Example: Sending a POST request with JSON body:
   ```bash
   curl -X POST http://localhost:3000/products \
     -H "Content-Type: application/json"  \
     -d '{"name":"Burger","price":5.99}'
   ```

✅ 2. `httpie` (easier and more readable than curl)
   Install it first:
   ```bash
   pip install httpie
   ```
   GET example:
   ```bash
   http GET http://localhost:3000/products
   ```
   POST example:
   ```bash
   http POST http://localhost:3000/products name=Burger price:=5.99
   ```

✅ 3. Use NestJS built-in Swagger Docs (for copying curl commands)
   If you've enabled Swagger (usually at `/api` or `/docs`), you can:
   - Open Swagger UI in your browser
   - Fill the request and click “Try it out”
   - Then click “curl” to copy the terminal command for testing

✅ 4. Custom CLI for Dev/Debug
   You can create custom test scripts in your NestJS app to run:
   ```bash
   npm run test:api
   ```
   Or inside a CLI file like `scripts/test-product-api.ts` using Axios or fetch and run with:
   ```bash
   ts-node scripts/test-product-api.ts
   ```

🔐 For Authenticated Routes
If you need JWT token:
```bash
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" http://localhost:3000/protected
```


