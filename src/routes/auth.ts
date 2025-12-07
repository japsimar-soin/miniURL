import { Router } from 'express';
import { body } from 'express-validator';
import bcrypt from 'bcrypt';

import expressRateLimit from '@/lib/expressRateLimit';
import User from '@/models/user';
import register from '@/controllers/auth/register';
import login from '@/controllers/auth/login';
import logout from '@/controllers/auth/logout';
import validationError from '@/middlewares/validationError';
import authentication from '@/middlewares/authentication';
import refreshToken from '@/controllers/auth/refreshToken';
import forgotPassword from '@/controllers/auth/forgotPassword';

const router = Router();

router.post(
  '/register',
  expressRateLimit('passReset'),
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email address')
    .custom(async (value) => {
      const userExists = await User.exists({ email: value }).exec();
      if (userExists) {
        throw new Error('This email already exists');
      }
    }),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be atleast 8 characters long'),
  body('role')
    .notEmpty()
    .withMessage('Role is required')
    .isIn(['user', 'admin'])
    .withMessage('Role is not supported'),
  validationError,
  register,
);

router.post(
  '/login',
  expressRateLimit('auth'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .custom(async (email) => {
      const user = await User.exists({ email }).exec();
      if (!user) {
        throw new Error('No user found');
      }
    }),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be atleast 8 characters long')
    .custom(async (password, { req }) => {
      const { email } = req.body;

      const user = await User.findOne({ email })
        .select('password')
        .lean()
        .exec();

      if (!user) return;
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error('invalid password');
      }
    }),
  validationError,
  login,
);

router.delete('/logout', expressRateLimit('basic'), authentication, logout);

router.get('/refresh-token', expressRateLimit('basic'), refreshToken);

router.post(
  '/forgot-password',
  expressRateLimit('basic'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email address')
    .custom(async (email) => {
      const userExists = await User.exists({ email }).exec();

      if (!userExists) {
        throw new Error('User not found');
      }
    }),
  validationError,
  forgotPassword,
);

export default router;
