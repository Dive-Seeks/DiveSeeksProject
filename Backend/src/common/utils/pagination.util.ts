import {
  PaginationOptions,
  PaginatedResult,
} from '../../shared/interfaces/common.interface';
import { APP_CONSTANTS } from '../../shared/constants/app.constants';

export class PaginationUtil {
  static validatePaginationOptions(
    options: PaginationOptions,
  ): PaginationOptions {
    const page = Math.max(1, options.page || 1);
    const limit = Math.min(
      APP_CONSTANTS.MAX_PAGE_SIZE,
      Math.max(1, options.limit || APP_CONSTANTS.DEFAULT_PAGE_SIZE),
    );

    return {
      ...options,
      page,
      limit,
    };
  }

  static createPaginatedResult<T>(
    data: T[],
    total: number,
    options: PaginationOptions,
  ): PaginatedResult<T> {
    const { page, limit } = this.validatePaginationOptions(options);
    const totalPages = Math.ceil(total / limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages,
    };
  }

  static getSkipAndTake(options: PaginationOptions): {
    skip: number;
    take: number;
  } {
    const { page, limit } = this.validatePaginationOptions(options);
    const skip = (page - 1) * limit;

    return {
      skip,
      take: limit,
    };
  }
}
