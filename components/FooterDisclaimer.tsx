'use client'

export default function FooterDisclaimer() {
  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Disclaimer</h3>

      <div className="space-y-6 text-lg text-slate-700 leading-relaxed">
        <p>
          Cryptopedia (Crypto通) is an educational platform providing cryptocurrency information, including prices, market data, charts, news, and educational content. All information is sourced from public APIs such as CoinGecko and other third-party providers.
        </p>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-700 mb-1">No Investment Advice</h4>
          <p className="mb-0">
            The information provided on this site is for general informational and educational purposes only. Nothing on Cryptopedia constitutes investment advice, recommendation, solicitation, or offer to buy, sell, or hold any cryptocurrency or financial asset.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-700 mb-1">Accuracy Not Guaranteed</h4>
          <p className="mb-0">
            Cryptocurrency prices, market data, and other information may be delayed, incomplete, or inaccurate. All data is provided "as is" without warranties of any kind. Cryptopedia and its data providers do not guarantee the completeness, accuracy, or timeliness of any information.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-700 mb-1">No Liability</h4>
          <p className="mb-0">
            Cryptopedia and its data providers shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising from your use of, or reliance on, the information provided on this site.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-700 mb-1">User Responsibility</h4>
          <p className="mb-0">
            You should independently verify all information and consult with qualified financial or professional advisors before making any investment decisions. Cryptocurrency investments carry significant risk of loss.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-700 mb-1">Jurisdiction</h4>
          <p className="mb-0">
            This site is operated from Hong Kong. Use of this site is subject to the laws and jurisdiction of the Hong Kong Special Administrative Region.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-700 mb-1">Changes</h4>
          <p className="mb-0">
            This disclaimer may be updated from time to time. Continued use of the site constitutes acceptance of any updated terms.
          </p>
        </div>
      </div>
    </div>
  )
}