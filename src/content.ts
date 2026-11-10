// Every piece of editable text on the site lives in this file.
import { LINKS } from './links.config'

export type QuoteCategory = 'Devotion' | 'Surrender' | 'Life'

export const NAV_LINKS = [
  { label: 'Journey', href: '#about' },
  { label: 'Wisdom', href: '#wisdom' },
  { label: 'Reflections', href: '#reflections' },
  { label: 'Chant', href: '#chant' },
  { label: 'Book', href: '#book' },
  { label: 'Connect', href: '#connect' },
]

export const ENTER = {
  greeting: 'Hare Krishna',
  name: 'Mahesh Yadav',
  line: 'Pause for a moment. Breathe. Then step inside.',
  withSound: 'Enter with sound',
  silent: 'Enter in silence',
  hint: 'Flowing water, a light breeze and a soft tanpura',
}

export const HERO = {
  eyebrow: 'Hare Krishna · Welcome',
  name: 'Mahesh Yadav',
  tagline: 'Growth leader, devotee and Gita teacher',
  intro:
    "He builds growth for companies by day and shares the wisdom of the Bhagavad Gita with students and seekers. Here you'll find his story, his words, and his first book.",
  primary: 'Discover the book',
  secondary: 'Read his words',
}

export const VERSE = {
  sanskrit: 'सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज ।\nअहं त्वां सर्वपापेभ्यो मोक्षयिष्यामि मा शुचः ॥',
  english:
    'Set aside every other path and take shelter in Me alone. I will free you from all sin. Do not grieve.',
  reference: 'Bhagavad Gita 18.66',
}

export const ABOUT = {
  heading: 'Two worlds, one purpose',
  sub: 'He leads growth for a living, and serves Krishna as a way of life. For him these are not two separate paths.',
  left: {
    label: 'In the boardroom',
    title: 'Chief Growth Officer, OBOX',
    body: 'Mahesh helps global companies and Indian innovators enter, establish and expand in India. He works alongside founders, CFOs and CHROs who see India as a long-term home for growth, not just a market.',
    points: [
      'Growth strategy and market intelligence',
      'Cross-border partnerships built on trust',
      'Leadership that creates room for others to grow',
    ],
  },
  centre: {
    sanskrit: 'पद्मपत्रमिवाम्भसा',
    english: 'Live in the world like a lotus leaf on water: fully in it, yet untouched by it.',
    reference: 'Bhagavad Gita 5.10',
  },
  right: {
    label: 'On the path',
    title: 'Devotee and Gita teacher',
    body: 'Away from work, Mahesh is a devotee of Lord Krishna and a guide in the ISKCON community. He lectures on the Bhagavad Gita at IIT campuses and spiritual centres, helping students and professionals find steadiness and meaning.',
    points: [
      'Bhagavad Gita lectures for students',
      'Guidance for young professionals',
      'Kirtan and the chanting of the holy name',
    ],
  },
  pullQuote: 'In a world defined by metrics, I remain anchored in meaning.',
  pullQuoteBy: 'Mahesh Yadav',
}

export const WISDOM = {
  label: 'Wisdom',
  heading: 'In his words',
  tabs: ['All', 'Devotion', 'Surrender', 'Life'] as const,
  quotes: [
    {
      category: 'Devotion' as QuoteCategory,
      label: 'On chanting',
      text: 'When I chant, I am not asking Krishna for anything. I am only reminding my heart whom it belongs to.',
    },
    {
      category: 'Devotion' as QuoteCategory,
      label: 'On prayer',
      text: 'Prayer is not telling God what we need. He already knows. It is becoming quiet enough to hear what He wants from us.',
    },
    {
      category: 'Surrender' as QuoteCategory,
      label: 'On worry',
      text: 'Worry is the mind trying to carry a weight the Lord has already promised to carry.',
    },
    {
      category: 'Surrender' as QuoteCategory,
      label: 'On hard times',
      text: 'Some doors close not to keep us out, but to turn us around, towards Him.',
    },
    {
      category: 'Life' as QuoteCategory,
      label: 'On humility',
      text: 'A tree full of fruit bends low. Real devotion makes a person softer, never prouder.',
    },
    {
      category: 'Life' as QuoteCategory,
      label: 'On kindness',
      text: 'Everyone we meet is also a child of Krishna. Remembering this is where kindness begins.',
    },
  ],
}

export const REFLECTIONS = {
  label: 'Reflections',
  heading: 'Thoughts on living with Krishna',
  // TODO: the excerpts below are drafted placeholders. Replace with the real
  // essays (and add an `href` per item once the articles are published).
  items: [
    {
      time: '5 min',
      title: 'Why I chant before I check my phone',
      excerpt:
        'The first thing we give our attention to sets the tone for the whole day. A few rounds of the holy name before any notification arrives keep the heart steady, and the day begins from Krishna instead of from the noise.',
    },
    {
      time: '4 min',
      title: 'Duty without anxiety',
      excerpt:
        'The Gita never asks us to stop working, only to stop clinging to the result. What it looks like to give your best in a meeting, an exam or a launch, and then let go gently.',
    },
    {
      time: '6 min',
      title: 'When prayer feels dry',
      excerpt:
        'Some mornings the words feel hollow and nothing seems to answer. Those are not wasted days. They are the days our devotion is quietly tested, and quietly deepened.',
    },
  ],
}

export const CHANT = {
  label: 'Chant with me',
  heading: 'One round on the tulsi mala',
  body: 'A japa mala has 108 tulsi beads. Say the mahamantra once, softly, then tap to move to the next bead.',
  mantra: 'हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे ।\nहरे राम हरे राम राम राम हरे हरे ॥',
  tap: 'Chant once',
  reset: 'Start over',
  complete: 'One round complete. Hare Krishna.',
  total: 108,
}

export const BOOK = {
  label: 'The book',
  // TODO: PLACEHOLDER CONTENT. Replace the title, summary and launch date with the real book details.
  title: 'The Quiet Flute',
  summary:
    "Twelve short chapters on hearing Krishna's call in a noisy world. Drawing on the Bhagavad Gita and stories from his own life, Mahesh Yadav shows how chanting, service and simple living can bring peace to anyone.",
  // TODO: PLACEHOLDER launch date (ISO with IST offset).
  launchDate: '2027-01-14T10:00:00+05:30',
  author: 'MAHESH YADAV',
  waitlistHeading: 'Join the waitlist',
  waitlistText: 'Be the first to know when it is released.',
  emailPlaceholder: 'Your email address',
  submit: 'Notify me',
  invalid: 'Please enter a valid email address.',
  success: "Hare Krishna. You're on the list, and we'll write to you when the book is released.",
  released: 'The book is now available.',
}

export const CONNECT = {
  label: 'Connect',
  heading: 'Join a class or invite him to speak',
  links: [
    { key: 'youtube', title: 'YouTube', note: 'Gita classes and kirtan', href: LINKS.youtube },
    { key: 'instagram', title: 'Instagram', note: 'Daily reflections', href: LINKS.instagram },
    { key: 'whatsapp', title: 'WhatsApp', note: 'Weekly class updates', href: LINKS.whatsapp },
    { key: 'email', title: 'Write to him', note: 'Questions and invitations', href: LINKS.email },
  ],
}

export const FOOTER = {
  mantra: 'हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे ।\nहरे राम हरे राम राम राम हरे हरे ॥',
  romanised: 'Hare Krishna Hare Krishna, Krishna Krishna Hare Hare\nHare Rama Hare Rama, Rama Rama Hare Hare',
  copyright: '© 2026 Mahesh Yadav',
}
