import React, { useEffect, useState } from 'react';
import { Package, TrendingUp, AlertTriangle, Activity } from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import InventoryChart from '../components/dashboard/InventoryChart';
import RecentActivity from '../components/dashboard/RecentActivity';
import { dashboardService, inventoryService } from '../services/api';
import { DashboardStats, ChartData, InventoryTransaction } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [topProducts, setTopProducts] = useState<ChartData[]>([]);
  const [stockDistribution, setStockDistribution] = useState<ChartData[]>([]);
  const [inventoryHistory, setInventoryHistory] = useState<{date: string; in: number; out: number}[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<InventoryTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const [statsData, topProductsData, stockDistributionData, inventoryHistoryData, transactionsData] = await Promise.all([
          dashboardService.getStats(),
          dashboardService.getTopProducts(),
          dashboardService.getStockDistribution(),
          dashboardService.getInventoryHistory(),
          inventoryService.getTransactions(),
        ]);

        setStats(statsData);
        setTopProducts(topProductsData);
        setStockDistribution(stockDistributionData);
        setInventoryHistory(inventoryHistoryData);
        setRecentTransactions(transactionsData.slice(0, 5));
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-pulse-subtle text-xl text-muted-foreground">
          Carregando painel...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8 animate-fade-in">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Produtos no Estoque"
          value={stats?.totalProducts || 0}
          icon={<Package size={18} />}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Valor total em estoque"
          value={formatCurrency(stats?.totalValue || 0)}
          icon={<TrendingUp size={18} />}
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Itens com Estoque Baixo"
          value={stats?.lowStockItems || 0}
          icon={<AlertTriangle size={18} />}
          trend={{ value: 2, isPositive: false }}
        />
        <StatCard
          title="Transações Recentes"
          value={stats?.recentTransactions || 0}
          icon={<Activity size={18} />}
          trend={{ value: 24, isPositive: true }}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-7 md:col-span-2 lg:col-span-4">
          <CardHeader>
            <CardTitle className="text-base font-medium">Movimentação do Estoque</CardTitle>
          </CardHeader>
          <CardContent className="px-2">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={inventoryHistory}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0284c7" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#0284c7" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorOut" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="date" 
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="in" 
                    stroke="#0284c7" 
                    fillOpacity={1} 
                    fill="url(#colorIn)" 
                    name="Stock In"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="out" 
                    stroke="#f97316" 
                    fillOpacity={1} 
                    fill="url(#colorOut)" 
                    name="Stock Out"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="col-span-7 md:col-span-2 lg:col-span-3">
          <RecentActivity transactions={recentTransactions} className="h-full" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <InventoryChart 
          title="Top Produtos por Valor" 
          data={topProducts} 
          type="bar" 
        />
        <InventoryChart 
          title="Distribuição por Categoria" 
          data={stockDistribution} 
          type="pie" 
          colors={['#0284c7', '#f97316', '#a855f7']}
        />
      </div>
    </div>
  );
};

export default DashboardPage;