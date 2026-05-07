'use client'

import { motion } from 'framer-motion'
import { useRef } from 'react'

const testimonials = [
  {
    name: 'ana paula s.',
    role: 'designer, 32 anos',
    text: 'eu achava que meu problema com dinheiro era falta de disciplina. depois de trabalhar com a marcelle, entendi que era medo. essa mudança de perspectiva mudou tudo.',
    result: 'quitou r$ 28k em dívidas em 14 meses',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'fernanda m.',
    role: 'professora, 41 anos',
    text: 'nunca imaginei que eu poderia juntar dinheiro para uma reserva de emergência. hoje tenho 6 meses de reserva e estou começando a investir.',
    result: 'construiu reserva de r$ 18k',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'carla r.',
    role: 'empreendedora, 38 anos',
    text: 'a marcelle conseguiu traduzir questões financeiras complexas de forma simples e humana. sem aquela pressão de que você precisa ser perfeita.',
    result: 'lucro cresceu 40% após reorganização',
    image: 'https://images.unsplash.com/photo-1531123897727-8f129e1bfa82?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'juliana t.',
    role: 'enfermeira, 29 anos',
    text: 'cheguei endividada e com muito medo de olhar para as contas. em 8 meses, não só quitei as dívidas como finalmente consegui comprar meu apartamento.',
    result: 'realizou o sonho do apartamento próprio',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'beatriz l.',
    role: 'advogada, 35 anos',
    text: 'ganhava bem e não entendia por que nunca sobrava nada. o processo me ajudou a identificar gastos invisíveis e criar um estilo de vida financeiro que faz sentido.',
    result: 'reduziu gastos em 35% sem sofrimento',
    image: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&w=600&q=80',
  },
]

export function TestimonialsSection() {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scrollNext = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 400, behavior: 'smooth' })
    }
  }

  const scrollPrev = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -400, behavior: 'smooth' })
    }
  }

  return (
    <section id="depoimentos" className="py-28 bg-teal overflow-hidden">
      <div className="px-6 md:px-16 lg:px-24 mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-xs font-semibold tracking-widest text-coral lowercase mb-3">depoimentos</p>
          <h2 className="font-sans text-4xl md:text-5xl font-bold text-cream leading-tight">
            histórias reais
            <br />
            <em className="italic text-coral/90">de transformação</em>
          </h2>
        </motion.div>

        {/* Nav arrows */}
        <motion.div 
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <button
            onClick={scrollPrev}
            className="w-12 h-12 rounded-full border border-cream/20 flex items-center justify-center text-cream hover:bg-cream hover:text-teal transition-all duration-300"
            aria-label="Anterior"
          >
            ←
          </button>
          <button
            onClick={scrollNext}
            className="w-12 h-12 rounded-full border border-cream/20 flex items-center justify-center text-cream hover:bg-cream hover:text-teal transition-all duration-300"
            aria-label="Próximo"
          >
            →
          </button>
        </motion.div>
      </div>

      {/* Carousel Track */}
      <motion.div 
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory px-6 md:px-16 lg:px-24 pb-12 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        {testimonials.map((t, i) => (
          <div 
            key={i} 
            className="relative flex-shrink-0 w-[85vw] sm:w-[380px] h-[540px] rounded-3xl overflow-hidden snap-center group bg-[#051a16]"
          >
            {/* Background Image */}
            <img 
              src={t.image} 
              alt={t.name} 
              className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700" 
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-teal via-teal/80 to-transparent" />
            
            {/* Content */}
            <div className="absolute inset-0 p-8 flex flex-col justify-end">
              {/* Quote Icon */}
              <svg className="w-8 h-8 text-coral mb-5 opacity-90" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              
              <p className="font-sans text-lg md:text-xl text-cream font-medium leading-relaxed mb-6">
                "{t.text}"
              </p>

              <div className="flex flex-col gap-1.5 border-t border-cream/10 pt-5 mt-2">
                <p className="font-bold text-white lowercase">— {t.name}</p>
                <p className="text-sm text-cream/60 lowercase">{t.role}</p>
              </div>

              {/* Result Badge */}
              <div className="mt-4 self-start bg-coral/20 backdrop-blur-sm border border-coral/30 px-3 py-1.5 rounded-lg">
                <p className="text-xs font-bold text-coral lowercase">{t.result}</p>
              </div>
            </div>
          </div>
        ))}

        {/* Spacer to allow scrolling past the last item symmetrically */}
        <div className="w-[1px] flex-shrink-0" />
      </motion.div>
    </section>
  )
}
