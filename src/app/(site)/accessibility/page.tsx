import type { Metadata } from 'next';
import { LegalPage } from '@/components/ui/LegalPage';

export const metadata: Metadata = {
  title: 'Accessibility',
  description: 'Our commitment to an accessible PTI News platform.',
};

export default function AccessibilityPage() {
  return (
    <LegalPage
      title="Accessibility"
      description="Our commitment to making PTI News usable for everyone."
      sections={[
        {
          heading: 'Our commitment',
          body: [
            'We aim to meet widely recognised accessibility guidelines so that the platform works for readers using keyboards, screen readers and a range of devices.',
          ],
        },
        {
          heading: 'What we do',
          body: [
            'Pages use semantic headings and landmarks, images carry descriptive text, interactive controls are reachable by keyboard, and colour is chosen for sufficient contrast.',
          ],
        },
        {
          heading: 'Feedback',
          body: [
            'If you encounter a barrier using this site, please let us know at info@pti.edu.ng so we can put it right.',
          ],
        },
      ]}
    />
  );
}
