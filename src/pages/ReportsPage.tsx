import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Button } from '../components/ui/button';
import { Download } from 'lucide-react';
import { toast } from '../components/ui/use-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const ReportsPage: React.FC = () => {
  const [timeframe, setTimeframe] = useState('month');

  // Mock data for reports
  const salesData = [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 2000 },
    { name: 'Apr', value: 2780 },
    { name: 'May', value: 1890 },
    { name: 'Jun', value: 2390 },
    { name: 'Jul', value: 3490 },
    { name: 'Aug', value: 3200 },
    { name: 'Sep', value: 2800 },
    { name: 'Oct', value: 2400 },
    { name: 'Nov', value: 2900 },
    { name: 'Dec', value: 3300 },
  ];

  const categoryData = [
    { name: 'Electronics', value: 45 },
    { name: 'Office Supplies', value: 30 },
    { name: 'Furniture', value: 15 },
    { name: 'Other', value: 10 },
  ];

  const supplierData = [
    { name: 'Supplier A', value: 35 },
    { name: 'Supplier B', value: 25 },
    { name: 'Supplier C', value: 20 },
    { name: 'Supplier D', value: 10 },
    { name: 'Other', value: 10 },
  ];

  const COLORS = ['#0284c7', '#f59e0b', '#10b981', '#8b5cf6', '#6b7280'];

  const handleExport = () => {
    toast({
      title: "Exportação Iniciada",
      description: "Sua exportação será processada e estará disponível para download em instantes.",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Relatórios & Analytics</h1>
        <div className="flex items-center gap-2">
          <Select
            value={timeframe}
            onValueChange={setTimeframe}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecione o período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Última Semana</SelectItem>
              <SelectItem value="month">Último Mês</SelectItem>
              <SelectItem value="quarter">Último Trimestre</SelectItem>
              <SelectItem value="year">Último Ano</SelectItem>
              <SelectItem value="custom">Faixa Personalizada</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleExport}>
            <Download size={16} className="mr-2" />
            Exportar
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-4 mb-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="inventory">Estoque</TabsTrigger>
          <TabsTrigger value="suppliers">Fornecedores</TabsTrigger>
          <TabsTrigger value="trends">Tendências</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-medium">Evolução de Vendas</CardTitle>
                <CardDescription>Vendas mensais dos últimos 12 meses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={salesData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                      <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                      <Tooltip
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                        itemStyle={{ color: 'hsl(var(--foreground))' }}
                        labelStyle={{ color: 'hsl(var(--foreground))' }}
                      />
                      <Bar dataKey="value" fill="#0284c7" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-medium">Categorias de Produtos</CardTitle>
                <CardDescription>Distribuição por categoria</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                        itemStyle={{ color: 'hsl(var(--foreground))' }}
                        labelStyle={{ color: 'hsl(var(--foreground))' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">Indicadores de Performance</CardTitle>
              <CardDescription>Resumo dos principais indicadores</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-secondary p-4 rounded-lg">
                  <div className="text-muted-foreground text-sm">Receita Total</div>
                  <div className="text-2xl font-bold mt-1">R$ 128.430</div>
                  <div className="text-green-500 text-sm mt-1">+12.5% em relação ao {timeframe}</div>
                </div>
                
                <div className="bg-secondary p-4 rounded-lg">
                  <div className="text-muted-foreground text-sm">Valor em Estoque</div>
                  <div className="text-2xl font-bold mt-1">R$ 87.250</div>
                  <div className="text-green-500 text-sm mt-1">+5.2% em relação ao {timeframe}</div>
                </div>
                
                <div className="bg-secondary p-4 rounded-lg">
                  <div className="text-muted-foreground text-sm">Total de Produtos</div>
                  <div className="text-2xl font-bold mt-1">256</div>
                  <div className="text-green-500 text-sm mt-1">+8 em relação ao {timeframe}</div>
                </div>
                
                <div className="bg-secondary p-4 rounded-lg">
                  <div className="text-muted-foreground text-sm">Giro de Estoque</div>
                  <div className="text-2xl font-bold mt-1">4,7x</div>
                  <div className="text-orange-500 text-sm mt-1">-0.3x em relação ao {timeframe}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Inventory Tab */}
        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Relatórios de Estoque</CardTitle>
              <CardDescription>
                Análise detalhada do status do estoque
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Esta seção terá relatórios detalhados de estoque e analytics.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Suppliers Tab */}
        <TabsContent value="suppliers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">Distribuição de Fornecedores</CardTitle>
              <CardDescription>Percentual por fornecedor</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={supplierData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {supplierData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                      itemStyle={{ color: 'hsl(var(--foreground))' }}
                      labelStyle={{ color: 'hsl(var(--foreground))' }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tendências de Mercado</CardTitle>
              <CardDescription>
                Análise de tendências e previsões para o estoque
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Esta seção trará informações e previsões de tendências do mercado.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsPage;