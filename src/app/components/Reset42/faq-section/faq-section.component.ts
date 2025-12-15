import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface FAQ {
  id: number;
  category: string;
  question: string;
  hint?: string;
  answer: string;
  details?: string[];
  note?: string;
  expanded: boolean;
}

@Component({
  selector: 'app-faq-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './faq-section.component.html',
  styleUrls: ['./faq-section.component.css']
})
export class FaqSectionComponent {
  activeCategory = 'general';
  
  faqs: FAQ[] = [
    {
      id: 1,
      category: 'general',
      question: 'When does the program start?',
      hint: 'Next batch information',
      answer: 'The Reset 42 program starts on January 5, 2026. Live yoga sessions are held Monday to Friday from 7:30-8:30 AM IST.',
      details: [
        'January 5, 2026',
        'Daily sessions: Mon-Fri, 7:30-8:30 AM',
        'Coaching classes: Saturdays, 10 AM'
      ],
      expanded: true
    },
    {
      id: 2,
      category: 'general',
      question: 'Do I need prior yoga experience?',
      hint: 'Perfect for beginners',
      answer: 'Absolutely not! The program is specifically designed for beginners and those starting their health journey.',
      details: [
        'Step-by-step guidance from basic poses',
        'Modifications for all fitness levels',
        'Focus on proper form and alignment'
      ],
      expanded: false
    },
    {
      id: 3,
      category: 'program',
      question: 'What if I miss a live session?',
      hint: 'Attendance and recordings',
      answer: 'We don\'t provide recordings for yoga sessions as real-time participation is crucial for proper form correction and maximum benefit. However, all coaching classes are recorded and available.',
      note: 'Consistent attendance leads to best results. Our students have a 94% completion rate!',
      expanded: false
    },
    {
      id: 4,
      category: 'program',
      question: 'What equipment do I need?',
      hint: 'Simple setup required',
      answer: 'You only need a yoga mat and comfortable clothing. All sessions can be done from home with minimal space requirements.',
      details: [
        'Yoga mat (basic is fine)',
        'Comfortable workout clothes',
        'Water bottle',
        'Optional: Yoga blocks for support'
      ],
      expanded: false
    },
    {
      id: 5,
      category: 'payment',
      question: 'Is there a money-back guarantee?',
      hint: 'Review before purchase',
      answer: 'No, we do not offer a money-back guarantee. All purchases are final.',
      details: [
        'No refunds are provided. To know more please read our Refund Policy mentioned in the footer.',
        'All sales are considered final',
        'Please review all details before purchasing'
      ],
      expanded: false
    },
    {
      id: 6,
      category: 'payment',
      question: 'What payment methods do you accept?',
      hint: 'Secure payment options',
      answer: 'We accept all major payment methods including credit/debit cards, UPI, net banking',
      details: [
        'Credit/Debit Cards',
        'UPI (Google Pay, PhonePe, etc.)',
        'Net Banking'
      ],
      expanded: false
    },
    {
      id: 7,
      category: 'results',
      question: 'What results can I expect in 42 days?',
      hint: 'Average improvements',
      answer: 'Most students experience significant improvements in sleep quality, stress reduction, energy levels, and overall well-being.',
      details: [
        '80% stress reduction',
        '+3.2 hours quality sleep increase',
        '75% balanced diet',
        '90% reduction in body pain'
      ],
      expanded: false
    },
    {
      id: 8,
      category: 'results',
      question: 'How do I maintain results after the program?',
      hint: 'Sustainable lifestyle',
      answer: 'The program is designed to create sustainable habits. 88% of our students maintain these habits 6+ months later.',
      details: [
        'Built-in habit formation system',
        'Lifetime access to community',
        'Continued practice materials',
        'Advanced follow-up programs'
      ],
      expanded: false
    }
  ];

  getActiveFaqs(): FAQ[] {
    return this.faqs.filter(faq => faq.category === this.activeCategory);
  }

  setActiveCategory(category: string): void {
    this.activeCategory = category;
  }

  toggleFaq(id: number): void {
    const faq = this.faqs.find(f => f.id === id);
    if (faq) {
      // Close all other FAQs in the same category
      this.faqs
        .filter(f => f.category === faq.category && f.id !== id)
        .forEach(f => f.expanded = false);
      
      // Toggle current FAQ
      faq.expanded = !faq.expanded;
    }
  }
}