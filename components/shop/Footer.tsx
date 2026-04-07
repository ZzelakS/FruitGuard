import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#111110] text-white/50 px-6 md:px-10 pt-16 pb-6">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 pb-10 border-b border-white/10 mb-6">
        <div className="col-span-2 md:col-span-1">
          <Link href="/" className="font-display text-xl text-white block mb-3">
            Fruit<span className="text-brand">Guard</span>
          </Link>
          <p className="text-[13px] leading-relaxed max-w-xs">Premium cold-pressed organic juices crafted for your health. Proudly made in Nigeria.</p>
        </div>
        {[
          ['Shop',    [['All Juices','/products'],['Citrus Range','/products'],['Tropical Blends','/products'],['Green Detox','/products'],['Berry Collection','/products']]],
          ['Company', [['Our Story','/about'],['Farm Partners','/about'],['Sustainability','/about'],['Careers','#'],['Blog','#']]],
          ['Support', [['FAQ','/contact'],['Track Order','#'],['Returns','#'],['Contact Us','/contact'],['+234 915 557 8884','#']]],
        ].map(([title, links]) => (
          <div key={String(title)}>
            <h4 className="text-[11px] font-bold tracking-[0.1em] uppercase text-white mb-4">{String(title)}</h4>
            {(links as [string, string][]).map(([label, href]) => (
              <Link key={label} href={href} className="block text-[13px] text-white/50 hover:text-brand-light mb-2 transition-colors">{label}</Link>
            ))}
          </div>
        ))}
      </div>
      <div className="max-w-7xl mx-auto flex justify-between flex-wrap gap-2 text-[11px] text-white/25">
        <span>© 2025 FruitGuard Nigeria Ltd. All rights reserved. <b>Lamar</b></span>
        <span className="flex gap-4">
          <a href="#" className="hover:text-brand-light transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-brand-light transition-colors">Terms of Service</a>
        </span>
      </div>
    </footer>
  )
}
