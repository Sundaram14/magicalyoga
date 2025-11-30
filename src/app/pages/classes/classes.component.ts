import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { PaymentSessionService } from '../../../services/payment-session.service';
import { User } from '../../../models/user.model';
import { Subscription } from 'rxjs';

interface Program {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  features: string[];
  price: number;
  duration: string;
  sessions: string;
  batchTimings?: string[];
  bestFor: string[];
  highlights: string[];
}

@Component({
  selector: 'app-classes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.css']
})
export class ClassesComponent implements OnInit, OnDestroy {
  programs: Program[] = [
  {
    id: '44c1bf71-c2ca-4df8-b399-945decf98d81',
    title: 'Yoga Everyday (Adults – Morning)',
    description: 'Transform your body and mind with daily yoga practice. Perfect for working professionals and fitness enthusiasts.',
    category: 'Adults',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
    features: ['Daily Morning Sessions', 'Professional Guidance', 'All Levels Welcome', 'Progress Tracking'],
    price: 1999,
    duration: 'Monthly',
    sessions: '22-26 sessions',
    batchTimings: ['5:30–6:30 AM', '6:30–7:30 AM'],
    bestFor: ['Working Professionals', 'Fitness Enthusiasts', 'Beginners to Advanced'],
    highlights: ['5-6 days/week', 'Less than ₹80/session', '2 batch options']
  },
  {
    id: '3c483084-0099-4a96-a7eb-adc108ff250f',
    title: 'Yoga Everyday - 3 Months',
    description: '66–78 sessions (less than ₹70 per session) • Save ₹500',
    category: 'Adults',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
    features: ['3 Months Access', '66-78 sessions', 'Save ₹500', 'Best Value'],
    price: 5497,
    duration: '3 Months',
    sessions: '66-78 sessions',
    batchTimings: ['5:30–6:30 AM', '6:30–7:30 AM'],
    bestFor: ['Working Professionals', 'Fitness Enthusiasts', 'Regular Practitioners'],
    highlights: ['3 months access', 'Less than ₹70/session', 'Save ₹500']
  },
  {
    id: '6613ede9-e5b5-4fad-b4db-701891bcc522',
    title: 'Yoga Everyday - Yearly',
    description: '264–312 sessions (less than ₹60 per session) • Save ₹4000',
    category: 'Adults',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
    features: ['1 Year Access', '264-312 sessions', 'Save ₹4000', 'Best Deal'],
    price: 19988,
    duration: 'Yearly',
    sessions: '264-312 sessions',
    batchTimings: ['5:30–6:30 AM', '6:30–7:30 AM'],
    bestFor: ['Dedicated Practitioners', 'Long-term Commitment', 'Maximum Savings'],
    highlights: ['1 year access', 'Less than ₹60/session', 'Save ₹4000']
  },
  {
    id: 'e37a6f89-fe30-492a-ac67-ef9e7066457d',
    title: 'Magical Evening (Kids, 7–16 years)',
    description: 'Fun and engaging yoga sessions designed specifically for children aged 7-16 years.',
    category: 'Kids',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
    features: ['Age-appropriate Poses', 'Fun Activities', 'Confidence Building', 'Focus Improvement'],
    price: 1499,
    duration: 'Monthly',
    sessions: '14-18 sessions',
    batchTimings: ['6:30–7:30 PM'],
    bestFor: ['Children 7-16 years', 'School Students', 'Building Foundation'],
    highlights: ['Friday, Saturday, Sunday', 'Less than ₹85/session', 'Fun learning environment']
  },
  {
    id: '80adcc77-7b8b-4e3e-9905-4feb41a6794d',
    title: 'Magical Evening - 3 Months',
    description: '42–54 sessions (less than ₹75 per session) • Save ₹400',
    category: 'Kids',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
    features: ['3 Months Access', '42-54 sessions', 'Save ₹400', 'Best Value'],
    price: 4097,
    duration: '3 Months',
    sessions: '42-54 sessions',
    batchTimings: ['6:30–7:30 PM'],
    bestFor: ['Regular Students', 'Continuous Learning', 'Better Value'],
    highlights: ['3 months access', 'Less than ₹75/session', 'Save ₹400']
  },
  {
    id: 'a200831c-0534-44c4-a4d3-3cf7e78ec3c1',
    title: 'Magical Evening - Yearly',
    description: '168–216 sessions (less than ₹65 per session) • Save ₹3000',
    category: 'Kids',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
    features: ['1 Year Access', '168-216 sessions', 'Save ₹3000', 'Best Deal'],
    price: 14988,
    duration: 'Yearly',
    sessions: '168-216 sessions',
    batchTimings: ['6:30–7:30 PM'],
    bestFor: ['Long-term Students', 'Maximum Savings', 'Year-round Activity'],
    highlights: ['1 year access', 'Less than ₹65/session', 'Save ₹3000']
  },
  {
    id: 'b576dd54-3875-444f-9c7f-85a4f55337c8',
    title: 'Yoga at Your Time (Recording-only program)',
    description: 'Fresh recordings shared daily. Practice at your convenience with full support.',
    category: 'Recording',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
    features: ['Daily Fresh Recordings', 'Practice Anytime', 'Doubt Clarification', 'Lifetime Access'],
    price: 999,
    duration: 'Monthly',
    sessions: '20+ recordings',
    bestFor: ['Busy Professionals', 'Flexible Schedule', 'Self-paced Learning'],
    highlights: ['5 weekday sessions', 'Less than ₹50/session', 'Anytime access']
  },
  {
    id: '952208bc-a7c3-4aa6-b2c3-0d6d1adc736e',
    title: 'Yoga at Your Time - 3 Months',
    description: '150+ sessions (less than ₹45 per session) • Save ₹300',
    category: 'Recording',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
    features: ['3 Months Access', '150+ recordings', 'Save ₹300', 'Best Value'],
    price: 2697,
    duration: '3 Months',
    sessions: '150+ recordings',
    bestFor: ['Regular Self-practice', 'Flexible Learners', 'Better Value'],
    highlights: ['3 months access', 'Less than ₹45/session', 'Save ₹300']
  },
  {
    id: '970ea783-415c-444d-af1d-0d33e630d556',
    title: 'Yoga at Your Time - Yearly',
    description: '600+ sessions (less than ₹35 per session) • Save ₹2000',
    category: 'Recording',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
    features: ['1 Year Access', '600+ recordings', 'Save ₹2000', 'Best Deal'],
    price: 9988,
    duration: 'Yearly',
    sessions: '600+ recordings',
    bestFor: ['Long-term Self-practice', 'Maximum Flexibility', 'Maximum Savings'],
    highlights: ['1 year access', 'Less than ₹35/session', 'Save ₹2000']
  },
  {
    id: '8d9f1221-58db-4ea9-adb4-b5252d9dc63d',
    title: 'Prenatal Yoga (For Mothers-to-be)',
    description: 'Safe and nurturing yoga practice designed specifically for expecting mothers.',
    category: 'Prenatal',
    image: 'https://images.unsplash.com/photo-1518607692855-1c67f7920a14?w=800&q=80',
    features: ['Safe Practices', 'Breathing Techniques', 'Meditation', 'Mother-Baby Bonding'],
    price: 2999,
    duration: 'Monthly',
    sessions: '20 sessions',
    batchTimings: ['6:30–7:10 PM'],
    bestFor: ['Expecting Mothers', 'All Trimesters', 'Postnatal Care'],
    highlights: ['Monday to Friday', 'Theme-based sessions', 'Expert prenatal guidance']
  },
  {
    id: 'c9e48639-eacd-460a-b1d2-8812319d000d',
    title: 'Prenatal Yoga - 3 Months',
    description: 'Save ₹1000 with our 3-month prenatal package',
    category: 'Prenatal',
    image: 'https://images.unsplash.com/photo-1518607692855-1c67f7920a14?w=800&q=80',
    features: ['3 Months Access', 'Complete Prenatal Care', 'Save ₹1000', 'Continuous Support'],
    price: 7997,
    duration: '3 Months',
    sessions: '60 sessions',
    batchTimings: ['6:30–7:10 PM'],
    bestFor: ['Full Pregnancy Support', 'Continuous Care', 'Better Value'],
    highlights: ['3 months access', 'Complete prenatal journey', 'Save ₹1000']
  },
  {
    id: 'd040901d-7da5-4fe4-ac4f-2a6f331d3182',
    title: 'Prenatal Yoga - Yearly',
    description: 'Save ₹5000 with our comprehensive yearly prenatal package',
    category: 'Prenatal',
    image: 'https://images.unsplash.com/photo-1518607692855-1c67f7920a14?w=800&q=80',
    features: ['1 Year Access', 'Full Pregnancy & Postnatal', 'Save ₹5000', 'Complete Journey'],
    price: 30988,
    duration: 'Yearly',
    sessions: '240 sessions',
    batchTimings: ['6:30–7:10 PM'],
    bestFor: ['Complete Motherhood Journey', 'Maximum Support', 'Maximum Savings'],
    highlights: ['1 year access', 'Pregnancy to postnatal', 'Save ₹5000']
  }
];

  filteredPrograms: Program[] = [];
  activeFilter: string = 'all';
  isLoggedIn: boolean = false;
  currentUser: User | null = null;
  private userSubscription: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private router: Router,
    private paymentSessionService: PaymentSessionService
  ) {}

  ngOnInit() {
    this.filteredPrograms = this.programs;
    
    // Subscribe to user changes
    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isLoggedIn = this.authService.isAuthenticated();
    });
  }

  ngOnDestroy() {
    // Clean up subscriptions to prevent memory leaks
    this.userSubscription.unsubscribe();
  }

  filterPrograms(category: string) {
    this.activeFilter = category;
    if (category === 'all') {
      this.filteredPrograms = this.programs;
    } else {
      this.filteredPrograms = this.programs.filter(program => program.category === category);
    }
  }

  onEnrollClick(program: Program) {
    if (this.authService.isAuthenticated()) {
      // User is logged in - create secure session and redirect
      const sessionId = this.paymentSessionService.createPaymentSession(
        program.id,
        program.title,
        program.price
      );
      
      this.router.navigate(['/payment'], {
        queryParams: { session: sessionId }
      });
    } else {
      // User not logged in - create secure session and redirect to register
      const sessionId = this.paymentSessionService.createPaymentSession(
        program.id,
        program.title,
        program.price
      );
      
      this.router.navigate(['/register'], {
        queryParams: { session: sessionId, redirect: 'payment' }
      });
    }
  }

  getCategoryIcon(category: string): string {
    const icons: { [key: string]: string } = {
      'Adults': '🧘‍♀️',
      'Kids': '🌟',
      'Recording': '🎥',
      'Prenatal': '🤰'
    };
    return icons[category] || '✨';
  }

  getCategoryColor(category: string): string {
    const colors: { [key: string]: string } = {
      'Adults': '#0097b2',
      'Kids': '#ff6b6b',
      'Recording': '#4ecdc4',
      'Prenatal': '#ff9ff3'
    };
    return colors[category] || '#0097b2';
  }
}