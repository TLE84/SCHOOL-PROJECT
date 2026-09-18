import type { Metadata } from 'next';
import { LegalPage } from '@/components/ui/LegalPage';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How PTI News handles the information you share with us.',
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      description="How the PTI News platform collects, uses and protects your information."
      sections={[
        {
          heading: 'Information we collect',
          body: [
            'When you create an account we collect your name, email address and the role you select (student or lecturer). If you subscribe to our newsletter we collect your email address.',
          ],
        },
        {
          heading: 'How we use it',
          body: [
            'Your information is used to sign you in, personalise the news you see, and — where you opt in — send you updates and announcements from the institute.',
          ],
        },
        {
          heading: 'Sharing',
          body: [
            'We do not sell your personal information. Content you post publicly, such as comments on articles, is visible to other readers alongside your name and role.',
          ],
        },
        {
          heading: 'Contact',
          body: ['Questions about this policy can be sent to info@pti.edu.ng.'],
        },
      ]}
    />
  );
}
