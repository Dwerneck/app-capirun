'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { getWeightEntries, saveWeightEntry, deleteWeightEntry, getWeightStats } from '@/lib/weight-storage';
import { WeightEntry } from '@/lib/types';
import { ArrowLeft, Plus, Trash2, TrendingDown, TrendingUp, Minus, Scale } from 'lucide-react';
import Link from 'next/link';

export default function WeightPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [entries, setEntries] = useState<WeightEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  
  const [newEntry, setNewEntry] = useState({
    weight: 0,
    notes: ''
  });

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      loadEntries();
    }
  }, [user]);

  const loadEntries = () => {
    if (user) {
      const userEntries = getWeightEntries(user.id);
      setEntries(userEntries);
    }
  };

  const handleAddEntry = () => {
    if (!user || newEntry.weight <= 0) return;

    const entry: WeightEntry = {
      id: `weight-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId: user.id,
      weight: newEntry.weight,
      date: new Date(),
      notes: newEntry.notes || undefined
    };

    saveWeightEntry(entry);
    loadEntries();
    setShowForm(false);
    setNewEntry({ weight: 0, notes: '' });
  };

  const handleDeleteEntry = (entryId: string) => {
    deleteWeightEntry(entryId);
    loadEntries();
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-950 via-black to-emerald-900">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  const stats = getWeightStats(user.id);

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
            <h1 className="text-xl font-bold text-white">Evolução de Peso</h1>
            <p className="text-xs text-emerald-400">Acompanhe sua jornada</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Estatísticas de Peso */}
        {entries.length > 0 && (
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-none">
            <CardContent className="p-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Scale className="w-5 h-5 text-white" />
                    <p className="text-white/80 text-sm">Peso Atual</p>
                  </div>
                  <p className="text-3xl font-bold text-white">{stats.currentWeight.toFixed(1)} kg</p>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    {stats.trend === 'down' && <TrendingDown className="w-5 h-5 text-green-300" />}
                    {stats.trend === 'up' && <TrendingUp className="w-5 h-5 text-red-300" />}
                    {stats.trend === 'stable' && <Minus className="w-5 h-5 text-yellow-300" />}
                    <p className="text-white/80 text-sm">Variação</p>
                  </div>
                  <p className={`text-3xl font-bold ${
                    stats.trend === 'down' ? 'text-green-300' : 
                    stats.trend === 'up' ? 'text-red-300' : 
                    'text-yellow-300'
                  }`}>
                    {stats.totalChange > 0 ? '+' : ''}{stats.totalChange.toFixed(1)} kg
                  </p>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Scale className="w-5 h-5 text-white" />
                    <p className="text-white/80 text-sm">Peso Inicial</p>
                  </div>
                  <p className="text-3xl font-bold text-white">{stats.startWeight.toFixed(1)} kg</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Botão Adicionar Peso */}
        {!showForm && (
          <Button
            onClick={() => setShowForm(true)}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Plus className="w-5 h-5 mr-2" />
            Registrar Peso
          </Button>
        )}

        {/* Formulário de Novo Registro */}
        {showForm && (
          <Card className="bg-black/50 border-emerald-800">
            <CardHeader>
              <CardTitle className="text-white">Novo Registro de Peso</CardTitle>
              <CardDescription className="text-emerald-300">
                Registre seu peso atual
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-emerald-400">Peso (kg)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={newEntry.weight || ''}
                  onChange={(e) => setNewEntry({ ...newEntry, weight: parseFloat(e.target.value) || 0 })}
                  className="bg-emerald-950/50 border-emerald-700 text-white"
                  placeholder="Ex: 75.5"
                />
              </div>

              <div>
                <Label className="text-emerald-400">Observações (opcional)</Label>
                <Textarea
                  value={newEntry.notes}
                  onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
                  className="bg-emerald-950/50 border-emerald-700 text-white"
                  placeholder="Como você está se sentindo?"
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleAddEntry}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                  disabled={newEntry.weight <= 0}
                >
                  Salvar Registro
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

        {/* Histórico de Peso */}
        {entries.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Scale className="w-6 h-6 text-emerald-400" />
              Histórico
            </h2>
            {entries.map((entry, index) => {
              const prevEntry = entries[index + 1];
              const diff = prevEntry ? entry.weight - prevEntry.weight : 0;
              
              return (
                <Card key={entry.id} className="bg-black/50 border-emerald-800">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <p className="text-3xl font-bold text-white">{entry.weight.toFixed(1)} kg</p>
                          {prevEntry && diff !== 0 && (
                            <span className={`flex items-center gap-1 text-sm ${
                              diff < 0 ? 'text-green-400' : 'text-red-400'
                            }`}>
                              {diff < 0 ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
                              {Math.abs(diff).toFixed(1)} kg
                            </span>
                          )}
                        </div>
                        <p className="text-emerald-400 text-sm mb-2">
                          {entry.date.toLocaleDateString('pt-BR', { 
                            day: '2-digit', 
                            month: 'long', 
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                        {entry.notes && (
                          <p className="text-emerald-300 text-sm italic">"{entry.notes}"</p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Estado Vazio */}
        {entries.length === 0 && !showForm && (
          <Card className="bg-black/50 border-emerald-800">
            <CardContent className="p-12 text-center">
              <Scale className="w-16 h-16 text-emerald-400 mx-auto mb-4 opacity-50" />
              <h3 className="text-white text-xl font-semibold mb-2">Nenhum registro ainda</h3>
              <p className="text-emerald-300 mb-6">
                Comece a acompanhar sua evolução de peso!
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
