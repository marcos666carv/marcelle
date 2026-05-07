'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'

const faqs = [
  {
    question: 'para quem é o planejamento financeiro humanizado?',
    answer:
      'para qualquer pessoa que sente que sua relação com o dinheiro poderia ser melhor — seja você endividada, sem reserva, com renda instável, ou mesmo quem ganha bem mas não sabe para onde vai o dinheiro. o processo se adapta à sua realidade, não o contrário.',
  },
  {
    question: 'qual a diferença para um assessor financeiro tradicional?',
    answer:
      'assessores tradicionais focam em investimentos e produtos financeiros. meu trabalho vai antes disso: entendemos sua relação emocional com o dinheiro, organizamos sua vida financeira e construímos hábitos sustentáveis. só depois, quando faz sentido, falamos de investimentos.',
  },
  {
    question: 'preciso ganhar muito para começar?',
    answer:
      'não. o planejamento financeiro humanizado é para qualquer renda. na verdade, quanto antes você começa — independente da renda — mais transformação é possível. o que importa é o comprometimento com o processo.',
  },
  {
    question: 'como funcionam as sessões de acompanhamento?',
    answer:
      'as sessões acontecem mensalmente, online, com duração de 60 a 90 minutos. revisamos o que aconteceu, ajustamos o plano se necessário, celebramos conquistas e definimos os próximos passos. entre as sessões, você tem acesso à plataforma.',
  },
  {
    question: 'quanto tempo leva para ver resultados?',
    answer:
      'os primeiros resultados — clareza sobre sua situação e alívio da ansiedade — chegam já nas primeiras semanas. mudanças concretas dependem da sua situação, mas com comprometimento a maioria vê transformações significativas em 3 a 6 meses.',
  },
  {
    question: 'o que está incluso na plataforma?',
    answer:
      'sua área personalizada com plano financeiro, trilhas de educação financeira, registro de tarefas e metas, histórico de sessões e canal direto para tirar dúvidas. é o seu centro de controle financeiro.',
  },
  {
    question: 'posso cancelar quando quiser?',
    answer:
      'sim. não trabalho com contratos de longo prazo obrigatórios. acredito que você deve continuar porque está vendo valor, não por obrigação contratual.',
  },
]

function FAQItem({ faq, index }: { faq: (typeof faqs)[number]; index: number }) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      className="border-b border-border/60"
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.45, delay: index * 0.05 }}
    >
      <button
        className="w-full flex items-center justify-between py-6 text-left group"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="font-sans text-base font-semibold text-teal group-hover:text-coral transition-colors pr-4 lowercase">
          {faq.question}
        </span>
        <span className={`flex-shrink-0 w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-200 ${
          open ? 'border-coral bg-coral text-white' : 'border-border text-teal group-hover:border-coral group-hover:text-coral'
        }`}>
          {open ? <Minus size={13} /> : <Plus size={13} />}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-teal/55 leading-relaxed text-sm lowercase">{faq.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export function FAQSection() {
  return (
    <section id="faq" className="py-28 bg-sage">
      <div className="px-6 md:px-16 lg:px-24 max-w-5xl">
        {/* Header */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-xs font-semibold tracking-widest text-coral/70 lowercase mb-4">faq</p>
          <h2 className="font-sans text-4xl md:text-5xl font-bold text-teal leading-tight">
            perguntas
            <br />
            <em className="italic text-coral">frequentes</em>
          </h2>
          <p className="mt-4 text-teal/45 text-base lowercase">
            respondendo as dúvidas mais comuns antes da nossa conversa.
          </p>
        </motion.div>

        {/* Accordion */}
        <div>
          {faqs.map((faq, i) => (
            <FAQItem key={i} faq={faq} index={i} />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="mt-16 bg-linen rounded-3xl p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div>
            <p className="font-sans text-2xl font-bold text-teal lowercase mb-1">ainda tem dúvidas?</p>
            <p className="text-teal/50 text-sm lowercase">
              me manda uma mensagem. respondo tudo antes de você tomar qualquer decisão.
            </p>
          </div>
          <a
            href="#contato"
            className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-coral text-white text-sm font-semibold hover:bg-coral/85 transition-colors lowercase"
          >
            falar com a marcelle →
          </a>
        </motion.div>
      </div>
    </section>
  )
}
