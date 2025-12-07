import { logger } from '../../lib/winston';
import Link from '../../models/link';
import type { Request, Response } from 'express';

const listLinks = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search } = req.query;

    let query = {};

    // Optional search/filter by code or URL
    if (search && typeof search === 'string') {
      query = {
        $or: [
          { code: { $regex: search, $options: 'i' } },
          { targetUrl: { $regex: search, $options: 'i' } },
        ],
      };
    }

    const links = await Link.find(query)
      .select('code targetUrl totalClicks lastClickedAt createdAt')
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    res.status(200).json(links);
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal Server Error',
    });

    logger.error('Error listing links', error);
  }
};

export default listLinks;



