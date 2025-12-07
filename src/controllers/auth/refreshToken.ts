import { verifyRefreshToken, generateAccessToken } from '../../lib/jwt';
import { logger } from '../../lib/winston';
import type { Request, Response } from 'express';
import type { TokenPayload } from '../../lib/jwt';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

const refreshToken = async (req: Request, res: Response): Promise<void> => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    res.status(401).json({
      code: 'Unauthorized',
      message: 'Refresh Token required',
    });
    return;
  }

  try {
    const { userId } = verifyRefreshToken(refreshToken) as TokenPayload;
    const accessToken = generateAccessToken({ userId });
    res.status(200).json({
      accessToken,
    });
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      res.status(401).json({
        code: 'RefreshTokenExpired',
        message: 'Refresh Token expired',
      });
      return;
    }

    if (error instanceof JsonWebTokenError) {
      res.status(401).json({
        code: 'RefreshTokenExpired',
        message: 'Invalid Refresh Token',
      });
      return;
    }
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal Server Error',
    });

    logger.error('Error in refresh token', error);
  }
};

export default refreshToken;
