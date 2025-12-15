import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';

interface PolicySection {
  title?: string;
  content?: string;
  points?: string[];
}

interface PolicyContent {
  title: string;
  content: PolicySection[];
}

@Component({
  selector: 'app-legal-pages',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './legal-pages.component.html',
  styleUrls: ['./legal-pages.component.css']
})
export class LegalPagesComponent {
  currentPage: string = '';
  currentDate: string = new Date().toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Content for each page
  policies: { [key: string]: PolicyContent } = {
    'refund': {
      title: 'Cancellation & Refund Policy',
      content: [
        {
          title: 'No Refund Policy',
          content: 'Payments made to Magical Yoga are non-refundable.',
          points: [
            'Change of mind',
            'Missed sessions',
            'Partial participation',
            'Non-usage after purchase'
          ]
        },
        {
          title: 'Exceptions — Transaction Issues',
          content: 'Refunds will be issued only if:',
          points: [
            'A payment is deducted twice, or',
            'A failed transaction results in money being debited.',
            'In such cases, email info@magicalyoga.in or WhatsApp +91-98845 24742.',
            'Refunds will be processed back to the source account within 7–14 working days.'
          ]
        },
        {
          title: 'Cancellations & Batch Transfers',
          points: [
            'Cancellations after purchase are not allowed.',
            'Batch transfers are allowed only once per month, subject to approval.',
            'Missed sessions will not be refunded — recordings (where applicable) will be provided.'
          ]
        },
        {
          title: 'Recording Access Duration',
          content: 'Where recordings are provided, access is available only for the validity period of the specific program. After expiry, recording access ends and cannot be retrieved or extended unless approved by Magical Yoga.'
        }
      ]
    },
    'terms': {
      title: 'Terms & Conditions',
      content: [
        {
          title: 'Services Offered',
          content: 'Magical Yoga provides:',
          points: [
            'Online live yoga classes',
            'Recorded programs',
            'Membership/subscription-based services',
            'Workshops and retreats',
            'Coaching/consultation services',
            'Each program varies in pricing, duration, format, and inclusions.'
          ]
        },
        {
          title: 'Health & Participation Disclaimer',
          points: [
            'Yoga involves movement and physical effort.',
            'If you have health conditions, chronic issues, injuries, or are pregnant, consult a doctor before participating.',
            'You must inform Magical Yoga about any health concerns before starting any program.',
            'Participation is voluntary and at your own risk.'
          ]
        },
        {
          title: 'Minors Policy',
          content: 'Participants under 18 require parent/guardian consent.'
        },
        {
          title: 'Delivery & Renewal',
          points: [
            'Access to programs/services begins within 24 hours of payment confirmation.',
            'Auto-renewal applies only if you explicitly consent.',
            'At the end of a plan period, unused sessions expire — validity does not extend automatically.'
          ]
        },
        {
          title: 'Session Recording & Usage',
          points: [
            'Magical Yoga may record online sessions.',
            'Recordings or visuals may be used for training, marketing, and promotion.',
            'Attendance implies consent to appear in group recordings.',
            'We will not individually identify or feature you without consent.',
            'Recording access is provided only for the duration of the subscribed program. After expiry, access ends and cannot be retrieved unless approved by Magical Yoga.'
          ]
        },
        {
          title: 'Intellectual Property',
          content: 'You agree not to:',
          points: [
            'Share',
            'Resell',
            'Screen-record',
            'Distribute any Magical Yoga content or recordings without written consent.'
          ]
        },
        {
          title: 'Limitation of Liability',
          points: [
            'Magical Yoga is not responsible for injuries or issues from practice.',
            'Magical Yoga is not responsible for internet/service disruptions.',
            'Magical Yoga is not responsible for misuse of content by users.'
          ]
        },
        {
          title: 'Governing Law',
          content: 'These terms are governed by Indian law.'
        }
      ]
    },
    'shipping': {
      title: 'Digital Delivery Policy',
      content: [
        {
          content: 'Magical Yoga does not deliver physical products. All services are digital.'
        },
        {
          title: 'Delivery Timeline',
          points: [
            'Access or confirmation for classes/programs is delivered within 24 hours of payment.',
            'If you do not receive access, email info@magicalyoga.in or WhatsApp +91-98845 24742 and we will assist you promptly.'
          ]
        }
      ]
    },
    'privacy': {
      title: 'Privacy Policy',
      content: [
        {
          title: 'Information We Collect',
          content: 'We may collect:',
          points: [
            'Name',
            'Email',
            'Phone number',
            'City/state',
            'Health disclosures voluntarily shared',
            'Website usage / analytics / tracking information'
          ]
        },
        {
          title: 'How We Use Your Information',
          content: 'We use data to:',
          points: [
            'Deliver classes and coaching',
            'Send access links and updates',
            'Improve service quality',
            'Communicate program details and reminders'
          ]
        },
        {
          title: 'Recording Usage',
          points: [
            'Live sessions may be recorded for quality, training, and promotional purposes.',
            'You may appear in group-based promotional visuals due to attendance.',
            'Your identity will not be individually highlighted without explicit consent.',
            'Recording access (if provided) lasts only for the validity period of your program and expires thereafter.'
          ]
        },
        {
          title: 'Data Sharing',
          points: [
            'We do not sell or commercially share user data with third parties.',
            'We may use secure payment gateways or automation tools — they are bound by confidentiality.'
          ]
        },
        {
          title: 'Cookies / Tracking',
          content: 'Our website may use analytics tools (e.g., Google Analytics) to improve experience.'
        },
        {
          title: 'Your Rights',
          content: 'You may:',
          points: [
            'Request data correction',
            'Unsubscribe from communication',
            'Contact us through info@magicalyoga.in'
          ]
        },
        {
          title: 'Security',
          content: 'Reasonable safeguards are used to protect stored information, but no system is fully immune from breaches.'
        }
      ]
    }
  };

  constructor(private route: ActivatedRoute) {
    this.route.url.subscribe(url => {
      this.currentPage = url[0]?.path || '';
    });
  }

  getPolicyContent(): PolicyContent {
    const policy = this.policies[this.currentPage];
    return policy || { title: 'Policy Not Found', content: [] };
  }

  printPage(): void {
    window.print();
  }

  downloadPDF(): void {
    // In real implementation, this would generate/download a PDF
    alert('PDF download functionality will be implemented soon');
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Helper method to check if policy exists
  hasPolicy(): boolean {
    return !!this.policies[this.currentPage];
  }
}