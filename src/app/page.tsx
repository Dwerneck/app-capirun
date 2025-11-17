'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export default function HomePage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isLoading) {
      if (user) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }
  }, [user, isLoading, router, mounted]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-950 via-black to-emerald-900">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-emerald-600 rounded-full mb-4 animate-pulse">
          <span className="text-6xl">🦫</span>
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">Capirun</h1>
        <p className="text-emerald-300">Carregando...</p>
      </div>
    </div>
  );
}
