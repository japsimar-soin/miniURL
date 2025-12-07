import nodemailer from 'nodemailer';

import config from '@/config';

const nodemailerTransport = nodemailer.createTransport({
  //CHECK BUG
  host: 'smtp.ethereal.email',
  port: 465,
  secure: true,
  pool: true,
  auth: {
    user: config.SMTP_AUTH_USERNAME,
    pass: config.SMTP_AUTH_PASS,
  },
});

export default nodemailerTransport;
