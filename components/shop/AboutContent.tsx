'use client'

import { useRef, useEffect } from 'react'
import Link from 'next/link'

function FadeUp({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.style.transitionDelay = `${delay}ms`; el.classList.add('visible') }
    }, { threshold: 0.1 })
    obs.observe(el); return () => obs.disconnect()
  }, [delay])
  return <div ref={ref} className={`fade-up ${className}`}>{children}</div>
}

const TIMELINE = [
  { year:'2019', title:'The Idea',           body:'Founder Amara Osei-Bonsu returns from a health retreat convinced Nigeria deserves better juice. Every bottle in the market is loaded with sugar and preservatives. She starts experimenting in her Lagos kitchen.' },
  { year:'2020', title:'First Press',         body:'After 14 months of recipe development, FruitGuard produces its first 50 bottles of cold-pressed Orange Burst. Sold out at a Lekki farmers market in under two hours.' },
  { year:'2021', title:'Farm Partnerships',   body:'We sign our first formal partnerships with three certified organic farms in Ogun State and one in the Jos Plateau. Every fruit can be traced back to a specific farm and harvest date.' },
  { year:'2022', title:'Scaling Up',          body:'We move into a purpose-built cold-press facility in Ikeja. Output grows from 200 to 4,000 bottles per week. Six new flavours are introduced including Green Detox and Immunity Shield.' },
  { year:'2023', title:'West Africa Expansion', body:"FruitGuard begins shipping to Ghana and Côte d'Ivoire. We are recognised by the Lagos State Ministry of Agriculture for contribution to organic farming development." },
  { year:'2025', title:'Today',               body:'Over 3,400 loyal customers across Nigeria and West Africa. 12 juice varieties. Zero compromises on quality. We still press every bottle with care — it just takes a bigger press now.' },
]

const TEAM = [
  { name:'Amara Osei-Bonsu', role:'Founder & CEO',       bio:'Nutritionist by training, entrepreneur by obsession. Amara spent eight years in health consulting before building FruitGuard from a single cold-press machine.' },
  { name:'Kofi Mensah',      role:'Head of Sourcing',    bio:'Former agricultural officer turned produce specialist. Kofi personally visits every partner farm quarterly and has tasted more fruit varieties than he cares to count.' },
  { name:'Titi Adeyemi',     role:'Head of Operations',  bio:'Operations veteran keeping 4,000 bottles moving from press to doorstep every week — on time, at exactly 2°C.' },
  { name:'Dr. Ngozi Ike',    role:'Lead Nutritionist',   bio:'PhD in Human Nutrition from the University of Lagos. Ngozi formulates every blend to maximise micronutrient bioavailability without sacrificing taste.' },
]

const VALUES = [
  ['Radical Transparency','Every label shows the full ingredient list and farm origin. If we would not drink it ourselves, we will not sell it.'],
  ['Organic Only','We have never — and will never — use conventionally grown produce. Organic certification is a minimum requirement, not a marketing badge.'],
  ['Zero Additives','Our promise is simple: fruit goes in, juice comes out. Nothing else enters the bottle.'],
  ['People Over Profit','Farm partners receive above-market rates. Delivery staff earn a living wage. Sustainable business starts with fair pay along the whole chain.'],
  ['Eco Responsibility','All bottles are biodegradable. Delivery packaging is reused 3× before recycling. We offset all logistics carbon monthly.'],
  ['Community First','We sponsor two urban farming education programmes in Lagos and donate unsold inventory to food banks — nothing goes to waste.'],
]

export default function AboutContent() {
  return (
    <div className="page-enter">
      {/* Hero */}
      <div className="bg-[#111110] px-6 md:px-10 py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ background: 'radial-gradient(circle at 70% 50%, #78bf49 0%, transparent 60%)' }}/>
        <div className="max-w-3xl relative z-10">
          <span className="block text-[11px] font-semibold tracking-[0.12em] uppercase text-brand mb-4">Our Story</span>
          <h1 className="font-display text-5xl md:text-6xl text-white leading-tight mb-6">
            Built on One Simple<br /><em className="text-brand">Conviction</em>
          </h1>
          <p className="text-white/60 text-base leading-relaxed max-w-xl">
            Nigeria deserves premium cold-pressed juice made from real organic fruit — with nothing hidden, nothing added, nothing compromised.
          </p>
        </div>
      </div>

      {/* Mission strip */}
      <FadeUp>
        <div className="bg-brand px-6 md:px-10 py-10">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-white/20">
            {[['Our Mission','To make genuinely healthy, additive-free cold-pressed juice accessible to every household across West Africa.'],
              ['Our Vision','A future where organic produce from African farms fuels healthy, vibrant communities on the continent and beyond.'],
              ['Our Promise','Every bottle is pressed fresh, traceable to its farm, and free of anything that does not grow in the ground.']].map(([t,b]) => (
              <div key={t} className="pt-6 md:pt-0 md:px-8 first:pl-0 last:pr-0">
                <h3 className="font-display text-2xl text-white mb-2">{t}</h3>
                <p className="text-white/70 text-[13px] leading-relaxed">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </FadeUp>

      {/* Stats */}
      <FadeUp>
        <div className="bg-[#F4F3F0] border-b border-[#D6D3CE] px-6 md:px-10 py-12">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[['3,400+','Loyal Customers'],['12','Juice Varieties'],['4','Farm Partners'],['0','Additives. Ever.']].map(([n,l]) => (
              <div key={l}>
                <span className="block font-display text-5xl font-semibold text-brand">{n}</span>
                <span className="block text-[12px] tracking-wider uppercase text-[#6B6860] mt-2">{l}</span>
              </div>
            ))}
          </div>
        </div>
      </FadeUp>

      {/* Timeline */}
      {/* <section className="max-w-5xl mx-auto px-6 md:px-10 py-20">
        <FadeUp>
          <span className="block text-[11px] font-semibold tracking-[0.12em] uppercase text-brand mb-2">How We Got Here</span>
          <h2 className="font-display text-4xl mb-12">Our Journey</h2>
        </FadeUp>
        <div className="relative">
          <div className="absolute left-[72px] md:left-[88px] top-0 bottom-0 w-px bg-[#D6D3CE]"/>
          <div className="space-y-10">
            {TIMELINE.map((item, i) => (
              <FadeUp key={i} delay={i * 60}>
                <div className="flex gap-6 md:gap-10">
                  <div className="flex-shrink-0 w-[72px] md:w-[88px] text-right">
                    <span className="font-display text-2xl font-semibold text-brand">{item.year}</span>
                  </div>
                  <div className="relative pt-1 flex-1">
                    <div className="absolute -left-[25px] md:-left-[29px] top-2 w-3 h-3 rounded-full bg-brand border-2 border-white ring-1 ring-brand"/>
                    <h3 className="font-semibold text-[15px] mb-2">{item.title}</h3>
                    <p className="text-[13px] text-[#6B6860] leading-relaxed">{item.body}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section> */}

      {/* Values */}
      <section className="bg-[#F4F3F0] py-20 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <FadeUp>
            <span className="block text-[11px] font-semibold tracking-[0.12em] uppercase text-brand mb-2">What We Stand For</span>
            <h2 className="font-display text-4xl mb-12">Our Values</h2>
          </FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#D6D3CE] border border-[#D6D3CE]">
            {VALUES.map(([title, body], i) => (
              <FadeUp key={title} delay={i * 60}>
                <div className="bg-[#F4F3F0] hover:bg-white transition-colors p-8 h-full">
                  <div className="w-8 h-1 bg-brand mb-5"/>
                  <h3 className="font-semibold text-[15px] mb-2">{title}</h3>
                  <p className="text-[13px] text-[#6B6860] leading-relaxed">{body}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>
{/* 
      {/* Team */}
      {/* <section className="max-w-7xl mx-auto px-6 md:px-10 py-20">
        <FadeUp>
          <span className="block text-[11px] font-semibold tracking-[0.12em] uppercase text-brand mb-2">The People</span>
          <h2 className="font-display text-4xl mb-12">Meet the Team</h2>
        </FadeUp>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#D6D3CE] border border-[#D6D3CE]">
          {TEAM.map(({ name, role, bio }, i) => (
            <FadeUp key={name} delay={i * 70}>
              <div className="bg-white p-7 flex flex-col h-full">
                <div className="w-14 h-14 rounded-full bg-brand-pale border-2 border-brand-mid flex items-center justify-center text-brand-dark font-bold text-lg mb-5">
                  {name.split(' ').map(n=>n[0]).join('').slice(0,2)}
                </div>
                <h3 className="font-display text-xl font-semibold mb-0.5">{name}</h3>
                <p className="text-[11px] font-semibold tracking-wider uppercase text-brand mb-3">{role}</p>
                <p className="text-[13px] text-[#6B6860] leading-relaxed">{bio}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </section> */} 

      {/* Certs */}
      <FadeUp>
        <div className="bg-[#F4F3F0] py-14 px-6 md:px-10 border-t border-[#D6D3CE]">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-6">
            <div>
              <span className="block text-[11px] font-semibold tracking-[0.12em] uppercase text-brand mb-1">Certified & Recognised</span>
              <h2 className="font-display text-2xl">Our Accreditations</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {['NAFDAC Approved','SON Certified','Organic West Africa','ISO 22000:2018','HACCP Compliant'].map(c => (
                <div key={c} className="border border-[#D6D3CE] bg-white rounded-sm px-4 py-2.5 text-[11px] font-semibold tracking-wider uppercase text-[#6B6860] hover:border-brand hover:text-brand transition-colors cursor-default">{c}</div>
              ))}
            </div>
          </div>
        </div>
      </FadeUp>

      {/* CTA */}
      <section className="bg-brand py-20 px-6 text-center">
        <FadeUp>
          <h2 className="font-display text-4xl text-white mb-3">Ready to Taste the Difference?</h2>
          <p className="text-white/75 text-sm mb-8 max-w-md mx-auto">Join over 3,400 customers who have made FruitGuard part of their daily routine.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/products" className="bg-white text-brand hover:bg-brand-pale px-8 py-3 text-[13px] font-semibold tracking-wider uppercase rounded-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/10">
              Shop Now
            </Link>
            <Link href="/contact" className="border border-white/50 hover:border-white text-white px-8 py-3 text-[13px] font-medium tracking-wider uppercase rounded-sm transition-colors">
              Get in Touch
            </Link>
          </div>
        </FadeUp>
      </section>
    </div>
  )
}
