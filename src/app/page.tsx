'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Image from 'next/image';

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
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-4">
          <Image 
            src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/efbf29c7-542a-4c64-b643-65db71ff94fa.jpg"
            alt="Capirun Logo"
            width={96}
            height={96}
            className="rounded-full object-cover"
            priority
            unoptimized
          />
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">Capirun</h1>
        <p className="text-emerald-300">Carregando...</p>
      </div>
    </div>
  );
}
