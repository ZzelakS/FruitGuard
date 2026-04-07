'use client'

import { useState, useRef, useEffect } from 'react'

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

const FAQS = [
  { q:'How fresh are the juices?',         a:'Every bottle is cold-pressed the same morning it is dispatched. We never hold pressed juice for more than 6 hours before it leaves the facility.' },
  { q:'What is the shelf life?',            a:'Because we use no preservatives, our juices last 3–4 days refrigerated. We recommend drinking within 48 hours for peak nutrition and flavour.' },
  { q:'Do you deliver outside Lagos?',      a:'Yes. We currently deliver to Abuja, Port Harcourt, Ibadan, Enugu, and Kano via overnight cold-chain courier. Same-day delivery is Lagos only.' },
  { q:'Can I set up a recurring order?',    a:'Absolutely. Email subscriptions@fruitguard.com with your preferred selection and frequency and we will set you up with a 10% subscriber discount.' },
  { q:'Are your bottles recyclable?',       a:'All our bottles are made from biodegradable PLA plastic. They can be composted at home or dropped off at any of our partner recycling points across Lagos.' },
  { q:'Do you offer bulk / corporate orders?', a:'Yes — we supply offices, hotels and events. Contact our B2B team at wholesale@fruitguard.com for pricing and minimum order quantities.' },
]

export default function ContactContent() {
  const [form, setForm]       = useState({ name:'', email:'', subject:'', category:'', message:'' })
  const [submitted, setSubmit] = useState(false)
  const [openFaq, setOpenFaq]  = useState<number|null>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return
    setSubmit(true)
  }

  return (
    <div className="page-enter">
      {/* Header */}
      <div className="bg-[#F4F3F0] border-b border-[#D6D3CE] px-6 md:px-10 py-14">
        <div className="max-w-7xl mx-auto">
          <span className="block text-[11px] font-semibold tracking-[0.12em] uppercase text-brand mb-2">Get in Touch</span>
          <h1 className="font-display text-5xl text-[#111110] mb-3">Contact Us</h1>
          <p className="text-[#6B6860] text-sm max-w-md leading-relaxed">
            We respond to every message personally within 24 hours on business days. No bots, no templates — just real people who care.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-14 items-start">

          {/* Form */}
          <FadeUp>
            <h2 className="font-display text-3xl mb-7">Send a Message</h2>
            {submitted ? (
              <div className="border border-[#D6D3CE] rounded-sm p-10 text-center page-enter">
                <div className="w-14 h-14 bg-brand rounded-full mx-auto mb-6 flex items-center justify-center">
                  <svg className="w-6 h-6 stroke-white" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <h3 className="font-display text-2xl mb-2">Message Received</h3>
                <p className="text-[13px] text-[#6B6860] leading-relaxed mb-6">
                  Thank you, <strong>{form.name}</strong>. We&apos;ll reply to <strong>{form.email}</strong> within 24 hours.
                </p>
                <button onClick={() => { setSubmit(false); setForm({ name:'',email:'',subject:'',category:'',message:'' }) }}
                  className="text-[11px] tracking-wider uppercase font-semibold text-brand border-b border-brand pb-0.5">
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {[['Full Name','name','text','Chidi Okonkwo'],['Email Address','email','email','you@email.com']].map(([label,key,type,ph]) => (
                    <div key={key}>
                      <label className="block text-[11px] font-semibold tracking-wider uppercase text-[#6B6860] mb-1.5">{label} <span className="text-brand">*</span></label>
                      <input type={type} value={form[key as keyof typeof form]} onChange={e => setForm(f=>({...f,[key]:e.target.value}))} placeholder={ph} required
                        className="w-full border border-[#D6D3CE] focus:border-brand rounded-sm px-3 py-2.5 text-sm outline-none transition-colors"/>
                    </div>
                  ))}
                </div>
                <div>
                  <label className="block text-[11px] font-semibold tracking-wider uppercase text-[#6B6860] mb-1.5">Category</label>
                  <select value={form.category} onChange={e => setForm(f=>({...f,category:e.target.value}))}
                    className="w-full border border-[#D6D3CE] focus:border-brand rounded-sm px-3 py-2.5 text-sm outline-none bg-white appearance-none">
                    <option value="">Select a category</option>
                    {['Order Support','Delivery Issue','Product Enquiry','Wholesale / B2B','Subscription','General Feedback','Other'].map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold tracking-wider uppercase text-[#6B6860] mb-1.5">Subject</label>
                  <input type="text" value={form.subject} onChange={e => setForm(f=>({...f,subject:e.target.value}))} placeholder="How can we help?"
                    className="w-full border border-[#D6D3CE] focus:border-brand rounded-sm px-3 py-2.5 text-sm outline-none transition-colors"/>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold tracking-wider uppercase text-[#6B6860] mb-1.5">Message <span className="text-brand">*</span></label>
                  <textarea value={form.message} onChange={e => setForm(f=>({...f,message:e.target.value}))} placeholder="Tell us everything — the more detail, the faster we can help." required rows={6}
                    className="w-full border border-[#D6D3CE] focus:border-brand rounded-sm px-3 py-2.5 text-sm outline-none transition-colors resize-none"/>
                </div>
                <button type="submit"
                  className="bg-brand hover:bg-brand-dark text-white px-8 py-3 text-[12px] font-semibold tracking-widest uppercase rounded-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand/20">
                  Send Message
                </button>
              </form>
            )}
          </FadeUp>

          {/* Info */}
          <div className="space-y-5">
            {[
              { title:'Customer Support', lines:['+234 915 557 8884','Mon – Sat: 8am – 7pm WAT'] },
              { title:'Wholesale & B2B',  lines:['+234 915 557 8884','Min. order: 100 bottles / week'] },
              { title:'Press & Media',    lines:['fruitguardnigeria@gmail.com','Response within 4 business hours'] },
            ].map(({ title, lines }, i) => (
              <FadeUp key={title} delay={i * 80}>
                <div className="border border-[#D6D3CE] rounded-sm p-6 hover:border-brand-mid hover:shadow-sm transition-all duration-200">
                  <p className="text-[11px] font-bold tracking-wider uppercase text-brand mb-3">{title}</p>
                  {lines.map(l => <p key={l} className="text-[13px] text-[#6B6860] mb-1">{l}</p>)}
                </div>
              </FadeUp>
            ))}

            <FadeUp delay={240}>
              <div className="border border-[#D6D3CE] rounded-sm p-6">
                <p className="text-[11px] font-bold tracking-wider uppercase text-brand mb-3">Visit Our Facility</p>
                <p className="text-[13px] text-[#6B6860] leading-relaxed">OPIC Plaza<br/>Ikeja, Lagos State, Nigeria</p>
                <p className="text-[12px] text-[#6B6860] mt-3">Tours by appointment: <span className="text-brand">fruitguardnigeria.com</span></p>

                {/* ✅ Map added */}
                <div className="mt-5 w-full h-[180px] rounded-sm overflow-hidden border border-[#D6D3CE]">
                  <iframe
                    src="https://www.google.com/maps?q=OPIC+Plaza+Ikeja+Lagos&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                  />
                </div>

                <a
                  href="https://www.google.com/maps/dir/?api=1&destination=OPIC+Plaza+Ikeja+Lagos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-3 text-[11px] tracking-wider uppercase font-semibold text-brand border-b border-brand pb-0.5"
                >
                  Get Directions
                </a>
              </div>
            </FadeUp>

            <FadeUp delay={300}>
              <div className="border border-[#D6D3CE] rounded-sm p-6">
                <p className="text-[11px] font-bold tracking-wider uppercase text-brand mb-3">Follow Us</p>
                <div className="flex gap-2 flex-wrap">
                  {[['Instagram','@fruitguard_ng'],['Twitter','@fruitguard'],['WhatsApp','Chat with us']].map(([platform,handle]) => (
                    <a
                      key={platform}
                      href={platform === 'WhatsApp'
                        ? 'https://wa.me/2349155578884?text=Hello%20FruitGuard,%20I%27d%20like%20to%20make%20an%20enquiry.'
                        : '#'}
                      target={platform === 'WhatsApp' ? '_blank' : undefined}
                      rel={platform === 'WhatsApp' ? 'noopener noreferrer' : undefined}
                      className="border border-[#D6D3CE] hover:border-brand rounded-sm px-3 py-2 text-center transition-all duration-200 hover:bg-brand-pale">
                      <p className="text-[10px] font-bold tracking-wider uppercase text-[#6B6860]">{platform}</p>
                      <p className="text-[11px] text-[#6B6860] mt-0.5">{handle}</p>
                    </a>
                  ))}
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </div>

      
      {/* ✅ FAQ RESTORED */}
      <section className="bg-[#F4F3F0] border-t border-[#D6D3CE] py-20 px-6 md:px-10">
        <div className="max-w-3xl mx-auto">
          <FadeUp>
            <span className="block text-[11px] font-semibold tracking-[0.12em] uppercase text-brand mb-2">Quick Answers</span>
            <h2 className="font-display text-4xl mb-10">Frequently Asked Questions</h2>
          </FadeUp>
          <div className="border border-[#D6D3CE] rounded-sm overflow-hidden">
            {FAQS.map((faq, i) => (
              <FadeUp key={i} delay={i * 50}>
                <div className="bg-white border-b border-[#D6D3CE] last:border-0">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 hover:bg-brand-pale transition-colors">
                    <span className="font-medium text-[14px]">{faq.q}</span>
                    <span className={`text-brand text-2xl ${openFaq === i ? 'rotate-45' : ''}`}>+</span>
                  </button>
                  <div className={`${openFaq === i ? 'max-h-40' : 'max-h-0'} overflow-hidden transition-all`}>
                    <div className="px-6 pb-5">
                      <p className="text-[13px] text-[#6B6860] border-l-2 border-brand pl-4">{faq.a}</p>
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ stays unchanged */}
    </div>
  )
}