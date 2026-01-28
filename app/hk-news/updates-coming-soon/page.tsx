import PageShell from '@/components/PageShell'
import ComingSoonSection from '@/components/ComingSoonSection'

export default function HkNewsUpdatesComingSoonPage() {
  return (
    <div className="py-8">
      <PageShell>
        <ComingSoonSection
          eyebrow="Cryptopedia · HK News"
          title="HK News Updates Coming Soon"
          subtitle="HK-specific news update details are under development."
          cardBody="We’re building a dedicated updates feed for Hong Kong regulatory and market developments. Check back soon."
          primaryAction={{ href: '/news', label: 'Back to HK News' }}
        />
      </PageShell>
    </div>
  )
}

