'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { loginUser } from '@/lib/auth';
import { Form, FormField, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const form = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginFormValues) {
    setError(null);
    try {
      await loginUser(values);
      router.push('/profile');
    } catch (err) {
      setError((err as Error).message || 'Login failed');
    }
  }

  return (
    <main className="page-container">
      <section className="card">
        <h1>Login</h1>
        <Form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField>
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input id="email" type="email" {...form.register('email')} />
            {form.formState.errors.email && <p className="error-text">{form.formState.errors.email.message}</p>}
          </FormField>
          <FormField>
            <FormLabel htmlFor="password">Password</FormLabel>
            <Input id="password" type="password" {...form.register('password')} />
            {form.formState.errors.password && <p className="error-text">{form.formState.errors.password.message}</p>}
          </FormField>
          {error && <p className="error-text">{error}</p>}
          <Button type="submit">Login</Button>
        </Form>
      </section>
    </main>
  );
}
