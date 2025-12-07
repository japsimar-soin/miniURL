import { logger } from '../../lib/winston';
import Link from '../../models/link';
import type { Request, Response } from 'express';

const getLinkStats = async (req: Request, res: Response): Promise<void> => {
  const { code } = req.params;

  try {
    const link = await Link.findOne({ code })
      .select('code targetUrl totalClicks lastClickedAt createdAt')
      .lean()
      .exec();

    if (!link) {
      res.status(404).json({
        code: 'NotFound',
        message: 'Link not found',
      });
      return;
    }

    res.status(200).json(link);
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal Server Error',
    });

    logger.error('Error getting link stats', error);
  }
};

export default getLinkStats;



