'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Star } from 'lucide-react'

const testimonials = [
  {
    name: 'ana paula s.',
    role: 'designer, 32 anos',
    text: 'eu achava que meu problema com dinheiro era falta de disciplina. depois de trabalhar com a marcelle, entendi que era medo. essa mudança de perspectiva mudou tudo.',
    result: 'quitou r$ 28k em dívidas em 14 meses',
    initials: 'AP',
    color: 'bg-coral',
  },
  {
    name: 'fernanda m.',
    role: 'professora, 41 anos',
    text: 'nunca imaginei que eu poderia juntar dinheiro para uma reserva de emergência. hoje tenho 6 meses de reserva e estou começando a investir.',
    result: 'construiu reserva de r$ 18k',
    initials: 'FM',
    color: 'bg-electric',
  },
  {
    name: 'carla r.',
    role: 'empreendedora, 38 anos',
    text: 'a marcelle conseguiu traduzir questões financeiras complexas de forma simples e humana. sem aquela pressão de que você precisa ser perfeita.',
    result: 'lucro cresceu 40% após reorganização',
    initials: 'CR',
    color: 'bg-teal',
  },
  {
    name: 'juliana t.',
    role: 'enfermeira, 29 anos',
    text: 'cheguei endividada e com muito medo de olhar para as contas. em 8 meses, não só quitei as dívidas como finalmente consegui comprar meu apartamento.',
    result: 'realizou o sonho do apartamento próprio',
    initials: 'JT',
    color: 'bg-salmon',
  },
  {
    name: 'beatriz l.',
    role: 'advogada, 35 anos',
    text: 'ganhava bem e não entendia por que nunca sobrava nada. o processo da marcelle me ajudou a identificar gastos invisíveis e criar um estilo de vida financeiro que faz sentido pra mim.',
    result: 'reduziu gastos em 35% sem sofrimento',
    initials: 'BL',
    color: 'bg-amber',
  },
]

export function TestimonialsSection() {
  const [current, setCurrent] = useState(0)
  const t = testimonials[current]!

  return (
    <section id="depoimentos" className="py-28 bg-linen overflow-hidden">
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
            <p className="text-xs font-semibold tracking-widest text-coral/70 lowercase mb-3">depoimentos</p>
            <h2 className="font-sans text-4xl md:text-5xl font-bold text-teal leading-tight">
              histórias reais
              <br />
              <em className="italic text-coral">de transformação</em>
            </h2>
          </div>

          {/* Nav arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrent((c) => (c === 0 ? testimonials.length - 1 : c - 1))}
              className="w-11 h-11 rounded-full border border-border flex items-center justify-center text-teal hover:bg-coral hover:text-white hover:border-coral transition-all duration-200 text-lg"
              aria-label="Anterior"
            >
              ←
            </button>
            <button
              onClick={() => setCurrent((c) => (c === testimonials.length - 1 ? 0 : c + 1))}
              className="w-11 h-11 rounded-full border border-border flex items-center justify-center text-teal hover:bg-coral hover:text-white hover:border-coral transition-all duration-200 text-lg"
              aria-label="Próximo"
            >
              →
            </button>
          </div>
        </motion.div>

        {/* Main testimonial */}
        <motion.div
          key={current}
          className="grid grid-cols-1 lg:grid-cols-5 gap-5 mb-8"
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          {/* Large quote card */}
          <div className="lg:col-span-3 bg-teal rounded-3xl p-10 relative overflow-hidden">
            {/* Decorative symbol */}
            <div className="absolute -top-6 -left-2 font-sans text-[160px] text-cream/4 leading-none select-none pointer-events-none">
              "
            </div>

            {/* Stars */}
            <div className="flex gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} className="fill-coral text-coral" />
              ))}
            </div>

            <p className="font-sans text-xl md:text-2xl text-cream leading-relaxed mb-8 italic">
              "{t.text}"
            </p>

            {/* Author */}
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full ${t.color} flex items-center justify-center flex-shrink-0`}>
                <span className="text-sm font-black text-white">{t.initials}</span>
              </div>
              <div>
                <p className="font-semibold text-cream lowercase">{t.name}</p>
                <p className="text-xs text-cream/45 lowercase">{t.role}</p>
              </div>
            </div>

            {/* Checker accent corner */}
            <div className="absolute bottom-0 right-0 w-20 h-20 checker-coral opacity-10 rounded-tl-3xl" />
          </div>

          {/* Side panels */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {/* Result card */}
            <div className="bg-coral rounded-3xl p-8 flex-1 relative overflow-hidden">
              <p className="text-xs font-bold tracking-widest text-white/60 lowercase mb-3">resultado</p>
              <p className="font-sans text-2xl font-bold text-white leading-snug lowercase">{t.result}</p>
              <div className="absolute -bottom-4 -right-4 text-[80px] text-white/10 font-black select-none">✦</div>
            </div>

            {/* Social proof */}
            <div className="bg-linen border border-teal/8 rounded-3xl p-6">
              <div className="flex items-center gap-3 mb-3">
                {testimonials.map((test, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`w-8 h-8 rounded-full text-xs font-black transition-all duration-200 ${
                      i === current
                        ? `${test.color} text-white scale-110`
                        : 'bg-teal/10 text-teal/40 hover:bg-teal/20'
                    }`}
                  >
                    {test.initials}
                  </button>
                ))}
              </div>
              <p className="text-xs text-teal/45 leading-relaxed lowercase">
                cada jornada é única. resultados variam de acordo com a situação e o comprometimento de cada pessoa.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Dot indicators */}
        <div className="flex items-center justify-center gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current ? 'w-8 h-2 bg-coral' : 'w-2 h-2 bg-border hover:bg-coral/30'
              }`}
              aria-label={`Depoimento ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
