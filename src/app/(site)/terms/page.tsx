import type { Metadata } from 'next';
import { LegalPage } from '@/components/ui/LegalPage';

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: 'The terms that govern your use of the PTI News platform.',
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Use"
      description="The terms that govern your use of the PTI News platform."
      sections={[
        {
          heading: 'Using the platform',
          body: [
            'PTI News provides campus news, events and announcements. You may read published content freely; some features, such as reacting to and commenting on articles, require an account.',
          ],
        },
        {
          heading: 'Your account',
          body: [
            'You are responsible for keeping your sign-in details secure and for activity carried out under your account. Choose the role that applies to you when signing up.',
          ],
        },
        {
          heading: 'Community conduct',
          body: [
            'Comments should be respectful and relevant. We may remove content that is abusive, misleading or otherwise inappropriate.',
          ],
        },
        {
          heading: 'Content',
          body: [
            'Articles and institute communications remain the property of the Petroleum Training Institute and its contributors.',
          ],
        },
      ]}
    />
  );
}
