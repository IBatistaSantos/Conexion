import { MailerOptions } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

import * as path from 'path';

export const mailerConfig: MailerOptions = {
  template: {
    dir: path.resolve(
      __dirname,
      '..',
      '..',
      'src',
      'shared',
      'mailer',
      'layouts',
    ),
    adapter: new HandlebarsAdapter(),
    options: {
      extName: '.hbs',
      layoutsDir: path.resolve(
        __dirname,
        '..',
        '..',
        'src',
        'shared',
        'mailer',
        'layouts',
      ),
    },
  },
  transport: {
    host: process.env.MAILER_HOST || 'smtp.mailtrap.io',
    port: Number(process.env.MAILER_HOST) || 2525,
    auth: {
      user: process.env.MAILER_USER || 'caec286771bd47',
      pass: process.env.MAILER_PASSWORD || 'e95bdb1c560ebd',
    },
  },
};
