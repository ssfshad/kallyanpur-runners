'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

interface FadeInProps {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
}

export default function FadeIn({ children, className = '', delay = 0, direction = 'up' }: FadeInProps) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })

  const directionMap = {
    up: { y: 30, x: 0 },
    down: { y: -30, x: 0 },
    left: { y: 0, x: 30 },
    right: { y: 0, x: -30 },
    none: { y: 0, x: 0 },
  }

  const initial = { opacity: 0, ...directionMap[direction] }
  const animate = inView ? { opacity: 1, y: 0, x: 0 } : initial

  return (
    <motion.div
      ref={ref}
      initial={initial}
      animate={animate}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
