export default () => ({
  jwt: {
    secret: process.env.JWT_SECRET || 'secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
  mailer: {
    host: process.env.MAILER_HOST || 'smtp.mailtrap.io',
    port: process.env.MAILER_PORT || 2525,
    auth: {
      user: process.env.MAILER_USER || 'caec286771bd47',
      pass: process.env.MAILER_PASSWORD || 'e95bdb1c560ebd',
    },
  },
});
