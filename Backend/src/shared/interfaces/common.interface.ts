export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  businessId?: string;
  branchId?: string;
}

export interface RefreshTokenPayload {
  sub: string;
  tokenId: string;
  type?: string;
}
