'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'

const marqueeItems = [
  'consciência', '·', 'consistência', '·', 'compaixão', '·',
  'planejamento humanizado', '·', 'sem culpa', '·', 'com estratégia', '·',
  'transformação real', '·', 'sua história importa', '·',
]

// Brand geometric cluster: fills the right column around the photo
function PhotoWithGeometry() {
  return (
    <div className="relative w-full max-w-[600px] aspect-square mx-auto">
      {/* ── Photo card (nova imagem com geometria embutida) ── */}
      <div className="absolute inset-0">
        <Image
          src="/marcelle-hero.png"
          alt="Marcelle Breciani — planejadora financeira"
          fill
          className="object-contain"
          priority
        />
      </div>

      {/* Tag badge */}
      <div className="absolute right-0 top-12 bg-white px-3 py-1.5 shadow-lg border border-border/30 flex items-center gap-1.5" style={{ borderRadius: '2px' }}>
        <span className="w-1.5 h-1.5 rounded-full bg-coral animate-pulse" />
        <span className="text-xs font-semibold text-teal">@marcellebreciani</span>
      </div>

      {/* Result pill */}
      <div className="absolute bottom-4 right-4 bg-teal px-4 py-3 shadow-xl" style={{ borderRadius: '2px' }}>
        <p className="text-white text-xs lowercase font-medium">transformação real</p>
        <p className="text-salmon text-lg font-bold">+200 clientes</p>
      </div>
    </div>
  )
}

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  const progress = useSpring(scrollYProgress, { stiffness: 60, damping: 20 })

  const textOpacity = useTransform(progress, [0, 0.4, 0.65], [1, 1, 0])
  const textY = useTransform(progress, [0, 0.65], [0, -50])
  const bgScale = useTransform(progress, [0, 1], [1, 1.08])

  return (
    <section id="hero" className="relative min-h-screen flex flex-col bg-sage overflow-hidden">
      
      {/* Right panel — sage darker */}
      <motion.div
        className="absolute right-0 top-0 hidden md:block md:w-[52%] h-full bg-linen"
        initial={{ x: 60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      />

      {/* Electric blue triangle accent */}
      <div className="absolute right-20 top-0 hidden md:block">
        <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
          <polygon points="0,0 56,0 56,56" fill="#1A3CF5" />
        </svg>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex flex-col pt-24">
        
        {/* Top area: The main grid */}
        <div className="w-full px-6 md:px-16 lg:px-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center flex-1">

            {/* Left — text */}
            <div className="py-8 md:py-0">
              {/* Logo mark inline */}
              <motion.div
                className="flex items-center gap-3 mb-8"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <img src="/logo-simbolo-v2.svg" alt="mb" className="h-8 w-auto" />
                <span className="text-xs font-semibold tracking-widest text-teal/50 lowercase">
                  planejamento financeiro humanizado
                </span>
              </motion.div>

              <motion.h1
                className="font-sans text-5xl md:text-6xl lg:text-7xl font-bold text-teal leading-[1.0] mb-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                sua relação
                <br />
                com o dinheiro
                <br />
                <span className="text-coral">pode ser</span>
                <br />
                <em className="italic">diferente.</em>
              </motion.h1>

              <motion.p
                className="text-base md:text-lg text-teal/55 max-w-md mb-10 leading-relaxed lowercase"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
              >
                um processo que respeita sua história, seus valores e seu ritmo — sem culpa, sem planilhas que assustam.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row items-start gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.6 }}
              >
                <a
                  href="#contato"
                  className="px-7 py-3.5 bg-coral text-white text-sm font-semibold hover:bg-coral/85 transition-colors lowercase"
                >
                  quero começar minha jornada →
                </a>
                <a
                  href="#metodologia"
                  className="px-7 py-3.5 border border-teal/20 text-teal text-sm font-medium hover:border-teal/50 transition-colors lowercase"
                >
                  como funciona
                </a>
              </motion.div>

              {/* Stats */}
              <motion.div
                className="mt-12 flex items-center gap-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.6 }}
              >
                {[
                  { value: '+200', label: 'vidas transformadas' },
                  { value: '4 anos', label: 'de experiência' },
                  { value: '100%', label: 'humanizado' },
                ].map((s) => (
                  <div key={s.label}>
                     <p className="font-sans text-2xl font-bold text-teal">{s.value}</p>
                    <p className="text-xs text-teal/40 lowercase mt-0.5">{s.label}</p>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right — photo with brand geometry */}
            <motion.div
              className="relative hidden md:flex items-center justify-center h-[520px]"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.9, ease: 'easeOut' }}
            >
              <PhotoWithGeometry />
            </motion.div>
        </div>

        {/* Bottom area: Constrained to the left (green) side */}
        <div className="w-full md:w-[48%] flex flex-col justify-end pb-12 pt-16 md:pt-0">
          <div className="border-y border-teal/10 py-3 overflow-hidden w-full">
            <div className="marquee-track select-none">
              {[...marqueeItems, ...marqueeItems].map((item, i) => (
                <span
                  key={i}
                  className={`px-6 text-sm font-medium whitespace-nowrap ${
                    item === '·' ? 'text-coral' : 'text-teal/50 lowercase'
                  }`}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
