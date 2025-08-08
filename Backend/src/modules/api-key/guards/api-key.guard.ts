import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { ApiKeyService } from '../api-key.service';
import { ApiKey } from '../entities';

// Extend Express Request to include apiKey
declare module 'express' {
  interface Request {
    apiKey?: ApiKey;
  }
}

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const apiKey = this.extractApiKeyFromHeader(request);

    if (!apiKey) {
      throw new UnauthorizedException('API key is required');
    }

    try {
      const validatedApiKey = await this.apiKeyService.validateApiKey(apiKey);

      if (!validatedApiKey) {
        throw new UnauthorizedException('Invalid or expired API key');
      }

      // Attach the validated API key to the request for use in controllers
      request.apiKey = validatedApiKey;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid API key');
    }
  }

  private extractApiKeyFromHeader(request: Request): string | undefined {
    const apiKey = request.headers['x-api-key'] as string;
    return apiKey;
  }
}
