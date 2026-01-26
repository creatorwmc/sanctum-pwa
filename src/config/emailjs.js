// EmailJS Configuration
// Sign up at https://www.emailjs.com/ (free tier: 200 emails/month)
// Then fill in your credentials below

export const EMAILJS_CONFIG = {
  // Get this from EmailJS Dashboard → Email Services
  SERVICE_ID: 'service_r8spgn4',

  // Get this from EmailJS Dashboard → Email Templates
  TEMPLATE_ID: 'template_2u99rn7-autorep',

  // Get this from EmailJS Dashboard → Account → API Keys → Public Key
  PUBLIC_KEY: 'NY0lwuCHX7WZtohJR',

  // Set to true once you've configured the above
  ENABLED: true
}

// Template variables your EmailJS template should use:
// {{from_name}} - sender's name
// {{section}} - which app section the feedback is about
// {{message}} - the feedback message
// {{timestamp}} - when it was sent
// {{user_agent}} - browser/device info
