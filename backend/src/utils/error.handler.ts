import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

// Classe custom per gli errori
export class AppError extends Error {
  constructor(
    public message: string,
    public status: number = 500
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

// Il gestore globale (con il tipo corretto)
export const globalErrorHandler: ErrorRequestHandler = (
  err: AppError | Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    console.error(`❌ [${err.status}] ${err.message}`);
    res.status(err.status).json({
      success: false,
      message: err.message,
    });
    return;
  }

  console.error('❌ Errore sconosciuto:', err);
  res.status(500).json({
    success: false,
    message: 'Errore interno del server.',
  });
};
