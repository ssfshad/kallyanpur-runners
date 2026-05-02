import FadeIn from './FadeIn'

interface SectionHeaderProps {
  eyebrow?: string
  title: string
  subtitle?: string
  centered?: boolean
}

export default function SectionHeader({ eyebrow, title, subtitle, centered = true }: SectionHeaderProps) {
  return (
    <FadeIn className={`mb-10 md:mb-14 ${centered ? 'text-center' : ''}`}>
      {eyebrow && (
        <span className="inline-block text-brand-gold font-heading tracking-[0.3em] text-sm mb-2">
          {eyebrow}
        </span>
      )}
      <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl text-white leading-none">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-white/60 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
      <div className={`mt-4 h-0.5 w-16 bg-brand-gold ${centered ? 'mx-auto' : ''}`} />
    </FadeIn>
  )
}
