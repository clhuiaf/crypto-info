import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import NewsHero from '@/components/NewsHero';
import { getGuideBySlug, guides } from '@/data/guides';

interface GuidePageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return guides.map((guide) => ({
    slug: guide.slug,
  }));
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const guide = getGuideBySlug(params.slug);

  if (!guide) {
    return {
      title: 'Guide Not Found | CryptoCompare Hub',
    };
  }

  return {
    title: guide.metaTitle,
    description: guide.metaDescription,
  };
}

export default function GuidePage({ params }: GuidePageProps) {
  const guide = getGuideBySlug(params.slug);

  if (!guide) {
    notFound();
  }

  // Article content based on slug
  const getArticleContent = (slug: string) => {
    if (slug === 'technical-indicators-basics') {
      return {
        sections: [
          {
            heading: 'Introduction',
            content: `Technical indicators are mathematical calculations based on price, volume, or open interest that help crypto traders in Hong Kong identify potential market trends and entry/exit points. For beginners choosing their first exchange, understanding these basics can make a significant difference in trading outcomes.`,
          },
          {
            heading: '1. Moving Averages (MA)',
            content: `Moving averages smooth out price data to identify trends. The Simple Moving Average (SMA) and Exponential Moving Average (EMA) are the most common. When price crosses above a moving average, it often signals an uptrend, while crossing below suggests a downtrend.`,
          },
          {
            heading: '2. Relative Strength Index (RSI)',
            content: `RSI measures momentum on a scale of 0-100. Values above 70 typically indicate overbought conditions, while values below 30 suggest oversold conditions. This helps Hong Kong traders identify potential reversal points.`,
          },
          {
            heading: '3. MACD (Moving Average Convergence Divergence)',
            content: `MACD shows the relationship between two moving averages. When the MACD line crosses above the signal line, it's a bullish signal. This indicator is particularly useful for spotting trend changes in crypto markets.`,
          },
          {
            heading: '4. Bollinger Bands',
            content: `Bollinger Bands consist of a middle band (SMA) and two outer bands representing standard deviations. When prices touch the upper band, the market may be overbought; touching the lower band suggests oversold conditions.`,
          },
          {
            heading: '5. Volume Indicators',
            content: `Volume confirms price movements. High volume during price increases suggests strong buying interest, while high volume during declines indicates selling pressure. This is crucial when trading on Hong Kong exchanges.`,
          },
          {
            heading: '6. Support and Resistance Levels',
            content: `Support is a price level where buying interest is strong enough to prevent further decline. Resistance is where selling pressure prevents price from rising further. Identifying these levels helps with entry and exit timing.`,
          },
          {
            heading: '7. Fibonacci Retracements',
            content: `Fibonacci retracements use horizontal lines to indicate where support and resistance are likely to occur, based on key Fibonacci ratios (23.6%, 38.2%, 61.8%). These levels often act as reversal points in crypto markets.`,
          },
          {
            heading: '8. Stochastic Oscillator',
            content: `Similar to RSI, the Stochastic Oscillator compares closing price to price range over time. Values above 80 indicate overbought conditions, while values below 20 suggest oversold markets.`,
          },
          {
            heading: '9. Average True Range (ATR)',
            content: `ATR measures market volatility. Higher ATR values indicate more volatile conditions, which is important for setting stop-loss levels and position sizing when trading on Hong Kong crypto exchanges.`,
          },
          {
            heading: '10. Ichimoku Cloud',
            content: `The Ichimoku Cloud provides multiple pieces of information: trend direction, support/resistance levels, and momentum. When price is above the cloud, the trend is bullish; below the cloud suggests bearish conditions.`,
          },
          {
            heading: 'Next Steps',
            content: `Now that you understand these technical indicators, consider comparing licensed and unlicensed crypto exchanges in Hong Kong to find the platform that best suits your trading style. Check our exchange comparison page to see fees, supported tokens, and regulatory status.`,
          },
        ],
      };
    }

    if (slug === 'candlestick-patterns-basics') {
      return {
        sections: [
          {
            heading: 'Introduction',
            content: `Candlestick patterns are visual representations of price movements that help crypto traders in Hong Kong identify potential market reversals and continuations. Learning these patterns is essential for beginners trading on both licensed and unlicensed exchanges.`,
          },
          {
            heading: '1. Doji',
            content: `A Doji occurs when opening and closing prices are nearly equal, creating a cross-like shape. This indicates market indecision and potential reversal, especially after a strong trend.`,
          },
          {
            heading: '2. Hammer',
            content: `A Hammer has a small body at the top and a long lower wick. It appears at the bottom of downtrends and signals potential bullish reversal. The long wick shows buyers rejected lower prices.`,
          },
          {
            heading: '3. Shooting Star',
            content: `The Shooting Star is the opposite of a Hammer—small body at the bottom with a long upper wick. It appears at the top of uptrends and suggests potential bearish reversal as sellers rejected higher prices.`,
          },
          {
            heading: '4. Engulfing Patterns',
            content: `Bullish Engulfing: a small bearish candle followed by a larger bullish candle that completely engulfs it. Bearish Engulfing is the reverse. These patterns indicate strong reversal momentum, important for Hong Kong crypto traders.`,
          },
          {
            heading: '5. Morning Star',
            content: `A three-candle pattern: a bearish candle, a small-bodied candle (gap down), then a bullish candle (gap up). This signals a potential bullish reversal and is one of the most reliable patterns for beginners.`,
          },
          {
            heading: '6. Evening Star',
            content: `The opposite of Morning Star: bullish candle, small gap-up candle, then bearish gap-down candle. This indicates potential bearish reversal and helps traders exit positions before significant declines.`,
          },
          {
            heading: '7. Three White Soldiers',
            content: `Three consecutive bullish candles with higher closes. This strong bullish pattern indicates sustained buying pressure and is particularly useful when trading crypto on Hong Kong exchanges.`,
          },
          {
            heading: '8. Three Black Crows',
            content: `Three consecutive bearish candles with lower closes. This pattern shows strong selling pressure and potential downtrend continuation, helping traders identify when to exit or short positions.`,
          },
          {
            heading: '9. Spinning Top',
            content: `A small body with wicks on both sides, indicating market indecision. When appearing after a strong trend, it suggests potential reversal. This pattern is common in volatile crypto markets.`,
          },
          {
            heading: '10. Marubozu',
            content: `A candle with no wicks—the body represents the entire price range. Bullish Marubozu shows strong buying pressure; Bearish Marubozu indicates strong selling. These patterns suggest trend continuation.`,
          },
          {
            heading: 'Next Steps',
            content: `Understanding candlestick patterns is crucial for successful crypto trading in Hong Kong. Combine these patterns with technical indicators and choose an exchange that offers the tools and security you need. Visit our exchange comparison page to find licensed and unlicensed platforms that match your trading requirements.`,
          },
        ],
      };
    }

    return { sections: [] };
  };

  const content = getArticleContent(guide.slug);

  return (
    <div className="app-shell flex flex-col">
      <Navbar />
      <NewsHero
        eyebrow={`Guides · ${guide.tag}`}
        title={guide.title}
        subtitle={guide.description}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex justify-between items-center">
          <Link
            href="/guides"
            className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-blue-500 hover:text-blue-600"
          >
            ← Back to guides
          </Link>
        </div>

        <article className="card-surface p-6 md:p-8">
          <div className="prose prose-slate max-w-none">
            {content.sections.map((section, index) => (
              <div key={index} className="mb-8">
                <h2 className="text-xl font-semibold text-slate-900 mb-3">{section.heading}</h2>
                <p className="text-slate-700 leading-relaxed">{section.content}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Related Resources</h3>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/exchanges"
                className="inline-flex items-center px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:border-blue-500 hover:text-blue-600 text-sm font-medium transition-colors"
              >
                Compare Hong Kong Exchanges
              </Link>
              <Link
                href="/news/hong-kong"
                className="inline-flex items-center px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:border-blue-500 hover:text-blue-600 text-sm font-medium transition-colors"
              >
                Hong Kong Crypto News
              </Link>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}