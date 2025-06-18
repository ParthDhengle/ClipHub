'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/hooks/use-toast'
import { saveUserInterests } from '@/lib/utils'
import { useRouter } from 'next/navigation'

const interestSchema = z.object({
  interests: z.array(z.string()).min(1, { message: 'Please select at least one interest' }),
})

type InterestFormValues = z.infer<typeof interestSchema>

interface InterestSelectionProps {
  onNext: () => void
  onBack: () => void
}

export function InterestSelection({ onNext, onBack }: InterestSelectionProps) {
  const { toast } = useToast()
  const router = useRouter()
  const form = useForm<InterestFormValues>({
    resolver: zodResolver(interestSchema),
    defaultValues: {
      interests: [],
    },
  })

  const interests = [
    { id: 'music', label: 'Music' },
    { id: 'videos', label: 'Videos' },
    { id: 'art', label: 'Art' },
    { id: 'gaming', label: 'Gaming' },
  ]

  const onSubmit = (data: InterestFormValues) => {
    saveUserInterests(data.interests)
    toast({
      title: 'Interests Saved',
      description: 'Your interests have been saved successfully.',
      className: 'bg-green-500 text-white',
    })
    onNext()
  }

  const handleSkip = () => {
    router.push('/')
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Select Your Interests</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="interests"
              render={() => (
                <FormItem>
                  <FormLabel>Choose your interests</FormLabel>
                  <div className="grid grid-cols-2 gap-4">
                    {interests.map((item) => (
                      <div key={item.id} className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={form.watch('interests').includes(item.id)}
                            onCheckedChange={(checked) => {
                              const current = form.getValues('interests')
                              form.setValue(
                                'interests',
                                checked
                                  ? [...current, item.id]
                                  : current.filter((p) => p !== item.id)
                              )
                            }}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">{item.label}</FormLabel>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-between items-center">
              <Button type="button" variant="outline" onClick={onBack}>
                Back
              </Button>
              <Button type="button" variant="ghost" onClick={handleSkip}>
                Skip to Home
              </Button>
              <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">
                Next
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}