import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { Prisma } from '../../generated/prisma';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    switch (exception.code) {
      case 'P2002': {
        // Unique constraint failed
        statusCode = HttpStatus.CONFLICT;
        const fields = exception.meta?.target as string[] | undefined;
        const fieldName = fields?.join(', ') || 'field';
        message = `Record with such ${fieldName} already exists`;
        break;
      }

      case 'P2003': // Foreign key constraint failed
        statusCode = HttpStatus.BAD_REQUEST;
        message = `Cannot perform operation: foreign key constraint violated`;
        break;

      case 'P2004': // Transaction failed
        statusCode = HttpStatus.BAD_REQUEST;
        message = 'Transaction failed';
        break;

      case 'P2010': // Record not found
        statusCode = HttpStatus.NOT_FOUND;
        message = `Record not found`;
        break;

      case 'P2025': // Query validation error
        statusCode = HttpStatus.BAD_REQUEST;
        message = `Query validation error: invalid data`;
        break;

      case 'P2034': // Failed to connect to database
        statusCode = HttpStatus.SERVICE_UNAVAILABLE;
        message = `Failed to connect to database`;
        break;

      default:
        statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        message = 'Unknown database error';
        break;
    }

    return response.status(statusCode).json({
      statusCode,
      message,
    });
  }
}
