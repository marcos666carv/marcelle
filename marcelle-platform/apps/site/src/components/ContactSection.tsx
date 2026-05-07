'use client'

import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { Send, CheckCircle } from 'lucide-react'

const schema = z.object({
  name: z.string().min(2, 'informe seu nome'),
  email: z.string().email('email inválido'),
  phone: z.string().optional(),
  goal: z.string().min(1, 'selecione um objetivo'),
  message: z.string().min(10, 'conte um pouco mais sobre você').max(600),
})

type FormData = z.infer<typeof schema>

const goals = [
  'quitar dívidas',
  'construir reserva de emergência',
  'começar a investir',
  'organizar as finanças do zero',
  'separar finanças pessoais do negócio',
  'outro',
]

const inputClass =
  'w-full px-4 py-3 rounded-xl border border-border bg-linen text-teal text-sm placeholder:text-teal/30 focus:outline-none focus:border-coral transition-colors lowercase'

export function ContactSection() {
  const [sent, setSent] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    await new Promise((r) => setTimeout(r, 1000))
    console.log(data)
    setSent(true)
  }

  return (
    <section id="contato" className="py-28 bg-sage">
      <div className="px-6 md:px-16 lg:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Left — copy */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-xs font-semibold tracking-widest text-coral/70 lowercase mb-4">contato</p>
            <h2 className="font-sans text-4xl md:text-5xl font-bold text-teal leading-tight mb-6">
              pronta para
              <br />
              <em className="italic text-coral">começar?</em>
            </h2>
            <p className="text-teal/55 text-base leading-relaxed mb-8 lowercase">
              me conta um pouco sobre você e o que te trouxe até aqui. entro em contato para conversarmos sobre como posso te ajudar.
            </p>

            {/* Contact info */}
            <div className="space-y-3 mb-10">
              {[
                { icon: '✉', label: 'email', value: 'marcellebreciani@gmail.com' },
                { icon: '◎', label: 'instagram', value: '@marcellebreciani' },
              ].map((c) => (
                <div key={c.label} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-coral/10 flex items-center justify-center text-coral text-sm flex-shrink-0">
                    {c.icon}
                  </div>
                  <div>
                    <p className="text-xs text-teal/35 lowercase tracking-widest">{c.label}</p>
                    <p className="text-teal font-semibold text-sm lowercase">{c.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: '✦', title: 'sem compromisso', desc: 'a primeira conversa é gratuita' },
                { icon: '∞', title: 'sem contrato longo', desc: 'você decide se quer continuar' },
              ].map((b) => (
                <div key={b.title} className="p-4 bg-linen border border-teal/8 rounded-2xl">
                  <span className="text-coral text-lg">{b.icon}</span>
                  <p className="text-sm font-bold text-teal lowercase mt-2">{b.title}</p>
                  <p className="text-xs text-teal/45 lowercase mt-0.5">{b.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — form */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            {sent ? (
              <div className="bg-teal rounded-3xl p-12 flex flex-col items-center justify-center text-center min-h-[480px]">
                <CheckCircle size={48} className="text-coral mb-6" />
                <h3 className="font-sans text-2xl font-bold text-cream lowercase mb-3">mensagem enviada!</h3>
                <p className="text-cream/55 max-w-sm lowercase text-sm">
                  obrigada pelo contato. retorno em até 24 horas úteis para conversarmos.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-linen border border-border/40 rounded-3xl p-8 space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-teal/60 lowercase mb-1.5">
                      nome <span className="text-coral">*</span>
                    </label>
                    <input {...register('name')} placeholder="seu nome" className={inputClass} />
                    {errors.name && <p className="mt-1 text-xs text-coral lowercase">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-teal/60 lowercase mb-1.5">
                      email <span className="text-coral">*</span>
                    </label>
                    <input {...register('email')} type="email" placeholder="seu@email.com" className={inputClass} />
                    {errors.email && <p className="mt-1 text-xs text-coral lowercase">{errors.email.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-teal/60 lowercase mb-1.5">whatsapp</label>
                  <input {...register('phone')} placeholder="(11) 9 9999-9999" className={inputClass} />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-teal/60 lowercase mb-1.5">
                    qual é seu principal objetivo? <span className="text-coral">*</span>
                  </label>
                  <select {...register('goal')} className={inputClass}>
                    <option value="">selecione...</option>
                    {goals.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                  {errors.goal && <p className="mt-1 text-xs text-coral lowercase">{errors.goal.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-teal/60 lowercase mb-1.5">
                    conta um pouco sobre você <span className="text-coral">*</span>
                  </label>
                  <textarea
                    {...register('message')}
                    rows={4}
                    placeholder="o que te trouxe até aqui? qual é a sua situação atual?"
                    className={`${inputClass} resize-none`}
                  />
                  {errors.message && <p className="mt-1 text-xs text-coral lowercase">{errors.message.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-coral text-white font-semibold text-sm hover:bg-coral/85 disabled:opacity-60 transition-colors lowercase"
                >
                  {isSubmitting ? 'enviando...' : <><span>enviar mensagem</span><Send size={15} /></>}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
