import { logger } from '@/lib/winston';
import Link from '@/models/link';
import type { Request, Response } from 'express';

const redirectLink = async (req: Request, res: Response): Promise<void> => {
  const { code } = req.params;

  try {
    const link = await Link.findOne({ code }).exec();

    if (!link) {
      res.status(404).json({
        code: 'NotFound',
        message: 'Link not found',
      });
      return;
    }

    // Increment click count and update last clicked time
    link.totalClicks += 1;
    link.lastClickedAt = new Date();
    await link.save();

    // Perform HTTP 302 redirect
    res.redirect(302, link.targetUrl);
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal Server Error',
    });

    logger.error('Error redirecting link', error);
  }
};

export default redirectLink;



