'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/hooks/use-toast'

// Define the form schema with zod
const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  preferences: z.array(z.string()).min(1, { message: 'Please select at least one preference' }),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function UserLogin() {
  const { toast } = useToast()
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      preferences: [],
    },
  })

  const onSubmit = async (data: LoginFormValues) => {
    try {
      // Mock API call - replace with your actual backend endpoint
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error('Login failed')

      // Store preferences in localStorage for simplicity
      localStorage.setItem('userPreferences', JSON.stringify(data.preferences))
      toast({
        title: 'Login Successful',
        description: 'Welcome back! Enjoy personalized content.',
        className: 'bg-green-500 text-white',
      })
      // Redirect to home page or dashboard after login
      window.location.href = '/'
    } catch (error) {
      toast({
        title: 'Login Failed',
        description: 'Invalid email or password. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const preferences = [
    { id: 'photos', label: 'Photos' },
    { id: 'videos', label: 'Videos' },
    { id: 'music', label: 'Music' },
    { id: 'collections', label: 'Collections' },
  ]

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">User Login</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="you@example.com" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="••••••" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="preferences"
              render={() => (
                <FormItem>
                  <FormLabel>Content Preferences</FormLabel>
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
            <Button type="submit" className="w-full bg-blue-600 text-white hover:bg-blue-700 transition">
              Log In
            </Button>
          </form>
        </Form>
        <p className="text-center text-sm text-gray-600 mt-4">
          New to ClipHub?{' '}
          <a href="/join" className="text-blue-600 hover:underline">
            Join as a creator
          </a>
        </p>
      </div>
    </div>
  )
}