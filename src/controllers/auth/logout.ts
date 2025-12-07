import { logger } from '../../lib/winston';
import config from '../../config';
import User from '../../models/user';
import type { Request, Response } from 'express';

const logout = async (req: Request, res: Response): Promise<void> => {
  const userId = req.userId;
  try {
    await User.updateOne({ _id: userId }, { refreshToken: null });
    res.clearCookie('refreshToken', {
      maxAge: config.COOKIE_MAX_AGE,
      httpOnly: config.NODE_ENV === 'production',
      secure: true,
    });

    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal Server Error',
    });

    logger.error('Error logging out user', error);
  }
};

export default logout;
