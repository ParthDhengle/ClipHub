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

const preferencesSchema = z.object({
  preferences: z.array(z.string()).optional(),
})

type PreferencesFormValues = z.infer<typeof preferencesSchema>

interface PreferencesProps {
  onNext: () => void
  onBack: () => void
}

export function Preferences({ onNext, onBack }: PreferencesProps) {
  const { toast } = useToast()
  const form = useForm<PreferencesFormValues>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      preferences: [],
    },
  })

  const preferences = [
    { id: 'short-clips', label: 'Short Clips' },
    { id: 'tutorials', label: 'Tutorials' },
    { id: 'live-streams', label: 'Live Streams' },
    { id: 'behind-the-scenes', label: 'Behind the Scenes' },
  ]

  const onSubmit = (data: PreferencesFormValues) => {
    saveUserInterests(data.preferences || [])
    toast({
      title: 'Preferences Saved',
      description: 'Your preferences have been saved successfully.',
      className: 'bg-green-500 text-white',
    })
    onNext()
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Select Content Preferences (Optional)</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="preferences"
              render={() => (
                <FormItem>
                  <FormLabel>Choose content types you prefer</FormLabel>
                  <div className="grid grid-cols-2 gap-4">
                    {preferences.map((item) => (
                      <div key={item.id} className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={form.watch('preferences').includes(item.id)}
                            onCheckedChange={(checked) => {
                              const current = form.getValues('preferences')
                              form.setValue(
                                'preferences',
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
            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={onBack}>
                Back
              </Button>
              <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">
                Finish
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}