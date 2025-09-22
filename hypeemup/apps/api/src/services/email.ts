import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

import { env } from '../config/env';

const ses = new SESClient({ region: env.SES_REGION });

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  const toAddresses = Array.isArray(to) ? to : [to];

  const command = new SendEmailCommand({
    Destination: {
      ToAddresses: toAddresses,
    },
    Message: {
      Body: { Html: { Data: html } },
      Subject: { Data: subject },
    },
    Source: env.SES_FROM_EMAIL,
  });

  try {
    if (env.NODE_ENV === 'test') {
      console.info('Mock email send', { to, subject });
      return;
    }
    await ses.send(command);
  } catch (error) {
    console.error('Failed to send email', error);
  }
}
