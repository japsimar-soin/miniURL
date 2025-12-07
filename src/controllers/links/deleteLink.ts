import { logger } from '@/lib/winston';
import Link from '@/models/link';
import type { Request, Response } from 'express';

const deleteLink = async (req: Request, res: Response): Promise<void> => {
  const { code } = req.params;

  try {
    const link = await Link.findOneAndDelete({ code }).exec();

    if (!link) {
      res.status(404).json({
        code: 'NotFound',
        message: 'Link not found',
      });
      return;
    }

    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal Server Error',
    });

    logger.error('Error deleting link', error);
  }
};

export default deleteLink;



