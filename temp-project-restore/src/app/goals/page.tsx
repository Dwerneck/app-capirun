'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { getGoals, saveGoal, deleteGoal, updateGoalProgress } from '@/lib/goals-storage';
import { Goal } from '@/lib/types';
import { ArrowLeft, Target, Plus, Trash2, Trophy, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function GoalsPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showForm, setShowForm] = useState(false);
  
  const [newGoal, setNewGoal] = useState({
    type: 'distance' as Goal['type'],
    target: 0,
    period: 'weekly' as Goal['period']
  });

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      updateGoalProgress(user.id);
      loadGoals();
    }
  }, [user]);

  const loadGoals = () => {
    if (user) {
      const userGoals = getGoals(user.id);
      setGoals(userGoals);
    }
  };

  const handleCreateGoal = () => {
    if (!user || newGoal.target <= 0) return;

    const now = new Date();
    let endDate = new Date();
    
    switch (newGoal.period) {
      case 'daily':
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'weekly':
        endDate.setDate(endDate.getDate() + 7);
        break;
      case 'monthly':
        endDate.setMonth(endDate.getMonth() + 1);
        break;
    }

    const goal: Goal = {
      id: `goal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId: user.id,
      type: newGoal.type,
      target: newGoal.target,
      current: 0,
      period: newGoal.period,
      startDate: now,
      endDate,
      completed: false
    };

    saveGoal(goal);
    loadGoals();
    setShowForm(false);
    setNewGoal({ type: 'distance', target: 0, period: 'weekly' });
  };

  const handleDeleteGoal = (goalId: string) => {
    deleteGoal(goalId);
    loadGoals();
  };

  const getGoalLabel = (type: Goal['type']) => {
    switch (type) {
      case 'distance': return 'Distância (km)';
      case 'calories': return 'Calorias';
      case 'activities': return 'Atividades';
      case 'coins': return 'Capicoins';
    }
  };

  const getGoalIcon = (type: Goal['type']) => {
    switch (type) {
      case 'distance': return '🏃';
      case 'calories': return '🔥';
      case 'activities': return '📊';
      case 'coins': return '🪙';
    }
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-950 via-black to-emerald-900">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  const activeGoals = goals.filter(g => !g.completed && new Date() <= g.endDate);
  const completedGoals = goals.filter(g => g.completed);

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
            <h1 className="text-xl font-bold text-white">Minhas Metas</h1>
            <p className="text-xs text-emerald-400">Defina e alcance seus objetivos</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Botão Criar Meta */}
        {!showForm && (
          <Button
            onClick={() => setShowForm(true)}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Plus className="w-5 h-5 mr-2" />
            Criar Nova Meta
          </Button>
        )}

        {/* Formulário de Nova Meta */}
        {showForm && (
          <Card className="bg-black/50 border-emerald-800">
            <CardHeader>
              <CardTitle className="text-white">Nova Meta</CardTitle>
              <CardDescription className="text-emerald-300">
                Defina uma meta para se desafiar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-emerald-400">Tipo de Meta</Label>
                <Select
                  value={newGoal.type}
                  onValueChange={(value) => setNewGoal({ ...newGoal, type: value as Goal['type'] })}
                >
                  <SelectTrigger className="bg-emerald-950/50 border-emerald-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="distance">Distância (km)</SelectItem>
                    <SelectItem value="calories">Calorias</SelectItem>
                    <SelectItem value="activities">Número de Atividades</SelectItem>
                    <SelectItem value="coins">Capicoins</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-emerald-400">Período</Label>
                <Select
                  value={newGoal.period}
                  onValueChange={(value) => setNewGoal({ ...newGoal, period: value as Goal['period'] })}
                >
                  <SelectTrigger className="bg-emerald-950/50 border-emerald-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Diário</SelectItem>
                    <SelectItem value="weekly">Semanal</SelectItem>
                    <SelectItem value="monthly">Mensal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-emerald-400">Meta</Label>
                <Input
                  type="number"
                  value={newGoal.target || ''}
                  onChange={(e) => setNewGoal({ ...newGoal, target: parseFloat(e.target.value) || 0 })}
                  className="bg-emerald-950/50 border-emerald-700 text-white"
                  placeholder="Digite o valor da meta"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleCreateGoal}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                  disabled={newGoal.target <= 0}
                >
                  Criar Meta
                </Button>
                <Button
                  onClick={() => setShowForm(false)}
                  variant="outline"
                  className="flex-1 border-emerald-700 text-emerald-400 hover:bg-emerald-950/50"
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Metas Ativas */}
        {activeGoals.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Target className="w-6 h-6 text-emerald-400" />
              Metas Ativas
            </h2>
            {activeGoals.map(goal => {
              const progress = (goal.current / goal.target) * 100;
              return (
                <Card key={goal.id} className="bg-black/50 border-emerald-800">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{getGoalIcon(goal.type)}</span>
                        <div>
                          <h3 className="text-white font-semibold">{getGoalLabel(goal.type)}</h3>
                          <p className="text-emerald-400 text-sm">
                            Período: {goal.period === 'daily' ? 'Diário' : goal.period === 'weekly' ? 'Semanal' : 'Mensal'}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-emerald-300">Progresso</span>
                        <span className="text-white font-semibold">
                          {goal.current.toFixed(goal.type === 'distance' ? 1 : 0)} / {goal.target}
                        </span>
                      </div>
                      <Progress value={Math.min(progress, 100)} className="h-3" />
                      <p className="text-emerald-400 text-xs text-right">
                        {progress.toFixed(0)}% concluído
                      </p>
                    </div>

                    <div className="mt-4 text-xs text-emerald-300">
                      Termina em: {goal.endDate.toLocaleDateString('pt-BR')}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Metas Concluídas */}
        {completedGoals.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-400" />
              Metas Concluídas
            </h2>
            {completedGoals.map(goal => (
              <Card key={goal.id} className="bg-gradient-to-r from-yellow-900/30 to-emerald-900/30 border-yellow-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{getGoalIcon(goal.type)}</span>
                      <div>
                        <h3 className="text-white font-semibold">{getGoalLabel(goal.type)}</h3>
                        <p className="text-yellow-400 text-sm">✓ Meta alcançada!</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold text-2xl">{goal.current.toFixed(goal.type === 'distance' ? 1 : 0)}</p>
                      <p className="text-emerald-400 text-xs">de {goal.target}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Estado Vazio */}
        {activeGoals.length === 0 && completedGoals.length === 0 && !showForm && (
          <Card className="bg-black/50 border-emerald-800">
            <CardContent className="p-12 text-center">
              <Target className="w-16 h-16 text-emerald-400 mx-auto mb-4 opacity-50" />
              <h3 className="text-white text-xl font-semibold mb-2">Nenhuma meta criada</h3>
              <p className="text-emerald-300 mb-6">
                Crie sua primeira meta e comece a se desafiar!
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
