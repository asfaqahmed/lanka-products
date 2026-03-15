import dynamic from 'next/dynamic'

const CheckoutClient = dynamic(() => import('./CheckoutClient'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#7B3F00] border-t-transparent" />
    </div>
  ),
})

export default function CheckoutPage() {
  return <CheckoutClient />
}
