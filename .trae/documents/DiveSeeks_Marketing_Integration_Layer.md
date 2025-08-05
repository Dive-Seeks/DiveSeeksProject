# DiveSeeks Ltd Backend Architecture - Marketing & Advertising Integration Layer (Layer 2)

## 1. Marketing System Overview

This document defines the **Marketing & Advertising Integration Layer** for DiveSeeks Ltd's multi-tenant backend system. This second layer builds upon the foundational software architecture to provide comprehensive marketing automation, advertising platform integration, and customer remarketing capabilities.

### 1.1 Marketing Layer Foundation
This marketing layer extends the core system with:
- OAuth integration with major advertising platforms (Google Ads, Facebook, Instagram)
- Real-time campaign tracking and performance monitoring
- POS event syncing for advanced remarketing strategies
- Automated token management and security protocols
- Store owner dashboard for marketing account management

### 1.2 Core Marketing Objectives
- **Multi-Platform Integration**: Seamless connection to Google Ads, Facebook, and Instagram
- **Campaign Performance Tracking**: Real-time monitoring of ad campaigns and ROI
- **Remarketing Automation**: Sync POS/order events for targeted advertising
- **Secure OAuth Management**: Encrypted token storage with automatic refresh
- **Store Owner Control**: Self-service marketing account management
- **Campaign Creation**: Optional in-dashboard campaign creation capabilities

### 1.3 Supported Advertising Platforms

#### 1.3.1 Meta Platforms (Facebook & Instagram)
- **OAuth Scopes**: `ads_read`, `ads_management`, `business_management`
- **Data Collection**: Access tokens, refresh tokens, Page ID, Pixel ID, Business Ad Account ID
- **Capabilities**: Campaign management, pixel event tracking, audience creation

#### 1.3.2 Google Ads
- **OAuth Scope**: `https://www.googleapis.com/auth/adwords`
- **Data Collection**: Access tokens, refresh tokens, Google Ads Customer ID
- **Capabilities**: Campaign management, conversion tracking, audience targeting

## 2. Database Schema - Marketing Integration

### 2.1 Marketing Accounts Table
```sql
-- Marketing accounts for OAuth integration
CREATE TABLE marketing_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID REFERENCES branches(id) NOT NULL,
    platform VARCHAR(20) NOT NULL CHECK (platform IN ('facebook', 'instagram', 'google')),
    status VARCHAR(20) DEFAULT 'disconnected' CHECK (status IN ('connected', 'disconnected', 'expired', 'error')),
    auth_method VARCHAR(10) DEFAULT 'oauth' CHECK (auth_method = 'oauth'),
    
    -- Encrypted OAuth tokens
    access_token_encrypted TEXT NOT NULL,
    refresh_token_encrypted TEXT,
    token_expires_at TIMESTAMP,
    
    -- Platform-specific identifiers
    ad_account_id VARCHAR(255),
    pixel_id VARCHAR(255),
    page_id VARCHAR(255), -- Facebook/Instagram only
    customer_id VARCHAR(255), -- Google Ads only
    
    -- Connection tracking
    connected_at TIMESTAMP,
    disconnected_at TIMESTAMP,
    last_sync_at TIMESTAMP,
    sync_error_message TEXT,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(store_id, platform)
);

-- Indexes for performance
CREATE INDEX idx_marketing_accounts_store_platform ON marketing_accounts(store_id, platform);
CREATE INDEX idx_marketing_accounts_status ON marketing_accounts(status);
CREATE INDEX idx_marketing_accounts_expires ON marketing_accounts(token_expires_at);
```

### 2.2 Campaign Tracking Table
```sql
-- Campaign performance tracking
CREATE TABLE marketing_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    marketing_account_id UUID REFERENCES marketing_accounts(id) NOT NULL,
    platform_campaign_id VARCHAR(255) NOT NULL,
    campaign_name VARCHAR(255) NOT NULL,
    campaign_status VARCHAR(20) DEFAULT 'active',
    
    -- Performance metrics
    impressions BIGINT DEFAULT 0,
    clicks BIGINT DEFAULT 0,
    conversions BIGINT DEFAULT 0,
    spend_amount DECIMAL(10,2) DEFAULT 0,
    revenue_amount DECIMAL(10,2) DEFAULT 0,
    
    -- Tracking periods
    last_synced_at TIMESTAMP,
    sync_start_date DATE,
    sync_end_date DATE,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(marketing_account_id, platform_campaign_id)
);

CREATE INDEX idx_campaigns_account ON marketing_campaigns(marketing_account_id);
CREATE INDEX idx_campaigns_sync ON marketing_campaigns(last_synced_at);
```

### 2.3 Marketing Events Table
```sql
-- POS/Order events for remarketing
CREATE TABLE marketing_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID REFERENCES branches(id) NOT NULL,
    event_type VARCHAR(50) NOT NULL CHECK (event_type IN ('purchase', 'add_to_cart', 'view_content', 'initiate_checkout')),
    
    -- Event data
    order_id UUID REFERENCES orders(id),
    product_id UUID REFERENCES products(id),
    customer_email VARCHAR(255),
    customer_phone VARCHAR(20),
    
    -- Event values
    event_value DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'USD',
    quantity INTEGER DEFAULT 1,
    
    -- Platform sync status
    facebook_synced BOOLEAN DEFAULT false,
    google_synced BOOLEAN DEFAULT false,
    facebook_synced_at TIMESTAMP,
    google_synced_at TIMESTAMP,
    
    -- Event metadata
    event_data JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    
    -- Indexes
    INDEX idx_events_store_type (store_id, event_type),
    INDEX idx_events_sync_status (facebook_synced, google_synced),
    INDEX idx_events_created (created_at)
);
```

## 3. API Endpoints - Marketing Integration

### 3.1 OAuth Connection Endpoints

#### 3.1.1 Initiate OAuth Connection
```typescript
// GET /api/v1/marketing/connect/:platform
// Initiates OAuth flow and redirects to provider

interface ConnectParams {
  platform: 'facebook' | 'instagram' | 'google';
  storeId: string;
}

interface ConnectResponse {
  redirectUrl: string;
  state: string; // CSRF protection
}
```

#### 3.1.2 OAuth Callback Handler
```typescript
// GET /api/v1/marketing/callback/:platform
// Handles OAuth redirect and stores tokens

interface CallbackQuery {
  code: string;
  state: string;
  error?: string;
}

interface CallbackResponse {
  success: boolean;
  message: string;
  accountInfo?: {
    platform: string;
    accountId: string;
    accountName: string;
  };
}
```

#### 3.1.3 Connection Status
```typescript
// GET /api/v1/marketing/status/:storeId
// Returns connection status for all platforms

interface StatusResponse {
  success: boolean;
  data: {
    platform: string;
    status: 'connected' | 'disconnected' | 'expired' | 'error';
    connectedAt?: string;
    accountInfo?: {
      accountId: string;
      accountName: string;
    };
    lastSyncAt?: string;
    errorMessage?: string;
  }[];
}
```

#### 3.1.4 Disconnect Account
```typescript
// POST /api/v1/marketing/disconnect/:platform
// Revokes tokens and updates status

interface DisconnectRequest {
  storeId: string;
  platform: 'facebook' | 'instagram' | 'google';
}

interface DisconnectResponse {
  success: boolean;
  message: string;
}
```

### 3.2 Campaign Management Endpoints

#### 3.2.1 Campaign List
```typescript
// GET /api/v1/marketing/campaigns/:storeId
// Returns campaigns for connected accounts

interface CampaignListResponse {
  success: boolean;
  data: {
    id: string;
    platform: string;
    campaignId: string;
    name: string;
    status: string;
    performance: {
      impressions: number;
      clicks: number;
      conversions: number;
      spend: number;
      revenue: number;
      roas: number; // Return on Ad Spend
    };
    lastSynced: string;
  }[];
  meta: {
    total: number;
    lastSyncAt: string;
  };
}
```

#### 3.2.2 Sync Campaign Data
```typescript
// POST /api/v1/marketing/campaigns/sync/:storeId
// Manually trigger campaign data sync

interface SyncRequest {
  platforms?: string[]; // Optional: specific platforms
  dateRange?: {
    startDate: string;
    endDate: string;
  };
}

interface SyncResponse {
  success: boolean;
  message: string;
  syncedCampaigns: number;
  errors?: string[];
}
```

### 3.3 Event Tracking Endpoints

#### 3.3.1 Track Marketing Event
```typescript
// POST /api/v1/marketing/events/track
// Records POS/order events for remarketing

interface TrackEventRequest {
  storeId: string;
  eventType: 'purchase' | 'add_to_cart' | 'view_content' | 'initiate_checkout';
  orderId?: string;
  productId?: string;
  customerEmail?: string;
  customerPhone?: string;
  eventValue?: number;
  currency?: string;
  quantity?: number;
  eventData?: Record<string, any>;
}

interface TrackEventResponse {
  success: boolean;
  eventId: string;
  message: string;
}
```

#### 3.3.2 Event Sync Status
```typescript
// GET /api/v1/marketing/events/status/:storeId
// Returns event sync statistics

interface EventStatusResponse {
  success: boolean;
  data: {
    totalEvents: number;
    syncedToFacebook: number;
    syncedToGoogle: number;
    pendingSync: number;
    lastSyncAt: string;
    syncErrors: number;
  };
}
```

## 4. NestJS Module Structure

### 4.1 Marketing Module Architecture
```typescript
// marketing.module.ts
@Module({
  imports: [
    TypeOrmModule.forFeature([
      MarketingAccount,
      MarketingCampaign,
      MarketingEvent
    ]),
    ConfigModule,
    HttpModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [
    MarketingController,
    OAuthController,
    CampaignController,
    EventController
  ],
  providers: [
    MarketingService,
    FacebookService,
    GoogleAdsService,
    AdEventService,
    CampaignSyncService,
    TokenEncryptionService,
    OAuthGuard,
    MarketingGuard
  ],
  exports: [
    MarketingService,
    AdEventService
  ]
})
export class MarketingModule {}
```

### 4.2 Service Breakdown

#### 4.2.1 Facebook Service
```typescript
@Injectable()
export class FacebookService {
  private readonly facebookApiUrl = 'https://graph.facebook.com/v18.0';
  
  // OAuth methods
  async initiateOAuth(storeId: string, redirectUri: string): Promise<string>
  async handleCallback(code: string, state: string): Promise<OAuthResult>
  async refreshToken(accountId: string): Promise<void>
  
  // Campaign methods
  async getCampaigns(accountId: string): Promise<Campaign[]>
  async getCampaignInsights(campaignId: string, dateRange: DateRange): Promise<CampaignInsights>
  
  // Pixel events
  async sendPixelEvent(pixelId: string, event: PixelEvent): Promise<void>
  async createCustomAudience(accountId: string, audienceData: AudienceData): Promise<string>
  
  // Account management
  async getAdAccounts(accessToken: string): Promise<AdAccount[]>
  async getPixels(accountId: string): Promise<Pixel[]>
}
```

#### 4.2.2 Google Ads Service
```typescript
@Injectable()
export class GoogleAdsService {
  private readonly googleAdsApiUrl = 'https://googleads.googleapis.com/v14';
  
  // OAuth methods
  async initiateOAuth(storeId: string, redirectUri: string): Promise<string>
  async handleCallback(code: string, state: string): Promise<OAuthResult>
  async refreshToken(accountId: string): Promise<void>
  
  // Campaign methods
  async getCampaigns(customerId: string): Promise<Campaign[]>
  async getCampaignMetrics(customerId: string, campaignId: string, dateRange: DateRange): Promise<CampaignMetrics>
  
  // Conversion tracking
  async uploadConversions(customerId: string, conversions: Conversion[]): Promise<void>
  async createAudience(customerId: string, audienceData: AudienceData): Promise<string>
  
  // Account management
  async getCustomers(accessToken: string): Promise<Customer[]>
  async getConversionActions(customerId: string): Promise<ConversionAction[]>
}
```

#### 4.2.3 Ad Event Service
```typescript
@Injectable()
export class AdEventService {
  constructor(
    private facebookService: FacebookService,
    private googleAdsService: GoogleAdsService,
    private marketingEventRepository: Repository<MarketingEvent>
  ) {}
  
  // Event tracking
  async trackEvent(eventData: TrackEventDto): Promise<MarketingEvent>
  async syncEventToFacebook(eventId: string): Promise<void>
  async syncEventToGoogle(eventId: string): Promise<void>
  
  // Batch processing
  async processPendingEvents(): Promise<void>
  async retryFailedEvents(): Promise<void>
  
  // Event transformation
  private transformToFacebookEvent(event: MarketingEvent): FacebookPixelEvent
  private transformToGoogleEvent(event: MarketingEvent): GoogleConversion
}
```

#### 4.2.4 Campaign Sync Service
```typescript
@Injectable()
export class CampaignSyncService {
  // Scheduled sync jobs
  @Cron('0 */6 * * *') // Every 6 hours
  async syncAllCampaigns(): Promise<void>
  
  @Cron('0 2 * * *') // Daily at 2 AM
  async syncDailyMetrics(): Promise<void>
  
  // Manual sync methods
  async syncStoreCampaigns(storeId: string): Promise<SyncResult>
  async syncPlatformCampaigns(accountId: string, platform: string): Promise<SyncResult>
  
  // Performance calculation
  async calculateROAS(campaignId: string, dateRange: DateRange): Promise<number>
  async generatePerformanceReport(storeId: string, period: string): Promise<PerformanceReport>
}
```

## 5. OAuth Implementation Details

### 5.1 Facebook/Instagram OAuth Flow
```typescript
// OAuth configuration
const FACEBOOK_CONFIG = {
  clientId: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  redirectUri: process.env.FACEBOOK_REDIRECT_URI,
  scopes: ['ads_read', 'ads_management', 'business_management'],
  apiVersion: 'v18.0'
};

// OAuth URL generation
function generateFacebookOAuthUrl(storeId: string): string {
  const state = generateSecureState(storeId);
  const params = new URLSearchParams({
    client_id: FACEBOOK_CONFIG.clientId,
    redirect_uri: FACEBOOK_CONFIG.redirectUri,
    scope: FACEBOOK_CONFIG.scopes.join(','),
    response_type: 'code',
    state: state
  });
  
  return `https://www.facebook.com/v18.0/dialog/oauth?${params.toString()}`;
}

// Token exchange
async function exchangeCodeForToken(code: string): Promise<FacebookTokenResponse> {
  const response = await axios.post('https://graph.facebook.com/v18.0/oauth/access_token', {
    client_id: FACEBOOK_CONFIG.clientId,
    client_secret: FACEBOOK_CONFIG.clientSecret,
    redirect_uri: FACEBOOK_CONFIG.redirectUri,
    code: code
  });
  
  return response.data;
}
```

### 5.2 Google Ads OAuth Flow
```typescript
// OAuth configuration
const GOOGLE_CONFIG = {
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: process.env.GOOGLE_REDIRECT_URI,
  scopes: ['https://www.googleapis.com/auth/adwords'],
  accessType: 'offline'
};

// OAuth URL generation
function generateGoogleOAuthUrl(storeId: string): string {
  const state = generateSecureState(storeId);
  const params = new URLSearchParams({
    client_id: GOOGLE_CONFIG.clientId,
    redirect_uri: GOOGLE_CONFIG.redirectUri,
    scope: GOOGLE_CONFIG.scopes.join(' '),
    response_type: 'code',
    access_type: 'offline',
    prompt: 'consent',
    state: state
  });
  
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

// Token exchange
async function exchangeCodeForToken(code: string): Promise<GoogleTokenResponse> {
  const response = await axios.post('https://oauth2.googleapis.com/token', {
    client_id: GOOGLE_CONFIG.clientId,
    client_secret: GOOGLE_CONFIG.clientSecret,
    redirect_uri: GOOGLE_CONFIG.redirectUri,
    grant_type: 'authorization_code',
    code: code
  });
  
  return response.data;
}
```

## 6. Security Implementation

### 6.1 Token Encryption Service
```typescript
@Injectable()
export class TokenEncryptionService {
  private readonly algorithm = 'aes-256-gcm';
  private readonly secretKey: Buffer;
  
  constructor(private configService: ConfigService) {
    this.secretKey = Buffer.from(configService.get('ENCRYPTION_KEY'), 'hex');
  }
  
  encrypt(text: string): EncryptedData {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher(this.algorithm, this.secretKey);
    cipher.setAAD(Buffer.from('marketing-tokens'));
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    return {
      encryptedData: encrypted,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex')
    };
  }
  
  decrypt(encryptedData: EncryptedData): string {
    const decipher = crypto.createDecipher(this.algorithm, this.secretKey);
    decipher.setAAD(Buffer.from('marketing-tokens'));
    decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));
    
    let decrypted = decipher.update(encryptedData.encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }
}
```

### 6.2 Marketing Access Guard
```typescript
@Injectable()
export class MarketingGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private marketingService: MarketingService
  ) {}
  
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const storeId = request.params.storeId || request.body.storeId;
    
    // Check if user has marketing access to this store
    const hasAccess = await this.marketingService.checkUserAccess(user.id, storeId);
    
    if (!hasAccess) {
      throw new ForbiddenException('Insufficient permissions for marketing operations');
    }
    
    // Check if user role allows marketing operations
    const allowedRoles = ['business_owner', 'branch_manager', 'marketing_manager'];
    return allowedRoles.includes(user.role);
  }
}
```

### 6.3 Token Refresh Scheduler
```typescript
@Injectable()
export class TokenRefreshService {
  constructor(
    private marketingAccountRepository: Repository<MarketingAccount>,
    private facebookService: FacebookService,
    private googleAdsService: GoogleAdsService,
    private tokenEncryptionService: TokenEncryptionService
  ) {}
  
  @Cron('0 */2 * * *') // Every 2 hours
  async refreshExpiringTokens(): Promise<void> {
    const expiringTokens = await this.marketingAccountRepository.find({
      where: {
        status: 'connected',
        token_expires_at: LessThan(new Date(Date.now() + 24 * 60 * 60 * 1000)) // Expires within 24 hours
      }
    });
    
    for (const account of expiringTokens) {
      try {
        await this.refreshAccountToken(account);
      } catch (error) {
        await this.handleTokenRefreshError(account, error);
      }
    }
  }
  
  private async refreshAccountToken(account: MarketingAccount): Promise<void> {
    const refreshToken = this.tokenEncryptionService.decrypt({
      encryptedData: account.refresh_token_encrypted,
      iv: account.refresh_token_iv,
      authTag: account.refresh_token_auth_tag
    });
    
    let newTokens: TokenResponse;
    
    switch (account.platform) {
      case 'facebook':
      case 'instagram':
        newTokens = await this.facebookService.refreshToken(refreshToken);
        break;
      case 'google':
        newTokens = await this.googleAdsService.refreshToken(refreshToken);
        break;
    }
    
    // Encrypt and store new tokens
    const encryptedAccessToken = this.tokenEncryptionService.encrypt(newTokens.access_token);
    
    await this.marketingAccountRepository.update(account.id, {
      access_token_encrypted: encryptedAccessToken.encryptedData,
      access_token_iv: encryptedAccessToken.iv,
      access_token_auth_tag: encryptedAccessToken.authTag,
      token_expires_at: new Date(Date.now() + newTokens.expires_in * 1000),
      updated_at: new Date()
    });
  }
}
```

## 7. Frontend Integration Specifications

### 7.1 Marketing Dashboard Component Structure
```typescript
// components/marketing/MarketingDashboard.tsx
interface MarketingDashboardProps {
  storeId: string;
}

export function MarketingDashboard({ storeId }: MarketingDashboardProps) {
  const [connections, setConnections] = useState<MarketingConnection[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  return (
    <div className="space-y-6">
      <MarketingHeader storeId={storeId} />
      <ConnectionStatusCards connections={connections} />
      <CampaignPerformanceTable campaigns={campaigns} />
      <EventSyncStatus storeId={storeId} />
    </div>
  );
}
```

### 7.2 Connection Status Cards
```typescript
// components/marketing/ConnectionStatusCards.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ConnectionStatusCardsProps {
  connections: MarketingConnection[];
}

export function ConnectionStatusCards({ connections }: ConnectionStatusCardsProps) {
  const platforms = [
    { id: 'facebook', name: 'Facebook', icon: FacebookIcon, color: 'blue' },
    { id: 'instagram', name: 'Instagram', icon: InstagramIcon, color: 'pink' },
    { id: 'google', name: 'Google Ads', icon: GoogleIcon, color: 'green' }
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {platforms.map((platform) => {
        const connection = connections.find(c => c.platform === platform.id);
        const isConnected = connection?.status === 'connected';
        
        return (
          <Card key={platform.id} className="relative overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <platform.icon className="h-5 w-5" />
                  <span>{platform.name}</span>
                </div>
                <Badge 
                  variant={isConnected ? 'success' : 'secondary'}
                  className={`${isConnected ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                >
                  {isConnected ? 'Connected' : 'Not Connected'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isConnected ? (
                <div className="space-y-3">
                  <div className="text-sm text-gray-600">
                    <p>Account: {connection.accountInfo?.accountName}</p>
                    <p>Connected: {formatDate(connection.connectedAt)}</p>
                    <p>Last Sync: {formatDate(connection.lastSyncAt)}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDisconnect(platform.id)}
                    >
                      Disconnect
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleRefresh(platform.id)}
                    >
                      Refresh
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    Connect your {platform.name} account to start tracking campaigns and syncing events.
                  </p>
                  <Button 
                    className="w-full"
                    onClick={() => handleConnect(platform.id)}
                  >
                    Connect Account
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
```

### 7.3 Campaign Performance Table
```typescript
// components/marketing/CampaignPerformanceTable.tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface CampaignPerformanceTableProps {
  campaigns: Campaign[];
}

export function CampaignPerformanceTable({ campaigns }: CampaignPerformanceTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Campaign Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Campaign</TableHead>
              <TableHead>Platform</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Impressions</TableHead>
              <TableHead>Clicks</TableHead>
              <TableHead>Conversions</TableHead>
              <TableHead>Spend</TableHead>
              <TableHead>Revenue</TableHead>
              <TableHead>ROAS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campaigns.map((campaign) => (
              <TableRow key={campaign.id}>
                <TableCell className="font-medium">{campaign.name}</TableCell>
                <TableCell>
                  <Badge variant="outline">{campaign.platform}</Badge>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={campaign.status === 'active' ? 'success' : 'secondary'}
                  >
                    {campaign.status}
                  </Badge>
                </TableCell>
                <TableCell>{campaign.performance.impressions.toLocaleString()}</TableCell>
                <TableCell>{campaign.performance.clicks.toLocaleString()}</TableCell>
                <TableCell>{campaign.performance.conversions}</TableCell>
                <TableCell>${campaign.performance.spend.toFixed(2)}</TableCell>
                <TableCell>${campaign.performance.revenue.toFixed(2)}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <span className={`font-medium ${
                      campaign.performance.roas >= 3 ? 'text-green-600' : 
                      campaign.performance.roas >= 1 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {campaign.performance.roas.toFixed(2)}x
                    </span>
                    <Progress 
                      value={Math.min(campaign.performance.roas * 25, 100)} 
                      className="w-16 h-2"
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
```

## 8. Integration with UI Libraries

### 8.1 Aceternity UI Components
Utilize Aceternity UI components for enhanced visual appeal:

```typescript
// Using CardStack for campaign highlights
import { CardStack } from '@/components/ui/card-stack';

const campaignHighlights = [
  {
    id: 1,
    name: "Top Performer",
    designation: "Facebook Campaign",
    content: (
      <div className="space-y-2">
        <p className="text-lg font-semibold">Summer Sale Campaign</p>
        <p className="text-sm text-gray-600">ROAS: 4.2x | Revenue: $12,450</p>
        <div className="flex space-x-2">
          <Badge className="bg-green-100 text-green-800">Active</Badge>
          <Badge className="bg-blue-100 text-blue-800">High Performance</Badge>
        </div>
      </div>
    )
  },
  // More campaign cards...
];

<CardStack items={campaignHighlights} offset={10} scaleFactor={0.06} />
```

### 8.2 Skiper UI Components
Integrate Skiper UI for modern interface elements:

```typescript
// Enhanced buttons and modals for connection management
import { AnimatedButton } from '@/components/ui/animated-button';
import { GlowingCard } from '@/components/ui/glowing-card';

// Connection action buttons
<AnimatedButton
  variant="primary"
  onClick={() => handleConnect('facebook')}
  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
>
  Connect Facebook
</AnimatedButton>

// Performance metrics cards
<GlowingCard className="p-6">
  <div className="text-center">
    <h3 className="text-2xl font-bold text-gray-900">${totalRevenue.toFixed(2)}</h3>
    <p className="text-sm text-gray-600">Total Revenue This Month</p>
  </div>
</GlowingCard>
```

## 9. Performance Monitoring & Analytics

### 9.1 Marketing Analytics Dashboard
```typescript
// Real-time marketing metrics
interface MarketingMetrics {
  totalSpend: number;
  totalRevenue: number;
  overallROAS: number;
  activeConnections: number;
  syncedEvents: number;
  campaignCount: number;
}

// Performance tracking service
@Injectable()
export class MarketingAnalyticsService {
  async getStoreMetrics(storeId: string, dateRange: DateRange): Promise<MarketingMetrics> {
    // Aggregate metrics from all connected platforms
  }
  
  async getPerformanceTrends(storeId: string, period: string): Promise<PerformanceTrend[]> {
    // Calculate performance trends over time
  }
  
  async generateMarketingReport(storeId: string, format: 'pdf' | 'excel'): Promise<Buffer> {
    // Generate comprehensive marketing reports
  }
}
```

### 9.2 Event Sync Monitoring
```typescript
// Monitor event sync health
@Injectable()
export class EventSyncMonitorService {
  @Cron('*/5 * * * *') // Every 5 minutes
  async monitorEventSyncHealth(): Promise<void> {
    const pendingEvents = await this.getEventsSyncStatus();
    
    if (pendingEvents.failed > 100) {
      await this.alertService.sendAlert({
        type: 'marketing_sync_failure',
        message: `High number of failed event syncs: ${pendingEvents.failed}`,
        severity: 'high'
      });
    }
  }
}
```

## 10. Deployment & Configuration

### 10.1 Environment Variables
```bash
# Facebook/Instagram OAuth
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
FACEBOOK_REDIRECT_URI=https://yourdomain.com/api/v1/marketing/callback/facebook

# Google Ads OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=https://yourdomain.com/api/v1/marketing/callback/google

# Encryption
ENCRYPTION_KEY=your_32_byte_hex_encryption_key

# API Rate Limits
FACEBOOK_RATE_LIMIT=200
GOOGLE_RATE_LIMIT=100

# Sync Configuration
CAMPAIGN_SYNC_INTERVAL=6h
EVENT_SYNC_BATCH_SIZE=100
TOKEN_REFRESH_INTERVAL=2h
```

### 10.2 Docker Configuration
```dockerfile
# Add marketing-specific dependencies
RUN npm install @facebook/business-sdk google-ads-api

# Marketing service health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/v1/marketing/health || exit 1
```

This comprehensive Marketing & Advertising Integration Layer provides DiveSeeks Ltd with powerful marketing automation capabilities, seamless OAuth integration with major advertising platforms, and robust security measures for handling sensitive marketing data. The layer is designed to scale with business growth while maintaining high performance and security standards.