const navLinks = [
  { href: '#servicos', label: 'serviços' },
  { href: '#metodologia', label: 'metodologia' },
  { href: '#depoimentos', label: 'depoimentos' },
  { href: '#faq', label: 'faq' },
  { href: '#contato', label: 'contato' },
]

const tagline = [
  'consciência', '·', 'consistência', '·', 'compaixão', '·',
  'planejamento humanizado', '·', 'sem culpa', '·', 'com estratégia', '·',
  'consciência', '·', 'consistência', '·', 'compaixão', '·',
  'planejamento humanizado', '·', 'sem culpa', '·', 'com estratégia', '·',
]

export function Footer() {
  return (
    <footer className="bg-teal overflow-hidden">
      {/* Marquee strip */}
      <div className="border-b border-cream/10 py-3 overflow-hidden">
        <div className="marquee-track select-none">
          {tagline.map((item, i) => (
            <span
              key={i}
              className={`px-5 text-sm whitespace-nowrap font-medium ${
                item === '·' ? 'text-coral' : 'text-cream/30 lowercase'
              }`}
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Main footer content */}
      <div className="px-6 md:px-16 lg:px-24 py-16">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-10">

          {/* Brand */}
          <div className="max-w-xs">
            <div className="flex items-center gap-3 mb-4">
              <img src="/logo-simbolo.svg" alt="mb" className="h-8 w-auto brightness-0 invert opacity-70" />
              <img src="/logo-wordmark.svg" alt="marcelle breciani" className="h-3.5 w-auto brightness-0 invert opacity-50" />
            </div>
            <p className="text-sm text-cream/35 lowercase leading-relaxed">
              planejamento financeiro humanizado — transformando sua relação com o dinheiro desde dentro.
            </p>
          </div>

          {/* Nav */}
          <nav className="flex flex-col gap-2">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm text-cream/40 hover:text-cream transition-colors duration-200 lowercase"
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* CTA block */}
          <div className="text-left md:text-right">
            <p className="font-sans text-xl text-cream/70 italic mb-4 lowercase">
              pronta para começar?
            </p>
            <a
              href="#contato"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-coral text-white text-sm font-semibold hover:bg-coral/85 transition-colors lowercase"
            >
              falar com a marcelle →
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-6 border-t border-cream/8 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-cream/20 lowercase">© 2025 marcelle breciani. todos os direitos reservados.</p>
          <p className="text-xs text-cream/15 lowercase">planejamento financeiro humanizado</p>
        </div>
      </div>
    </footer>
  )
}
