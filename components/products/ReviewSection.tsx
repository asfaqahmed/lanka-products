'use client'

import { useState } from 'react'
import { Star, User } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { toast } from '@/components/ui/use-toast'
import { cn } from '@/lib/utils'
import type { Review } from '@/lib/supabase/types'

const reviewSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  body: z.string().min(10, 'Review must be at least 10 characters').max(1000),
  rating: z.number().min(1).max(5),
})

type ReviewFormData = z.infer<typeof reviewSchema>

interface ReviewSectionProps {
  productId: string
  reviews: Review[]
}

export function ReviewSection({ productId, reviews }: ReviewSectionProps) {
  const [showForm, setShowForm] = useState(false)
  const [selectedRating, setSelectedRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 0 },
  })

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0

  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    percentage:
      reviews.length > 0
        ? (reviews.filter((r) => r.rating === star).length / reviews.length) * 100
        : 0,
  }))

  const handleRatingClick = (rating: number) => {
    setSelectedRating(rating)
    setValue('rating', rating)
  }

  const onSubmit = async (data: ReviewFormData) => {
    setIsSubmitting(true)

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      toast({
        title: 'Please sign in',
        description: 'You need to be signed in to leave a review.',
        variant: 'destructive',
      })
      setIsSubmitting(false)
      return
    }

    const { error } = await supabase.from('reviews').insert({
      product_id: productId,
      user_id: user.id,
      rating: data.rating,
      title: data.title,
      body: data.body,
      is_approved: false,
    })

    if (error) {
      toast({
        title: 'Error submitting review',
        description: error.message,
        variant: 'destructive',
      })
    } else {
      toast({
        title: 'Review submitted!',
        description: 'Your review is pending approval and will appear shortly.',
      })
      reset()
      setSelectedRating(0)
      setShowForm(false)
    }

    setIsSubmitting(false)
  }

  return (
    <div className="bg-white rounded-2xl border border-border p-6 md:p-8">
      <h2 className="text-2xl font-serif font-bold text-charcoal mb-6">
        Customer Reviews
      </h2>

      {reviews.length > 0 ? (
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Rating Summary */}
          <div className="text-center">
            <div className="text-6xl font-serif font-bold text-cinnamon mb-2">
              {avgRating.toFixed(1)}
            </div>
            <div className="flex justify-center mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(avgRating)
                      ? 'fill-gold text-gold'
                      : 'fill-gray-200 text-gray-200'
                  }`}
                />
              ))}
            </div>
            <p className="text-muted-foreground text-sm">{reviews.length} reviews</p>
          </div>

          {/* Rating Distribution */}
          <div className="md:col-span-2 space-y-2">
            {ratingDistribution.map(({ star, count, percentage }) => (
              <div key={star} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-16">
                  <span className="text-sm text-charcoal">{star}</span>
                  <Star className="h-3.5 w-3.5 fill-gold text-gold" />
                </div>
                <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-gold rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-muted-foreground w-6">{count}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 mb-6">
          <Star className="h-12 w-12 text-gray-200 mx-auto mb-3" />
          <p className="text-muted-foreground">No reviews yet. Be the first!</p>
        </div>
      )}

      {/* Write a Review CTA */}
      {!showForm && (
        <Button
          variant="cinnamon-outline"
          onClick={() => setShowForm(true)}
          className="mb-6"
        >
          Write a Review
        </Button>
      )}

      {/* Review Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-cream rounded-xl p-6 mb-8 border border-border"
        >
          <h3 className="font-semibold text-charcoal mb-4">Write Your Review</h3>

          {/* Star Rating */}
          <div className="mb-4">
            <label className="text-sm font-medium text-charcoal block mb-2">
              Your Rating *
            </label>
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleRatingClick(i + 1)}
                  onMouseEnter={() => setHoveredRating(i + 1)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={cn(
                      'h-8 w-8 transition-colors',
                      i < (hoveredRating || selectedRating)
                        ? 'fill-gold text-gold'
                        : 'fill-gray-200 text-gray-200'
                    )}
                  />
                </button>
              ))}
            </div>
            {errors.rating && (
              <p className="text-red-500 text-xs mt-1">Please select a rating</p>
            )}
          </div>

          {/* Title */}
          <div className="mb-4">
            <label className="text-sm font-medium text-charcoal block mb-2">
              Review Title *
            </label>
            <input
              {...register('title')}
              placeholder="Summarize your experience"
              className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cinnamon/30 focus:border-cinnamon bg-white"
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
            )}
          </div>

          {/* Body */}
          <div className="mb-4">
            <label className="text-sm font-medium text-charcoal block mb-2">
              Your Review *
            </label>
            <textarea
              {...register('body')}
              rows={4}
              placeholder="Share your experience with this product..."
              className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cinnamon/30 focus:border-cinnamon resize-none bg-white"
            />
            {errors.body && (
              <p className="text-red-500 text-xs mt-1">{errors.body.message}</p>
            )}
          </div>

          <div className="flex gap-3">
            <Button type="submit" variant="cinnamon" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => { setShowForm(false); reset(); setSelectedRating(0) }}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      {reviews.length > 0 && (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-border pb-6 last:border-0">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-cinnamon/10 flex items-center justify-center flex-shrink-0">
                  <User className="h-5 w-5 text-cinnamon" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-charcoal text-sm">
                      Verified Customer
                    </span>
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${
                            i < review.rating
                              ? 'fill-gold text-gold'
                              : 'fill-gray-200 text-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(review.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  {review.title && (
                    <h4 className="font-semibold text-charcoal text-sm mt-1">
                      {review.title}
                    </h4>
                  )}
                  {review.body && (
                    <p className="text-muted-foreground text-sm mt-1 leading-relaxed">
                      {review.body}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
