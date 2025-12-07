import { generatePasswordResetToken } from '../../lib/jwt';
import { logger } from '../../lib/winston';
import User from '../../models/user';
import type { Request, Response } from 'express';
import type { IUser } from '../../models/user';
import nodemailerTransport from '../../lib/nodemailer';
import { resetLinkTemplate } from '../../mailTemplates/resetLink';

type RequestBody = Pick<IUser, 'email'>;

const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body as RequestBody;

  try {
    const passwordResetToken = generatePasswordResetToken({ email });
    const user = await User.findOne({ email })
      .select('name passwordResetToken')
      .exec();

    if (!user) return;

    const resetLink = `${req.protocol}://${req.get('host')}/reset-password?token=${passwordResetToken}`;
    const html = resetLinkTemplate({
      name: user.name,
      resetLink,
    });

    await nodemailerTransport.sendMail({
      from: '"MiniURL" <japsimarsoin20feb@gmail.com>',
      to: email,
      subject: 'Password Reset Request',
      html,
    });
    user.passwordResetToken = passwordResetToken;
    await user.save();

    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal Server Error',
    });

    logger.error('Error sending password reset link', error);
  }
};

export default forgotPassword;
