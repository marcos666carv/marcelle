'use client'

import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'

/* ─── Orbit diagram ──────────────────────────────────────────── */

const phases = [
  {
    number: '01',
    label: 'diagnóstico',
    sub: 'de onde você vem',
    angle: -90,
    color: '#E8341A',
    textColor: '#ffffff',
  },
  {
    number: '02',
    label: 'mapeamento',
    sub: 'sua realidade',
    angle: 0,
    color: '#1A3CF5',
    textColor: '#ffffff',
  },
  {
    number: '03',
    label: 'estratégia',
    sub: 'seu caminho',
    angle: 90,
    color: '#E878D8',
    textColor: '#ffffff',
  },
  {
    number: '04',
    label: 'acompanhamento',
    sub: 'você não está só',
    angle: 180,
    color: '#0b3b32',
    textColor: '#D4DBC5',
  },
]

function toRad(deg: number) { return (deg * Math.PI) / 180 }

const cx = 350
const cy = 350
const R  = 210
const r  = 36

function nodePos(angle: number) {
  return {
    x: cx + R * Math.cos(toRad(angle)),
    y: cy + R * Math.sin(toRad(angle)),
  }
}

const growthPoints = [
  { x: 100, y: 560 },
  { x: 170, y: 500 },
  { x: 240, y: 430 },
  { x: 310, y: 350 },
  { x: 390, y: 275 },
  { x: 470, y: 205 },
  { x: 560, y: 150 },
]

function growthPath(pts: { x: number; y: number }[]) {
  return pts.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`
    const prev = pts[i - 1]!
    const mx = (prev.x + p.x) / 2
    const my = (prev.y + p.y) / 2
    return `${acc} Q ${prev.x} ${prev.y} ${mx} ${my}`
  }, '')
}

const ORBIT_C = 2 * Math.PI * R

function OrbitDiagram({ active }: { active: boolean }) {
  const [tick, setTick] = useState(0)

  useEffect(() => {
    if (!active) return
    const id = setInterval(() => setTick((t) => t + 1), 40)
    return () => clearInterval(id)
  }, [active])

  const particleAngle = active ? ((tick * 1.2) % 360) - 90 : -90
  const particlePos = nodePos(particleAngle)
  const labelR = R + 80

  return (
    <div className="relative w-full aspect-square">
      <svg viewBox="0 0 700 700" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">

        {/* Dashed outer ring */}
        <circle cx={cx} cy={cy} r={R + 45} fill="none" stroke="#0b3b32" strokeOpacity="0.06" strokeWidth="1" strokeDasharray="4 8" />

        {/* Orbit ring */}
        <circle cx={cx} cy={cy} r={R} fill="none" stroke="#0b3b32" strokeOpacity="0.1" strokeWidth="1.5" />

        {/* Orbit draw-in */}
        {active && (
          <motion.circle
            cx={cx} cy={cy} r={R}
            fill="none"
            stroke="#E8341A"
            strokeWidth="2"
            strokeDasharray={`${ORBIT_C}`}
            initial={{ strokeDashoffset: ORBIT_C }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 2.5, ease: 'easeOut' }}
            opacity={0.3}
          />
        )}

        {/* Growth trajectory */}
        {active && (
          <motion.path
            d={growthPath(growthPoints)}
            fill="none"
            stroke="#E8341A"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="700"
            initial={{ strokeDashoffset: 700 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 2.2, delay: 0.6, ease: 'easeOut' }}
            opacity={0.5}
          />
        )}

        {/* Growth dots */}
        {active && growthPoints.map((p, i) => (
          <motion.circle
            key={i}
            cx={p.x} cy={p.y}
            r={i === growthPoints.length - 1 ? 7 : 4}
            fill={i === growthPoints.length - 1 ? '#E8341A' : '#E8341A'}
            fillOpacity={i === growthPoints.length - 1 ? 1 : 0.45}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.8 + i * 0.12, duration: 0.35, ease: 'backOut' }}
          />
        ))}

        {/* Growth label */}
        {active && (
          <motion.text
            x="565" y="132"
            fontSize="11" fill="#E8341A" fontWeight="700" fontFamily="sans-serif"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.2, duration: 0.5 }}
          >
            crescimento
          </motion.text>
        )}

        {/* Pulsing ring around center */}
        {active && (
          <motion.circle
            cx={cx} cy={cy} r={52}
            fill="none"
            stroke="#E878D8"
            strokeWidth="1"
            animate={{ r: [52, 72], opacity: [0.4, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
          />
        )}

        {/* Center circle (bg for logo) */}
        <circle cx={cx} cy={cy} r={52} fill="#0b3b32" />

        {/* Phase nodes */}
        {phases.map((phase, i) => {
          const pos = nodePos(phase.angle)
          const lx = cx + labelR * Math.cos(toRad(phase.angle))
          const ly = cy + labelR * Math.sin(toRad(phase.angle))
          const anchor =
            phase.angle === 0   ? 'start'  :
            phase.angle === 180 ? 'end'    : 'middle'

          return (
            <g key={i}>
              {/* Connector */}
              <line
                x1={cx + (R - r - 2) * Math.cos(toRad(phase.angle))}
                y1={cy + (R - r - 2) * Math.sin(toRad(phase.angle))}
                x2={cx + (R + r + 2) * Math.cos(toRad(phase.angle))}
                y2={cy + (R + r + 2) * Math.sin(toRad(phase.angle))}
                stroke={phase.color}
                strokeWidth="1"
                strokeDasharray="3 4"
                opacity={0.35}
              />

              {/* Node */}
              {active ? (
                <motion.circle
                  cx={pos.x} cy={pos.y} r={r}
                  fill={phase.color}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 + i * 0.2, duration: 0.5, ease: 'backOut' }}
                />
              ) : (
                <circle cx={pos.x} cy={pos.y} r={r} fill={phase.color} opacity={0} />
              )}

              {/* Number */}
              {active && (
                <motion.text
                  x={pos.x} y={pos.y + 1}
                  textAnchor="middle" dominantBaseline="middle"
                  fontSize="14" fontWeight="800" fill={phase.textColor} fontFamily="sans-serif"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 + i * 0.2 }}
                >
                  {phase.number}
                </motion.text>
              )}

              {/* Label */}
              {active && (
                <motion.g
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 + i * 0.2, duration: 0.4 }}
                >
                  <text
                    x={lx} y={ly - 7}
                    textAnchor={anchor} dominantBaseline="middle"
                    fontSize="12" fontWeight="700" fill="#0b3b32" fontFamily="sans-serif"
                  >
                    {phase.label}
                  </text>
                  <text
                    x={lx} y={ly + 10}
                    textAnchor={anchor} dominantBaseline="middle"
                    fontSize="10" fill="#0b3b32" fillOpacity="0.45" fontFamily="sans-serif"
                  >
                    {phase.sub}
                  </text>
                </motion.g>
              )}
            </g>
          )
        })}

        {/* Traveling particle */}
        {active && (
          <circle cx={particlePos.x} cy={particlePos.y} r={6} fill="#E8341A" opacity={0.85} />
        )}
      </svg>

      {/* Logo overlay — centered over the dark circle */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '13%', height: '13%',
        }}
      >
        <img
          src="/logo-simbolo.svg"
          alt="mb"
          className="w-full h-full object-contain brightness-0 invert opacity-70"
        />
      </div>
    </div>
  )
}

/* ─── Section ──────────────────────────────────────────────────── */

const steps = [
  {
    number: '01',
    title: 'diagnóstico',
    subtitle: 'de onde você vem',
    description:
      'uma conversa profunda sobre sua história com o dinheiro, seus medos, suas conquistas. sem julgamentos — só escuta.',
    color: '#E8341A',
  },
  {
    number: '02',
    title: 'mapeamento',
    subtitle: 'sua realidade',
    description:
      'organizamos juntos entradas, saídas, dívidas e sonhos. clareza onde havia névoa — ferramentas simples e visuais.',
    color: '#1A3CF5',
  },
  {
    number: '03',
    title: 'estratégia',
    subtitle: 'seu caminho',
    description:
      'um plano personalizado com metas realistas, prioridades claras e estratégias que fazem sentido pra sua vida.',
    color: '#E878D8',
  },
  {
    number: '04',
    title: 'acompanhamento',
    subtitle: 'você não está só',
    description:
      'revisões periódicas, ajustes quando necessário, celebração de conquistas. a jornada nunca termina.',
    color: '#0b3b32',
  },
]

export function MethodologySection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const diagramRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(diagramRef, { once: true, margin: '-100px' })

  return (
    <section id="metodologia" ref={sectionRef} className="py-28 bg-linen overflow-hidden">
      <div className="px-6 md:px-16 lg:px-24">

        {/* Header */}
        <motion.div
          className="mb-20 max-w-2xl"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-xs font-semibold tracking-widest text-coral/70 lowercase mb-4">metodologia</p>
          <h2 className="font-sans text-4xl md:text-5xl font-bold text-teal leading-tight">
            como funciona
            <br />
            <em className="italic text-coral">o processo</em>
          </h2>
          <p className="mt-5 text-teal/55 text-base leading-relaxed lowercase max-w-lg">
            não é uma linha reta. é um ciclo vivo — que se adapta, cresce e evolui com você.
          </p>
        </motion.div>

        {/* Two-column */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

          {/* Left — steps, clean, no BG, no line */}
          <div className="space-y-10">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                className="flex gap-7 items-start"
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.55, delay: i * 0.1, ease: 'easeOut' }}
              >
                <span
                  className="text-5xl font-black leading-none flex-shrink-0 tabular-nums"
                  style={{ color: step.color }}
                >
                  {step.number}
                </span>
                <div className="pt-1">
                  <p className="text-xs font-semibold tracking-widest lowercase mb-1.5" style={{ color: step.color }}>
                    {step.subtitle}
                  </p>
                  <h3 className="font-sans text-xl font-bold text-teal lowercase mb-2">{step.title}</h3>
                  <p className="text-teal/50 text-sm leading-relaxed lowercase">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right — orbit diagram */}
          <motion.div
            ref={diagramRef}
            className="relative"
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            {/* Header bar */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-teal/35 lowercase tracking-widest">ciclo estratégico</span>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-coral animate-pulse" />
                <span className="text-xs text-coral font-semibold">ao vivo</span>
              </div>
            </div>

            <OrbitDiagram active={isInView} />

            {/* Legend */}
            <div className="flex flex-wrap gap-4 mt-4 justify-center">
              {phases.map((p) => (
                <div key={p.label} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                  <span className="text-xs text-teal/55 lowercase">{p.label}</span>
                </div>
              ))}
              <div className="flex items-center gap-1.5">
                <span className="w-6 h-0.5 rounded" style={{ backgroundColor: '#E8341A', opacity: 0.5 }} />
                <span className="text-xs text-teal/55 lowercase">crescimento</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom quote */}
        <motion.blockquote
          className="mt-24 pt-12 border-t border-teal/10 text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="font-sans text-2xl md:text-3xl text-teal/80 italic leading-relaxed max-w-3xl mx-auto">
            "finanças saudáveis não são sobre perfeição. são sobre consciência, consistência e compaixão consigo mesma."
          </p>
          <cite className="mt-4 block text-sm text-teal/35 not-italic lowercase">— marcelle breciani</cite>
        </motion.blockquote>
      </div>
    </section>
  )
}
