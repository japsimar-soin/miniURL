export type TemplateParams = {
  name?: string;
  resetLink: string;
  companyName?: string;
  currentYear?: number;
};

export const resetLinkTemplate = ({
  name,
  resetLink,
  companyName = 'MiniURL',
}: TemplateParams): string => {
  return `
    <html>
    <head>
    <meta charset="UTF-8" />
    </head>
    <body>
    <h3> Password reset link from ${companyName}</h3>
    <p>Hi ${name} </p>

    <a href="${resetLink}" class="button"> Reset password </a>
    </body>
    </html>
    `;
};
