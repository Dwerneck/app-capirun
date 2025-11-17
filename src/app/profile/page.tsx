'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, User, Mail, Calendar, Weight, Ruler, Coins, Save } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const router = useRouter();
  const { user, updateUser, isLoading } = useAuth();

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
    
    if (user) {
      setName(user.name);
      setAge(user.age?.toString() || '');
      setWeight(user.weight?.toString() || '');
      setHeight(user.height?.toString() || '');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-950 via-black to-emerald-900">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  const handleSave = () => {
    updateUser({
      name,
      age: age ? parseInt(age) : undefined,
      weight: weight ? parseFloat(weight) : undefined,
      height: height ? parseFloat(height) : undefined,
    });
    
    alert('Perfil atualizado com sucesso!');
  };

  const daysRemaining = user.subscriptionExpiresAt
    ? Math.ceil((new Date(user.subscriptionExpiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-black to-emerald-900">
      {/* Header */}
      <header className="bg-black/50 border-b border-emerald-800 p-4">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="text-emerald-400 hover:text-emerald-300">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-white">Meu Perfil</h1>
            <p className="text-xs text-emerald-400">Gerencie suas informações</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Avatar e Saldo */}
        <Card className="bg-gradient-to-r from-emerald-600 to-emerald-800 border-none">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-emerald-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-1">{user.name}</h2>
                <p className="text-emerald-100 text-sm">{user.email}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 justify-end mb-1">
                  <Coins className="w-6 h-6 text-yellow-400" />
                  <span className="text-3xl font-bold text-white">{user.coins}</span>
                </div>
                <p className="text-emerald-100 text-xs">capicoins</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status da Assinatura */}
        <Card className="bg-black/50 border-emerald-800">
          <CardHeader>
            <CardTitle className="text-white">Status da Assinatura</CardTitle>
            <CardDescription className="text-emerald-300">
              {user.subscriptionStatus === 'free' ? 'Período de teste' : 'Plano ativo'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-emerald-950/50 p-4 rounded-lg">
              <p className="text-emerald-400 text-sm mb-2">
                {user.subscriptionStatus === 'free' && `${daysRemaining} dias restantes no período gratuito`}
                {user.subscriptionStatus === 'monthly' && 'Plano Mensal Ativo'}
                {user.subscriptionStatus === 'annual' && 'Plano Anual Ativo'}
              </p>
              {user.subscriptionStatus === 'free' && daysRemaining < 7 && (
                <Link href="/subscription">
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold mt-2">
                    Assinar Agora
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Dados Pessoais */}
        <Card className="bg-black/50 border-emerald-800">
          <CardHeader>
            <CardTitle className="text-white">Dados Pessoais</CardTitle>
            <CardDescription className="text-emerald-300">
              Usados para cálculo preciso de calorias
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-400" />
                Nome
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-emerald-950/50 border-emerald-800 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400" />
                Email
              </Label>
              <Input
                id="email"
                value={user.email}
                disabled
                className="bg-emerald-950/50 border-emerald-800 text-white opacity-50"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age" className="text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  Idade
                </Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="25"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="bg-emerald-950/50 border-emerald-800 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight" className="text-white flex items-center gap-2">
                  <Weight className="w-4 h-4 text-emerald-400" />
                  Peso (kg)
                </Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="70"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="bg-emerald-950/50 border-emerald-800 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="height" className="text-white flex items-center gap-2">
                  <Ruler className="w-4 h-4 text-emerald-400" />
                  Altura (cm)
                </Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="175"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="bg-emerald-950/50 border-emerald-800 text-white"
                />
              </div>
            </div>

            <Button
              onClick={handleSave}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
            >
              <Save className="w-4 h-4 mr-2" />
              Salvar Alterações
            </Button>
          </CardContent>
        </Card>

        {/* Informação */}
        <Card className="bg-black/50 border-emerald-800">
          <CardContent className="p-4">
            <p className="text-emerald-300 text-sm text-center">
              💡 Seus dados são usados apenas para cálculos de calorias e ficam salvos localmente no seu dispositivo
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
