'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const links = [
  { href: '#servicos', label: 'serviços' },
  { href: '#metodologia', label: 'metodologia' },
  { href: '#depoimentos', label: 'depoimentos' },
  { href: '#faq', label: 'faq' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-sage/95 backdrop-blur-md border-b border-border/40' : 'bg-transparent'
      }`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="px-6 md:px-16 lg:px-24 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center group">
          <img src="/logo-assinatura-v2.svg" alt="marcelle breciani" className="h-6 w-auto opacity-90 group-hover:opacity-100 transition-opacity" />
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-teal/60 hover:text-teal transition-colors duration-200 px-4 py-2 rounded-full hover:bg-teal/5"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <a
          href="#contato"
          className="hidden md:inline-flex items-center px-5 py-2.5 rounded-full bg-coral text-white text-sm font-semibold hover:bg-coral/85 transition-colors duration-200"
        >
          começar →
        </a>

        {/* Mobile burger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          <span className={`block w-5 h-0.5 bg-teal transition-all ${open ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-5 h-0.5 bg-teal transition-all ${open ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-0.5 bg-teal transition-all ${open ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <motion.div
          className="md:hidden bg-sage border-b border-border px-6 py-6 flex flex-col gap-3"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-teal text-lg font-medium lowercase py-1"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contato"
            onClick={() => setOpen(false)}
            className="mt-3 inline-flex items-center justify-center px-5 py-3 rounded-full bg-coral text-white text-sm font-semibold"
          >
            começar →
          </a>
        </motion.div>
      )}
    </motion.header>
  )
}
