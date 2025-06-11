'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { auth } from '@/lib/firebase'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'

// Define the form schema with zod
const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  name: z.string().optional(),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function UserLogin() {
  const { toast } = useToast()
  const [isSignUp, setIsSignUp] = useState(false)
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      name: '',
    },
  })

  const onSubmit = async (data: LoginFormValues) => {
    try {
      if (isSignUp) {
        // Sign up with email and password
        await createUserWithEmailAndPassword(auth, data.email, data.password)
        toast({
          title: 'Sign Up Successful',
          description: 'Welcome to ClipHub! Let’s set up your preferences.',
          className: 'bg-green-500 text-white',
        })
      } else {
        // Sign in with email and password
        await signInWithEmailAndPassword(auth, data.email, data.password)
        toast({
          title: 'Login Successful',
          description: 'Welcome back to ClipHub!',
          className: 'bg-green-500 text-white',
        })
      }
    } catch (error: any) {
      toast({
        title: isSignUp ? 'Sign Up Failed' : 'Login Failed',
        description: error.message || 'An error occurred. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
      toast({
        title: 'Login Successful',
        description: 'Welcome to ClipHub!',
        className: 'bg-green-500 text-white',
      })
    } catch (error: any) {
      toast({
        title: 'Google Sign-In Failed',
        description: error.message || 'An error occurred. Please try again.',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">{isSignUp ? 'Sign Up' : 'Log In'}</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {isSignUp && (
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
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
            <Button type="submit" className="w-full bg-blue-600 text-white hover:bg-blue-700 transition">
              {isSignUp ? 'Sign Up' : 'Log In'}
            </Button>
          </form>
        </Form>
        <Button
          variant="outline"
          className="w-full mt-4"
          onClick={handleGoogleSignIn}
        >
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.51h5.84c-.25 1.37-.81 2.54-1.72 3.32v2.76h2.79c1.63-1.5 2.57-3.71 2.57-6.34z"
              fill="#4285F4"
            />
            <path
              d="M12 23c3.09 0 5.68-1.03 7.57-2.77l-2.79-2.76c-.85.57-1.94.91-3.78.91-2.91 0-5.37-1.96-6.25-4.59H4.08v2.89C6.05 20.07 8.86 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.75 14.24c-.22-.66-.35-1.36-.35-2.24s.13-1.58.35-2.24V6.87H4.08C3.4 8.24 3 9.83 3 11.5s.4 3.26 1.08 4.63l1.67-1.89z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.09c1.65 0 3.13.57 4.3 1.68l3.22-3.22C17.65 1.97 15.06 1 12 1 8.86 1 6.05 3.93 4.08 7.37l1.67 1.89C6.63 6.64 9.09 5.09 12 5.09z"
              fill="#EA4335"
            />
          </svg>
          Sign in with Google
        </Button>
        <p className="text-center text-sm text-gray-600 mt-4">
          {isSignUp ? 'Already have an account?' : 'New to ClipHub?'}{' '}
          <button
            type="button"
            className="text-blue-600 hover:underline"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? 'Log In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  )
}