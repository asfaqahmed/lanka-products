import Link from 'next/link'
import { Leaf, Users, Globe, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

const pillars = [
  {
    icon: Leaf,
    title: 'Our Story',
    subtitle: 'Rooted in Tradition',
    description:
      'Lanka Products was born from a deep love for Sri Lankan culture and a desire to share its richness with the world. We partner directly with farmers, artisans, and heritage keepers across the island.',
    color: 'bg-cinnamon/10',
    iconColor: 'text-cinnamon bg-cinnamon/20',
    accent: '#7B3F00',
  },
  {
    icon: Users,
    title: 'Artisan Craftsmanship',
    subtitle: 'Skills Passed Through Generations',
    description:
      'Every product in our collection is made by skilled Sri Lankan artisans who have inherited their craft through generations. By choosing Lanka Products, you support over 200 local families.',
    color: 'bg-tea/10',
    iconColor: 'text-tea bg-tea/20',
    accent: '#4A7C59',
  },
  {
    icon: Globe,
    title: 'Sustainable Sourcing',
    subtitle: 'Good for the Earth',
    description:
      'We are committed to ethical and sustainable sourcing practices. Our spices are organically grown, our handicrafts use locally-sourced natural materials, and our packaging is 100% recyclable.',
    color: 'bg-gold/10',
    iconColor: 'text-gold-dark bg-gold/20',
    accent: '#C9A84C',
  },
]

export function CulturalStorySection() {
  return (
    <section className="py-16 md:py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-tea font-semibold text-sm uppercase tracking-wider mb-3">
            Our Heritage
          </p>
          <h2 className="section-heading">From the Gardens of Ceylon</h2>
          <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
            For centuries, Sri Lanka — ancient Ceylon — has been celebrated as the spice garden
            of the world. We honor that legacy in every product we deliver.
          </p>
        </div>

        {/* Three Pillars */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {pillars.map((pillar) => {
            const Icon = pillar.icon
            return (
              <div
                key={pillar.title}
                className={`${pillar.color} rounded-2xl p-8 hover:shadow-lg transition-shadow`}
              >
                <div className={`w-14 h-14 rounded-2xl ${pillar.iconColor} flex items-center justify-center mb-6`}>
                  <Icon className="h-7 w-7" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  {pillar.subtitle}
                </p>
                <h3 className="text-xl font-serif font-bold text-charcoal mb-4">
                  {pillar.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {pillar.description}
                </p>
              </div>
            )
          })}
        </div>

        {/* Featured Story Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-ceylon-gradient p-8 md:p-12">
          <div className="absolute inset-0 opacity-10">
            {Array.from({ length: 15 }).map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full border border-white"
                style={{
                  width: `${40 + (i % 4) * 30}px`,
                  height: `${40 + (i % 4) * 30}px`,
                  left: `${(i * 137.5) % 100}%`,
                  top: `${(i * 89.3) % 100}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              />
            ))}
          </div>

          <div className="relative grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-gold font-semibold text-sm uppercase tracking-wider mb-3">
                The Ceylon Difference
              </p>
              <h3 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
                True Ceylon Cinnamon —<br />Not What You Think
              </h3>
              <p className="text-white/80 leading-relaxed mb-6">
                Did you know that most &ldquo;cinnamon&rdquo; sold worldwide is actually Cassia? True Ceylon
                cinnamon, grown only in Sri Lanka, has a delicate, sweet flavor and is significantly
                healthier. Our farmers harvest it by hand, roll it into quills, and ship it directly to you.
              </p>
              <Link href="/shop?category=spices">
                <Button className="bg-gold hover:bg-gold-dark text-charcoal font-bold">
                  Explore Ceylon Spices
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { emoji: '🌿', label: 'True Ceylon', subtext: 'Cinnamomum verum' },
                { emoji: '🫚', label: 'Hand-Rolled', subtext: 'Traditional method' },
                { emoji: '✅', label: 'Lab Certified', subtext: 'Authenticity guaranteed' },
                { emoji: '🌏', label: 'Direct Trade', subtext: 'Fair farmer prices' },
              ].map((fact) => (
                <div
                  key={fact.label}
                  className="bg-white/15 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20"
                >
                  <div className="text-3xl mb-2">{fact.emoji}</div>
                  <p className="text-white font-semibold text-sm">{fact.label}</p>
                  <p className="text-white/60 text-xs mt-0.5">{fact.subtext}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
