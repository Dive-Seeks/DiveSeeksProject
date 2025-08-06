# DiveSeeks Ltd Deployment Guide - Layer 1

## 1. Environment Configuration

### 1.1 Environment Variables

#### Development Environment (.env.development)

```bash
# Application Configuration
NODE_ENV=development
PORT=3000
API_PREFIX=api/v1
APP_NAME=DiveSeeks Ltd Backend
APP_VERSION=1.0.0

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=diveseeks_dev
DB_PASSWORD=dev_password_123
DB_NAME=diveseeks_development
DB_SSL=false
DB_LOGGING=true

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-for-development
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-super-secret-refresh-key-for-development
JWT_REFRESH_EXPIRES_IN=7d

# Redis Configuration (for sessions and caching)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# File Upload Configuration
UPLOAD_DEST=./uploads
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,application/pdf

# Email Configuration (for notifications)
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your_mailtrap_user
SMTP_PASS=your_mailtrap_password
SMTP_FROM=noreply@diveseeks.com

# SMS Configuration (Twilio)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# Rate Limiting
RATE_LIMIT_TTL=60
RATE_LIMIT_LIMIT=100

# Logging
LOG_LEVEL=debug
LOG_FILE=logs/app.log

# Security
CORS_ORIGIN=http://localhost:3001,http://localhost:3000
HELMET_ENABLED=true

# Monitoring
HEALTH_CHECK_ENABLED=true
METRICS_ENABLED=true
```

#### Production Environment (.env.production)

```bash
# Application Configuration
NODE_ENV=production
PORT=3000
API_PREFIX=api/v1
APP_NAME=DiveSeeks Ltd Backend
APP_VERSION=1.0.0

# Database Configuration
DB_HOST=your-production-db-host
DB_PORT=5432
DB_USERNAME=diveseeks_prod
DB_PASSWORD=your-super-secure-production-password
DB_NAME=diveseeks_production
DB_SSL=true
DB_LOGGING=false
DB_POOL_SIZE=20
DB_CONNECTION_TIMEOUT=60000

# JWT Configuration
JWT_SECRET=your-super-secure-jwt-secret-for-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-super-secure-refresh-secret-for-production
JWT_REFRESH_EXPIRES_IN=7d

# Redis Configuration
REDIS_HOST=your-redis-cluster-endpoint
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password
REDIS_DB=0
REDIS_TLS=true

# Stripe Configuration
STRIPE_SECRET_KEY=sk_live_your_live_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_live_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_live_webhook_secret

# File Upload Configuration (AWS S3)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=diveseeks-uploads
CLOUDFRONT_DOMAIN=https://cdn.diveseeks.com

# Email Configuration (AWS SES)
AWS_SES_REGION=us-east-1
SMTP_FROM=noreply@diveseeks.com

# SMS Configuration (Twilio)
TWILIO_ACCOUNT_SID=your_production_twilio_account_sid
TWILIO_AUTH_TOKEN=your_production_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# Rate Limiting
RATE_LIMIT_TTL=60
RATE_LIMIT_LIMIT=1000

# Logging
LOG_LEVEL=info
LOG_FILE=/var/log/diveseeks/app.log

# Security
CORS_ORIGIN=https://app.diveseeks.com,https://pos.diveseeks.com
HELMET_ENABLED=true
TRUST_PROXY=true

# Monitoring
HEALTH_CHECK_ENABLED=true
METRICS_ENABLED=true
APM_SERVER_URL=https://your-apm-server.com
APM_SECRET_TOKEN=your_apm_secret_token
```

### 1.2 Configuration Service

```typescript
// config/app.config.ts
export default () => ({
  app: {
    name: process.env.APP_NAME || 'DiveSeeks Ltd Backend',
    version: process.env.APP_VERSION || '1.0.0',
    port: parseInt(process.env.PORT, 10) || 3000,
    apiPrefix: process.env.API_PREFIX || 'api/v1',
    environment: process.env.NODE_ENV || 'development',
  },
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    name: process.env.DB_NAME || 'diveseeks',
    ssl: process.env.DB_SSL === 'true',
    logging: process.env.DB_LOGGING === 'true',
    poolSize: parseInt(process.env.DB_POOL_SIZE, 10) || 10,
    connectionTimeout: parseInt(process.env.DB_CONNECTION_TIMEOUT, 10) || 30000,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'fallback-secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    db: parseInt(process.env.REDIS_DB, 10) || 0,
    tls: process.env.REDIS_TLS === 'true',
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  },
  upload: {
    destination: process.env.UPLOAD_DEST || './uploads',
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE, 10) || 10485760,
    allowedTypes: process.env.ALLOWED_FILE_TYPES?.split(',') || ['image/jpeg', 'image/png'],
  },
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION || 'us-east-1',
    s3Bucket: process.env.AWS_S3_BUCKET,
    cloudFrontDomain: process.env.CLOUDFRONT_DOMAIN,
  },
  email: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10) || 587,
    user: process.env.SMTP_USER,
    password: process.env.SMTP_PASS,
    from: process.env.SMTP_FROM || 'noreply@diveseeks.com',
  },
  sms: {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    phoneNumber: process.env.TWILIO_PHONE_NUMBER,
  },
  security: {
    corsOrigin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
    helmetEnabled: process.env.HELMET_ENABLED === 'true',
    trustProxy: process.env.TRUST_PROXY === 'true',
  },
  rateLimit: {
    ttl: parseInt(process.env.RATE_LIMIT_TTL, 10) || 60,
    limit: parseInt(process.env.RATE_LIMIT_LIMIT, 10) || 100,
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || 'logs/app.log',
  },
  monitoring: {
    healthCheckEnabled: process.env.HEALTH_CHECK_ENABLED === 'true',
    metricsEnabled: process.env.METRICS_ENABLED === 'true',
    apmServerUrl: process.env.APM_SERVER_URL,
    apmSecretToken: process.env.APM_SECRET_TOKEN,
  },
});
```

## 2. Docker Configuration

### 2.1 Dockerfile

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
RUN npm ci --only=production && npm cache clean --force

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application
RUN npm run build

# Production image, copy all the files and run nest
FROM base AS runner
WORKDIR /app

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# Copy built application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Create uploads directory
RUN mkdir -p uploads logs
RUN chown -R nestjs:nodejs /app

USER nestjs

EXPOSE 3000

ENV NODE_ENV=production

CMD ["node", "dist/main"]
```

### 2.2 Docker Compose (Development)

```yaml
# docker-compose.yml
version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:15-alpine
    container_name: diveseeks-postgres
    environment:
      POSTGRES_DB: diveseeks_development
      POSTGRES_USER: diveseeks_dev
      POSTGRES_PASSWORD: dev_password_123
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./database/init:/docker-entrypoint-initdb.d
    networks:
      - diveseeks-network

  # Redis Cache
  redis:
    image: redis:7-alpine
    container_name: diveseeks-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - diveseeks-network

  # Backend Application
  backend:
    build:
      context: .
      dockerfile: Dockerfile
      target: builder
    container_name: diveseeks-backend
    environment:
      - NODE_ENV=development
      - DB_HOST=postgres
      - REDIS_HOST=redis
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
      - ./uploads:/app/uploads
      - ./logs:/app/logs
    depends_on:
      - postgres
      - redis
    networks:
      - diveseeks-network
    command: npm run start:dev

  # pgAdmin (Database Management)
  pgadmin:
    image: dpage/pgadmin4:latest
    container_name: diveseeks-pgadmin
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@diveseeks.com
      PGADMIN_DEFAULT_PASSWORD: admin123
    ports:
      - "5050:80"
    depends_on:
      - postgres
    networks:
      - diveseeks-network

  # Redis Commander (Redis Management)
  redis-commander:
    image: rediscommander/redis-commander:latest
    container_name: diveseeks-redis-commander
    environment:
      REDIS_HOSTS: local:redis:6379
    ports:
      - "8081:8081"
    depends_on:
      - redis
    networks:
      - diveseeks-network

volumes:
  postgres_data:
  redis_data:

networks:
  diveseeks-network:
    driver: bridge
```

### 2.3 Docker Compose (Production)

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  # Backend Application
  backend:
    build:
      context: .
      dockerfile: Dockerfile
      target: runner
    container_name: diveseeks-backend-prod
    env_file:
      - .env.production
    ports:
      - "3000:3000"
    volumes:
      - ./uploads:/app/uploads
      - ./logs:/app/logs
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    networks:
      - diveseeks-network

  # Nginx Reverse Proxy
  nginx:
    image: nginx:alpine
    container_name: diveseeks-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
      - ./uploads:/var/www/uploads
    depends_on:
      - backend
    restart: unless-stopped
    networks:
      - diveseeks-network

networks:
  diveseeks-network:
    driver: bridge
```

### 2.4 Nginx Configuration

```nginx
# nginx/nginx.conf
events {
    worker_connections 1024;
}

http {
    upstream backend {
        server backend:3000;
    }

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=auth:10m rate=5r/s;

    server {
        listen 80;
        server_name api.diveseeks.com;
        
        # Redirect HTTP to HTTPS
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name api.diveseeks.com;

        # SSL Configuration
        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
        ssl_prefer_server_ciphers off;

        # Security Headers
        add_header X-Frame-Options DENY;
        add_header X-Content-Type-Options nosniff;
        add_header X-XSS-Protection "1; mode=block";
        add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload";

        # API Routes
        location /api/ {
            limit_req zone=api burst=20 nodelay;
            
            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
            
            # Timeouts
            proxy_connect_timeout 60s;
            proxy_send_timeout 60s;
            proxy_read_timeout 60s;
        }

        # Authentication Routes (stricter rate limiting)
        location /api/v1/auth/ {
            limit_req zone=auth burst=10 nodelay;
            
            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # File Uploads
        location /uploads/ {
            alias /var/www/uploads/;
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # Health Check
        location /health {
            proxy_pass http://backend;
            access_log off;
        }
    }
}
```

## 3. Database Migrations

### 3.1 Migration Configuration

```typescript
// database/data-source.ts
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_NAME'),
  entities: ['src/**/*.entity.ts'],
  migrations: ['database/migrations/*.ts'],
  synchronize: false,
  logging: configService.get('NODE_ENV') === 'development',
});
```

### 3.2 Migration Scripts

```json
// package.json scripts
{
  "scripts": {
    "migration:generate": "typeorm-ts-node-commonjs migration:generate -d database/data-source.ts",
    "migration:create": "typeorm-ts-node-commonjs migration:create",
    "migration:run": "typeorm-ts-node-commonjs migration:run -d database/data-source.ts",
    "migration:revert": "typeorm-ts-node-commonjs migration:revert -d database/data-source.ts",
    "schema:drop": "typeorm-ts-node-commonjs schema:drop -d database/data-source.ts",
    "schema:sync": "typeorm-ts-node-commonjs schema:sync -d database/data-source.ts"
  }
}
```

### 3.3 Initial Migration

```bash
# Generate initial migration
npm run migration:generate -- database/migrations/InitialSchema

# Run migrations
npm run migration:run
```

## 4. CI/CD Pipeline

### 4.1 GitHub Actions Workflow

```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

env:
  NODE_VERSION: '18'
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test_db
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
      
      redis:
        image: redis:7
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 6379:6379

    steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Run linting
      run: npm run lint

    - name: Run type checking
      run: npm run build

    - name: Run unit tests
      run: npm run test
      env:
        DB_HOST: localhost
        DB_PORT: 5432
        DB_USERNAME: postgres
        DB_PASSWORD: postgres
        DB_NAME: test_db
        REDIS_HOST: localhost
        REDIS_PORT: 6379
        JWT_SECRET: test-secret
        JWT_REFRESH_SECRET: test-refresh-secret

    - name: Run integration tests
      run: npm run test:e2e
      env:
        DB_HOST: localhost
        DB_PORT: 5432
        DB_USERNAME: postgres
        DB_PASSWORD: postgres
        DB_NAME: test_db
        REDIS_HOST: localhost
        REDIS_PORT: 6379
        JWT_SECRET: test-secret
        JWT_REFRESH_SECRET: test-refresh-secret

    - name: Upload coverage reports
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage/lcov.info

  build-and-push:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    permissions:
      contents: read
      packages: write

    steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Log in to Container Registry
      uses: docker/login-action@v3
      with:
        registry: ${{ env.REGISTRY }}
        username: ${{ github.actor }}
        password: ${{ secrets.GITHUB_TOKEN }}

    - name: Extract metadata
      id: meta
      uses: docker/metadata-action@v5
      with:
        images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
        tags: |
          type=ref,event=branch
          type=ref,event=pr
          type=sha,prefix={{branch}}-
          type=raw,value=latest,enable={{is_default_branch}}

    - name: Build and push Docker image
      uses: docker/build-push-action@v5
      with:
        context: .
        push: true
        tags: ${{ steps.meta.outputs.tags }}
        labels: ${{ steps.meta.outputs.labels }}

  deploy-staging:
    needs: build-and-push
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    environment: staging
    
    steps:
    - name: Deploy to staging
      run: |
        echo "Deploying to staging environment"
        # Add your staging deployment commands here

  deploy-production:
    needs: build-and-push
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment: production
    
    steps:
    - name: Deploy to production
      run: |
        echo "Deploying to production environment"
        # Add your production deployment commands here
```

### 4.2 Deployment Scripts

```bash
#!/bin/bash
# scripts/deploy.sh

set -e

ENVIRONMENT=${1:-staging}
IMAGE_TAG=${2:-latest}

echo "Deploying DiveSeeks Backend to $ENVIRONMENT"

# Pull latest image
docker pull ghcr.io/diveseeks/backend:$IMAGE_TAG

# Stop existing containers
docker-compose -f docker-compose.$ENVIRONMENT.yml down

# Start new containers
docker-compose -f docker-compose.$ENVIRONMENT.yml up -d

# Run database migrations
docker-compose -f docker-compose.$ENVIRONMENT.yml exec backend npm run migration:run

# Health check
echo "Waiting for application to start..."
sleep 30

if curl -f http://localhost:3000/health; then
    echo "Deployment successful!"
else
    echo "Deployment failed - health check failed"
    exit 1
fi
```

## 5. Monitoring and Logging

### 5.1 Health Check Endpoint

```typescript
// health/health.controller.ts
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
    private redis: RedisHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.db.pingCheck('database'),
      () => this.redis.checkHealth('redis'),
    ]);
  }

  @Get('ready')
  @HealthCheck()
  readiness() {
    return this.health.check([
      () => this.db.pingCheck('database'),
      () => this.redis.checkHealth('redis'),
    ]);
  }

  @Get('live')
  liveness() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}
```

### 5.2 Logging Configuration

```typescript
// common/logger/logger.service.ts
@Injectable()
export class LoggerService {
  private logger: winston.Logger;

  constructor(private configService: ConfigService) {
    this.logger = winston.createLogger({
      level: this.configService.get('LOG_LEVEL', 'info'),
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json(),
      ),
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple(),
          ),
        }),
        new winston.transports.File({
          filename: this.configService.get('LOG_FILE', 'logs/app.log'),
        }),
      ],
    });
  }

  log(message: string, context?: string) {
    this.logger.info(message, { context });
  }

  error(message: string, trace?: string, context?: string) {
    this.logger.error(message, { trace, context });
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, { context });
  }

  debug(message: string, context?: string) {
    this.logger.debug(message, { context });
  }
}
```

### 5.3 Metrics Collection

```typescript
// monitoring/metrics.service.ts
@Injectable()
export class MetricsService {
  private readonly httpRequestDuration = new prometheus.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status'],
  });

  private readonly httpRequestTotal = new prometheus.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status'],
  });

  private readonly activeConnections = new prometheus.Gauge({
    name: 'active_connections',
    help: 'Number of active connections',
  });

  recordHttpRequest(method: string, route: string, status: number, duration: number) {
    this.httpRequestDuration.observe({ method, route, status }, duration);
    this.httpRequestTotal.inc({ method, route, status });
  }

  setActiveConnections(count: number) {
    this.activeConnections.set(count);
  }

  getMetrics() {
    return prometheus.register.metrics();
  }
}
```

## 6. Security Configuration

### 6.1 Security Middleware

```typescript
// main.ts security configuration
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Security middleware
  if (configService.get('HELMET_ENABLED') === 'true') {
    app.use(helmet());
  }

  // CORS configuration
  app.enableCors({
    origin: configService.get('CORS_ORIGIN')?.split(',') || false,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });

  // Rate limiting
  app.use(
    rateLimit({
      windowMs: configService.get('RATE_LIMIT_TTL', 60) * 1000,
      max: configService.get('RATE_LIMIT_LIMIT', 100),
      message: 'Too many requests from this IP',
    }),
  );

  // Trust proxy
  if (configService.get('TRUST_PROXY') === 'true') {
    app.set('trust proxy', 1);
  }

  await app.listen(configService.get('PORT', 3000));
}
```

### 6.2 Environment Validation

```typescript
// config/env.validation.ts
import { plainToClass } from 'class-transformer';
import { IsEnum, IsNumber, IsString, validateSync } from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsNumber()
  PORT: number;

  @IsString()
  DB_HOST: string;

  @IsNumber()
  DB_PORT: number;

  @IsString()
  DB_USERNAME: string;

  @IsString()
  DB_PASSWORD: string;

  @IsString()
  DB_NAME: string;

  @IsString()
  JWT_SECRET: string;

  @IsString()
  JWT_REFRESH_SECRET: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  
  return validatedConfig;
}
```

This comprehensive deployment guide provides all the necessary configuration and scripts to deploy the DiveSeeks Ltd backend system in both development and production environments, ensuring security, scalability, and maintainability.
