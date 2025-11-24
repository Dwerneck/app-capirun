'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SUBSCRIPTION_PRICES } from '@/lib/constants';
import { ArrowLeft, Check, Zap, Crown, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function SubscriptionPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-950 via-black to-emerald-900">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  const handleSubscribe = (plan: 'monthly' | 'annual') => {
    alert(`Funcionalidade de pagamento será implementada no Módulo 6!\n\nPlano selecionado: ${plan === 'monthly' ? 'Mensal' : 'Anual'}`);
  };

  const features = [
    'Rastreamento GPS ilimitado',
    'Histórico completo de atividades',
    'Sistema de moedas e recompensas',
    'Acesso à Capirun Store',
    'Estatísticas e evolução detalhadas',
    'Compartilhamento social',
    'Suporte prioritário',
    'Sem anúncios',
  ];

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
            <h1 className="text-xl font-bold text-white">Planos Capirun</h1>
            <p className="text-xs text-emerald-400">Escolha o melhor para você</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Status Atual */}
        {user.subscriptionStatus === 'free' && (
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-none">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-white" />
                <div>
                  <h3 className="text-white font-bold text-lg">Período de Teste Ativo</h3>
                  <p className="text-white/90 text-sm">
                    Você tem acesso completo por 30 dias. Aproveite!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Planos */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Plano Mensal */}
          <Card className="bg-black/50 border-emerald-800 hover:border-emerald-600 transition-all hover:scale-105">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <Badge className="bg-emerald-600">Popular</Badge>
                <Zap className="w-6 h-6 text-emerald-400" />
              </div>
              <CardTitle className="text-white text-2xl">Plano Mensal</CardTitle>
              <CardDescription className="text-emerald-300">
                Flexibilidade total, cancele quando quiser
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-white">R$ {SUBSCRIPTION_PRICES.monthly.toFixed(2)}</span>
                  <span className="text-emerald-400">/mês</span>
                </div>
              </div>

              <div className="space-y-3">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-emerald-200 text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <Button
                onClick={() => handleSubscribe('monthly')}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-6 text-lg"
              >
                Assinar Plano Mensal
              </Button>
            </CardContent>
          </Card>

          {/* Plano Anual */}
          <Card className="bg-gradient-to-br from-yellow-600 to-orange-600 border-none relative overflow-hidden">
            <div className="absolute top-4 right-4">
              <Badge className="bg-white text-orange-600 font-bold">
                Economize 22%
              </Badge>
            </div>
            
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-white text-2xl">Plano Anual</CardTitle>
              <CardDescription className="text-white/90">
                Melhor custo-benefício, pague menos por mês
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-5xl font-bold text-white">R$ {SUBSCRIPTION_PRICES.annual.toFixed(2)}</span>
                  <span className="text-white/90">/ano</span>
                </div>
                <p className="text-white/80 text-sm">
                  Equivalente a R$ {(SUBSCRIPTION_PRICES.annual / 12).toFixed(2)}/mês
                </p>
              </div>

              <div className="space-y-3">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-orange-600" />
                    </div>
                    <span className="text-white text-sm font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              <Button
                onClick={() => handleSubscribe('annual')}
                className="w-full bg-white hover:bg-gray-100 text-orange-600 font-bold py-6 text-lg"
              >
                Assinar Plano Anual
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Informações Adicionais */}
        <Card className="bg-black/50 border-emerald-800">
          <CardHeader>
            <CardTitle className="text-white">Informações Importantes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-emerald-200">
            <p className="text-sm">
              💳 <strong>Pagamentos seguros:</strong> Apple Pay, Google Pay e cartão de crédito
            </p>
            <p className="text-sm">
              🔄 <strong>Renovação automática:</strong> Cancele a qualquer momento sem multas
            </p>
            <p className="text-sm">
              🎁 <strong>30 dias grátis:</strong> Teste todas as funcionalidades antes de assinar
            </p>
            <p className="text-sm">
              📱 <strong>Multiplataforma:</strong> Use em iOS e Android com a mesma conta
            </p>
            <p className="text-sm">
              🏆 <strong>Garantia:</strong> 7 dias para reembolso total se não gostar
            </p>
          </CardContent>
        </Card>

        {/* FAQ Rápido */}
        <Card className="bg-black/50 border-emerald-800">
          <CardHeader>
            <CardTitle className="text-white">Perguntas Frequentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-white font-semibold mb-1">Posso cancelar a qualquer momento?</h4>
              <p className="text-emerald-300 text-sm">
                Sim! Não há multas ou taxas de cancelamento. Você mantém acesso até o fim do período pago.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-1">O que acontece após o período gratuito?</h4>
              <p className="text-emerald-300 text-sm">
                Você pode escolher um plano ou continuar usando funcionalidades básicas gratuitamente.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-1">Posso mudar de plano depois?</h4>
              <p className="text-emerald-300 text-sm">
                Sim! Você pode fazer upgrade ou downgrade a qualquer momento.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
