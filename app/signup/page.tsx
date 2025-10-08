'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function SignupPage() {
    if (process.env.ALLOW_SIGNUP !== "true") {
    return (
      <div className="p-6 text-sm text-muted-foreground">
        Public signups are disabled. Contact your administrator.
      </div>
    );
  }
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name })
    });
    const data = await res.json();
    if (!res.ok) {
      setLoading(false);
      setError(data.error || 'Signup failed');
      return;
    }
    // auto login
    await signIn('credentials', { email, password, redirect: false });
    router.push('/dashboard');
  }

  return (
    <div className="max-w-sm mx-auto mt-20 p-6 bg-white rounded shadow">
      <h1 className="text-xl font-semibold mb-4">Create account</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Name</label>
          <Input value={name} onChange={e=>setName(e.target.value)} className="input" required />
        </div>
        <div>
          <label className="block text-sm mb-1">Email</label>
          <Input type="email" value={email} onChange={e=>setEmail(e.target.value)} className="input" required/>
        </div>
        <div>
          <label className="block text-sm mb-1">Password</label>
          <Input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="input" required/>
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <Button disabled={loading} className="btn-primary w-full">{loading? 'Creating…':'Sign up'}</Button>
      </form>
      <p className="text-sm mt-4 text-center">Already have an account? <a href="/login" className="underline">Log in</a></p>
    </div>
  );
}