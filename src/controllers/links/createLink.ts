import { logger } from '../../lib/winston';
import Link from '../../models/link';
import type { Request, Response } from 'express';

type RequestBody = {
  targetUrl: string;
  code?: string;
};

const createLink = async (req: Request, res: Response): Promise<void> => {
  const { targetUrl, code } = req.body as RequestBody;

  try {
    try {
      new URL(targetUrl);
    } catch {
      res.status(400).json({
        code: 'BadRequest',
        message: 'Invalid URL format',
      });
      return;
    }

    let finalCode = code?.trim();

    if (!finalCode) {
      const chars =
        'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

      const length = Math.floor(Math.random() * 3) + 6;

      finalCode = '';
      for (let i = 0; i < length; i++) {
        finalCode += chars.charAt(Math.floor(Math.random() * chars.length));
      }
    } else {
      if (finalCode.length < 6 || finalCode.length > 8) {
        res.status(400).json({
          code: 'BadRequest',
          message: 'Code must be between 6 and 8 characters',
        });
        return;
      }

      if (!/^[a-zA-Z0-9]+$/.test(finalCode)) {
        res.status(400).json({
          code: 'BadRequest',
          message: 'Code can only contain letters and numbers',
        });
        return;
      }
    }

    const existingLink = await Link.findOne({ code: finalCode }).exec();
    if (existingLink) {
      res.status(409).json({
        code: 'Conflict',
        message: 'This short code already exists',
      });
      return;
    }

    const link = await Link.create({
      code: finalCode,
      targetUrl,
      totalClicks: 0,
      lastClickedAt: null,
    });

    res.status(201).json({
      code: link.code,
      targetUrl: link.targetUrl,
      totalClicks: link.totalClicks,
      lastClickedAt: link.lastClickedAt,
      createdAt: link.createdAt,
    });
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal Server Error',
    });

    logger.error('Error creating link', error);
  }
};

export default createLink;
