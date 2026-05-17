import { Response } from 'express';

export const successResponse = (
    res: Response,
    data: any = null,
    message: string = 'Operation successful',
    statusCode: number = 200
) => {
    return res.status(statusCode).json({
        status: 'success',
        message,
        data
    });
};

export const errorResponse = (
    res: Response,
    message: string = 'Operation failed',
    statusCode: number = 500,
    errors: any = null
) => {
    return res.status(statusCode).json({
        status: 'error',
        message,
        errors
    });
};
