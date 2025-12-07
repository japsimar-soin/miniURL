import { Router } from 'express';
import { body } from 'express-validator';

import expressRateLimit from '../lib/expressRateLimit';
import validationError from '../middlewares/validationError';
import createLink from '../controllers/links/createLink';
import listLinks from '../controllers/links/listLinks';
import getLinkStats from '../controllers/links/getLinkStats';
import deleteLink from '../controllers/links/deleteLink';

const router = Router();

router.post(
  '/',
  expressRateLimit('basic'),
  body('targetUrl')
    .trim()
    .notEmpty()
    .withMessage('Target URL is required')
    .isURL()
    .withMessage('Invalid URL format'),
  body('code')
    .optional()
    .trim()
    .isLength({ min: 6, max: 6 })
    .withMessage('Code must be exactly 6 characters')
    .matches(/^[a-zA-Z0-9]+$/)
    .withMessage('Code can only contain letters and numbers'),
  validationError,
  createLink,
);

router.get('/', expressRateLimit('basic'), listLinks);

router.get('/:code', expressRateLimit('basic'), getLinkStats);

router.delete('/:code', expressRateLimit('basic'), deleteLink);

export default router;
