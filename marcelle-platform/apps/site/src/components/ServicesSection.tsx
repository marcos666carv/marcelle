'use client'

import { motion } from 'framer-motion'

const services = [
  {
    tag: '01',
    title: 'acompanhamento individual',
    description:
      'sessões mensais onde mapeamos sua realidade financeira, identificamos padrões e construímos um plano personalizado que cabe na sua vida.',
    highlight: 'para quem quer transformação profunda e acompanhamento próximo.',
    iconColor: '#E8341A',
    icon: (
      <svg viewBox="0 0 64 80" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 0 L56 0 Q40 40 56 80 L8 80 Q24 40 8 0Z" />
      </svg>
    ),
  },
  {
    tag: '02',
    title: 'educação financeira',
    description:
      'trilhas de conteúdo que ensinam os fundamentos de finanças pessoais de forma humana — sem julgamentos, com exemplos reais.',
    highlight: 'para quem quer aprender no próprio ritmo.',
    iconColor: '#1A3CF5',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="6" fill="currentColor" strokeWidth="0" />
        <circle cx="32" cy="32" r="14" />
        <circle cx="32" cy="32" r="22" />
        <circle cx="32" cy="32" r="30" />
      </svg>
    ),
  },
  {
    tag: '03',
    title: 'plano financeiro personalizado',
    description:
      'diagnóstico completo da sua situação atual e construção de um plano com metas claras, estratégias de curto e longo prazo.',
    highlight: 'para quem precisa de um mapa claro para o futuro.',
    iconColor: '#E878D8',
    icon: (
      <svg viewBox="0 0 64 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 48 L22 8 L32 24 L46 0 L64 0 L40 40 L30 24 L16 48Z" />
      </svg>
    ),
  },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

const item = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

export function ServicesSection() {
  return (
    <section id="servicos" className="py-28 bg-sage">
      <div className="px-6 md:px-16 lg:px-24">

        {/* Header */}
        <motion.div
          className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div>
            <p className="text-xs font-semibold tracking-widest text-coral/70 lowercase mb-3">serviços</p>
            <h2 className="font-sans text-4xl md:text-5xl font-bold text-teal leading-tight">
              o que eu ofereço
              <br />
              <em className="italic text-coral">para você</em>
            </h2>
          </div>
          <p className="text-teal/50 max-w-xs text-sm leading-relaxed lowercase">
            cada formato foi desenhado para um momento diferente da jornada financeira.
          </p>
        </motion.div>

        {/* Cards — 4 colunas lado a lado */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border/30 rounded-3xl overflow-hidden"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
        >
          {services.map((s, i) => (
            <motion.div
              key={i}
              variants={item}
              className="group relative bg-cream p-8 flex flex-col gap-6 hover:bg-linen transition-colors duration-300 cursor-default"
            >
              {/* Icon topo — cor que era o BG */}
              <div
                className="w-14 h-14 flex items-center justify-center flex-shrink-0"
                style={{ color: s.iconColor }}
              >
                {s.icon}
              </div>

              {/* Número */}
              <span className="text-5xl font-black leading-none text-teal/8 select-none absolute top-6 right-7">
                {s.tag}
              </span>

              {/* Conteúdo */}
              <div className="flex flex-col gap-3 flex-1">
                <h3 className="font-sans text-base font-bold text-teal lowercase leading-snug">
                  {s.title}
                </h3>
                <p className="text-teal/55 text-sm leading-relaxed lowercase flex-1">
                  {s.description}
                </p>
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-teal/8">
                <p className="text-xs font-semibold lowercase" style={{ color: s.iconColor }}>
                  {s.highlight}
                </p>
              </div>

              {/* Hover line accent */}
              <div
                className="absolute bottom-0 left-0 right-0 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                style={{ backgroundColor: s.iconColor }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <a
            href="#contato"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-teal text-cream font-semibold text-sm hover:bg-teal/85 transition-colors lowercase"
          >
            quero saber qual serviço é para mim →
          </a>
        </motion.div>
      </div>
    </section>
  )
}
