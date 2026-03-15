import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Leaf, Heart, Globe, Award, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'About Lanka Products - Our Story',
  description:
    'Learn about Lanka Products — how we bring authentic Sri Lankan products to homes worldwide, supporting local artisans and preserving cultural heritage.',
}

const team = [
  {
    name: 'Priya Wickramasinghe',
    role: 'Founder & CEO',
    bio: 'Born in Colombo, raised in the UK. Priya founded Lanka Products after struggling to find authentic Ceylon spices abroad.',
    emoji: '👩🏽‍💼',
  },
  {
    name: 'Chaminda Perera',
    role: 'Head of Sourcing',
    bio: '20 years experience in Sri Lankan agriculture. Chaminda personally visits every farm and artisan workshop.',
    emoji: '👨🏽‍🌾',
  },
  {
    name: 'Amara Dias',
    role: 'Artisan Relations',
    bio: 'Former craft teacher turned advocate. Amara works directly with over 150 artisan families across Sri Lanka.',
    emoji: '🎨',
  },
]

const values = [
  {
    icon: Leaf,
    title: 'Authenticity',
    description: 'Every product is verified for authenticity. We test, trace, and certify all our offerings.',
  },
  {
    icon: Heart,
    title: 'Fair Trade',
    description: 'We pay fair prices directly to farmers and artisans, ensuring communities thrive.',
  },
  {
    icon: Globe,
    title: 'Sustainability',
    description: 'Organic farming, natural materials, recyclable packaging — sustainability is not optional.',
  },
  {
    icon: Award,
    title: 'Quality',
    description: 'Only the best makes it to your door. Our quality standards are uncompromising.',
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-ceylon-gradient py-20 md:py-28">
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full border border-white"
              style={{
                width: `${50 + (i % 4) * 40}px`,
                height: `${50 + (i % 4) * 40}px`,
                left: `${(i * 137.5) % 100}%`,
                top: `${(i * 89.3) % 100}%`,
                transform: 'translate(-50%, -50%)',
              }}
            />
          ))}
        </div>
        <div className="container mx-auto px-4 relative text-center text-white">
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">Our Story</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Connecting the world to the authentic heart of Sri Lanka — one product at a time.
          </p>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 bg-cream">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-tea font-semibold text-sm uppercase tracking-wider mb-4">Our Mission</p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-charcoal mb-6">
              To Preserve, Celebrate, and Share Sri Lankan Heritage
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              Lanka Products was founded on a simple belief: the world deserves to experience the
              real Sri Lanka. Not the tourist version — but the authentic flavors, crafts, and stories
              that Sri Lankans have carried through generations.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              We work directly with over 200 farming families and artisan workshops across the island.
              Every purchase you make supports a real person, preserves a traditional skill, and brings
              a piece of Ceylon into your home.
            </p>
          </div>
        </div>
      </section>

      {/* Cultural Authenticity */}
      <section id="artisans" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-tea font-semibold text-sm uppercase tracking-wider mb-3">Cultural Authenticity</p>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-charcoal mb-4">
                2,500 Years of Craft & Tradition
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Sri Lanka has been the crossroads of ancient trade routes for millennia. The island
                attracted Arab spice traders, Portuguese explorers, Dutch merchants, and British colonists
                — all drawn by the extraordinary quality of its products.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Our artisans are the guardians of this heritage. From the Kandyan wood carvers to the
                Moratuwa lacquerware painters, from the cinnamon rollers of Negombo to the batik artists
                of Ambalangoda — we document and celebrate their stories alongside their creations.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { number: '200+', label: 'Partner Families' },
                  { number: '15+', label: 'Craft Traditions' },
                  { number: '100%', label: 'Authenticity Rate' },
                  { number: '5', label: 'Export Countries' },
                ].map((stat) => (
                  <div key={stat.label} className="bg-cream rounded-xl p-4">
                    <p className="text-3xl font-serif font-bold text-cinnamon">{stat.number}</p>
                    <p className="text-muted-foreground text-sm mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-cinnamon/10 to-tea/10 rounded-3xl p-8 text-center">
              <div className="text-8xl mb-4">🌿</div>
              <h3 className="text-2xl font-serif font-bold text-charcoal mb-3">
                The Spice Garden of the World
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Marco Polo called Ceylon &ldquo;better stocked with spice than any other country.&rdquo;
                The Roman historian Pliny wrote of its legendary cinnamon. Today, we bring that same
                exceptional quality directly to your kitchen.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-cream">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="section-heading">Our Values</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <div key={value.title} className="bg-white rounded-2xl p-6 border border-border">
                <div className="w-12 h-12 rounded-2xl bg-cinnamon/10 flex items-center justify-center mb-4">
                  <value.icon className="h-6 w-6 text-cinnamon" />
                </div>
                <h3 className="font-bold text-charcoal text-lg mb-2">{value.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-tea font-semibold text-sm uppercase tracking-wider mb-3">The People Behind Lanka Products</p>
            <h2 className="section-heading">Meet Our Team</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {team.map((member) => (
              <div key={member.name} className="text-center">
                <div className="w-24 h-24 rounded-full bg-cream flex items-center justify-center mx-auto mb-4 text-5xl border-4 border-white shadow-lg">
                  {member.emoji}
                </div>
                <h3 className="font-bold text-charcoal text-lg">{member.name}</h3>
                <p className="text-cinnamon font-medium text-sm mb-3">{member.role}</p>
                <p className="text-muted-foreground text-sm leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sustainability */}
      <section id="sustainability" className="py-16 bg-tea text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-tea-light text-sm font-semibold uppercase tracking-wider mb-4">Our Commitment</p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
              Sustainability at Our Core
            </h2>
            <p className="text-white/80 text-lg leading-relaxed mb-8">
              Sri Lanka&apos;s ecosystems are extraordinarily precious. From the cloud forests of
              Horton Plains to the coastal mangroves — we believe commerce must protect, not destroy.
            </p>
            <div className="grid md:grid-cols-3 gap-6 text-left mb-10">
              {[
                {
                  title: 'Organic Farming',
                  description: 'All our spices are grown without synthetic pesticides or fertilizers.',
                  icon: '🌱',
                },
                {
                  title: 'Eco Packaging',
                  description: '100% recyclable boxes, biodegradable inner packaging, minimal plastic.',
                  icon: '♻️',
                },
                {
                  title: 'Carbon Offset',
                  description: 'We offset 120% of our shipping emissions through Sri Lankan reforestation.',
                  icon: '🌍',
                },
              ].map((item) => (
                <div key={item.title} className="bg-white/10 rounded-xl p-5">
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <h3 className="font-bold mb-2">{item.title}</h3>
                  <p className="text-white/70 text-sm">{item.description}</p>
                </div>
              ))}
            </div>
            <Link href="/shop">
              <Button className="bg-white text-tea hover:bg-cream font-bold" size="lg">
                Shop Responsibly
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
