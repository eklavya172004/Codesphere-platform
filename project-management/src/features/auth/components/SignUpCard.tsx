'use client'
import { DottedSeparator } from '@/components/dotted-separator'
import { Button } from '@/components/ui/button'
import {FcGoogle} from 'react-icons/fc'
import {FaGithub} from 'react-icons/fa'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import React from 'react'
import Link from 'next/link'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useForm } from 'react-hook-form'

const formSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters long')
})

const SignUpCard = () => {
   const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        name:'',
        email: '',
        password: ''
      },
    })
  
    const onSubmit = (values:z.infer<typeof formSchema>) => {
      console.log('Form submitted:', values);
      // Handle form submission logic here, e.g., API call for login
    }

  return (
    <Card className='w-full bg-neutral-900 h-full md:w-[487px] border-none shadow-none'>
      <CardHeader className=' flex-col  rounded-2xl items-center justify-center text-center p-7'>
        <CardTitle className='text-2xl'>
               Sign Up
        </CardTitle>

      <CardDescription>
          By signing up, you agree to our  <Link href="/terms"> <span className='text-blue-500'></span>Terms of Service</Link> and <Link href="/privacy" className='text-blue-500'>Privacy Policy</Link>.
      </CardDescription>

      </CardHeader>
        <div className='px-7 -mt-2'>
            <DottedSeparator/>
        </div>

        <CardContent className='p-7'>
           <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          {/* name */}

                      <FormField 
                          name="name"
                          control={form.control}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
          
                            <Input
                            type="text"
                            placeholder='Enter your name'
                            {...field}
                            />
                            </FormControl>
                            <FormMessage/>
                            </FormItem>
                          )}
                      />

            <FormField 
                          name="email"
                          control={form.control}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
          
                            <Input
                            type="email"
                            placeholder='Enter your email address'
                            {...field}
                            />
                            </FormControl>
                            <FormMessage/>
                            </FormItem>
                          )}
                      />

                    <FormField 
                          name="password"
                          control={form.control}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
          
                            <Input
                            type="password"
                            placeholder='Enter your password'
                            {...field}
                            />
                            </FormControl>
                            <FormMessage/>
                            </FormItem>
                          )}
                      />
            <Button disabled={false} size="lg" className='w-full'>
              Login
            </Button> 
          </form>
          </Form>
        </CardContent>
    
          <div className='px-7'>
            <DottedSeparator/>
          </div>

          <CardContent className='p-7 flex flex-col gap-y-4 '>
            <Button variant="secondary" size="lg" className='w-full' disabled={false}><FaGithub/> Login with Github</Button>
             <Button variant="secondary" size="lg" className='w-full' disabled={false}><FcGoogle/> Login with Google</Button>
          </CardContent>
                        
                    <div className='px-7'>
                      <DottedSeparator/>
                    </div>

          <CardContent className='p-7 items-center justify-center '>
            <p className='text-sm text-center text-muted-foreground'>
              Already have an account?
              <Link href="/sign-in" className='text-left text-blue-700 '> Sign In</Link>
            </p>
          </CardContent>
    </Card>
    
  )
}

export default SignUpCard
