'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Heart, Stethoscope, Pill, Activity, Users, ExternalLink, CheckCircle2, Sparkles } from 'lucide-react';
import Link from 'next/link';

const BENEFITS = [
  {
    icon: Stethoscope,
    title: 'Consultas com Desconto',
    description: 'Acesso a profissionais de saúde com descontos exclusivos de até 70%',
    color: 'text-blue-400',
  },
  {
    icon: Pill,
    title: 'Medicamentos',
    description: 'Descontos em farmácias parceiras e produtos de saúde',
    color: 'text-purple-400',
  },
  {
    icon: Activity,
    title: 'Exames Laboratoriais',
    description: 'Realize exames com preços especiais em laboratórios credenciados',
    color: 'text-cyan-400',
  },
  {
    icon: Users,
    title: 'Telemedicina',
    description: 'Consultas online com médicos especialistas sem sair de casa',
    color: 'text-emerald-400',
  },
];

const FEATURES = [
  'Rede credenciada em todo o Brasil',
  'Atendimento 24/7 via telemedicina',
  'Sem carência para utilização',
  'Descontos progressivos conforme uso',
  'Programa de pontos e recompensas',
  'Acompanhamento de saúde personalizado',
];

export default function CapicarePage() {
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

  const handleAccessMarketplace = () => {
    // Em produção, redirecionar para o marketplace real
    window.open('https://capicare.com.br', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-black to-emerald-900">
      {/* Header */}
      <header className="bg-black/50 border-b border-emerald-800 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon" className="text-emerald-400">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                <Heart className="w-6 h-6 text-red-400" />
                Capicare
              </h1>
              <p className="text-xs text-emerald-400">Cuide da sua saúde com benefícios exclusivos</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 space-y-8">
        {/* Hero Section */}
        <Card className="bg-gradient-to-r from-red-600 to-pink-600 border-none overflow-hidden">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <Heart className="w-10 h-10 text-white" />
                  <h2 className="text-3xl font-bold text-white">Capicare</h2>
                </div>
                <p className="text-white/90 text-lg mb-6">
                  Sua saúde merece atenção especial! Com o Capicare, você tem acesso a uma rede 
                  completa de profissionais e estabelecimentos de saúde com descontos incríveis 
                  ou até mesmo serviços gratuitos.
                </p>
                <Button
                  onClick={handleAccessMarketplace}
                  className="bg-white text-red-600 hover:bg-red-50 font-bold text-lg px-8 py-6"
                >
                  Acessar Marketplace
                  <ExternalLink className="w-5 h-5 ml-2" />
                </Button>
              </div>
              <div className="flex-shrink-0">
                <div className="w-48 h-48 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Heart className="w-24 h-24 text-white" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Benefícios Principais */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-yellow-400" />
            Benefícios Exclusivos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {BENEFITS.map((benefit, index) => (
              <Card key={index} className="bg-black/50 border-emerald-800 hover:border-emerald-600 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-emerald-900/50 rounded-full flex items-center justify-center">
                      <benefit.icon className={`w-6 h-6 ${benefit.color}`} />
                    </div>
                    <CardTitle className="text-white text-lg">{benefit.title}</CardTitle>
                  </div>
                  <CardDescription className="text-emerald-300">
                    {benefit.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* Características */}
        <Card className="bg-black/50 border-emerald-800">
          <CardHeader>
            <CardTitle className="text-white text-xl">O que você encontra no Capicare</CardTitle>
            <CardDescription className="text-emerald-300">
              Todos os recursos para cuidar da sua saúde em um só lugar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {FEATURES.map((feature, index) => (
                <div key={index} className="flex items-start gap-3 bg-emerald-950/50 p-4 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="text-white">{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Como Funciona */}
        <Card className="bg-gradient-to-r from-emerald-600 to-cyan-600 border-none">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Como Funciona?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-bold text-white">1</span>
                </div>
                <h3 className="text-white font-bold mb-2">Acesse o Marketplace</h3>
                <p className="text-white/80 text-sm">
                  Clique no botão e explore todos os serviços disponíveis
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-bold text-white">2</span>
                </div>
                <h3 className="text-white font-bold mb-2">Escolha o Serviço</h3>
                <p className="text-white/80 text-sm">
                  Selecione o profissional ou estabelecimento ideal para você
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-bold text-white">3</span>
                </div>
                <h3 className="text-white font-bold mb-2">Aproveite o Desconto</h3>
                <p className="text-white/80 text-sm">
                  Utilize seu benefício e economize na sua saúde
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Final */}
        <Card className="bg-black/50 border-emerald-800">
          <CardContent className="p-8 text-center">
            <Heart className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">
              Pronto para cuidar da sua saúde?
            </h2>
            <p className="text-emerald-300 mb-6 max-w-2xl mx-auto">
              Acesse agora o marketplace Capicare e descubra todos os profissionais e 
              estabelecimentos parceiros prontos para te atender com condições especiais.
            </p>
            <Button
              onClick={handleAccessMarketplace}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg px-8 py-6"
            >
              Acessar Marketplace Capicare
              <ExternalLink className="w-5 h-5 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
