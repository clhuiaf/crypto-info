import { Guide } from '../types/guide';

export const guides: Guide[] = [
  {
    id: '1',
    slug: 'technical-indicators-basics',
    title: '10 must-know technical indicators for new crypto traders',
    description:
      'Learn the essential technical indicators every beginner crypto trader in Hong Kong should understand before opening their first exchange account.',
    tag: 'Beginner',
    metaTitle: '10 Must-Know Technical Indicators for New Crypto Traders in Hong Kong | CryptoCompare Hub',
    metaDescription:
      'Essential technical indicators for beginners trading crypto in Hong Kong. Learn RSI, MACD, moving averages, and more before choosing your exchange.',
  },
  {
    id: '2',
    slug: 'candlestick-patterns-basics',
    title: '10 essential candlestick patterns beginners should recognise',
    description:
      'Master the fundamental candlestick patterns that help Hong Kong crypto traders identify market trends and make informed trading decisions.',
    tag: 'Beginner',
    metaTitle: '10 Essential Candlestick Patterns for Crypto Beginners in Hong Kong | CryptoCompare Hub',
    metaDescription:
      'Learn key candlestick patterns for crypto trading in Hong Kong. Perfect for beginners choosing their first licensed or unlicensed exchange.',
  },
];

export function getGuideBySlug(slug: string): Guide | undefined {
  return guides.find((guide) => guide.slug === slug);
}

