import { Request, Response } from 'express';
export interface AppError extends Error {
    statusCode?: number;
    isOperational?: boolean;
    code?: number;
    keyValue?: any;
}
export declare const errorHandler: (err: AppError, req: Request, res: Response) => Response<any, Record<string, any>> | undefined;
export declare const createError: (message: string, statusCode?: number) => AppError;
//# sourceMappingURL=errorHandler.d.ts.map