import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { inventoryService, productService } from '../services/api';
import { InventoryTransaction, Product } from '../types';
import { useToast } from '../components/ui/use-toast';
import { Plus } from 'lucide-react';

const InventoryPage: React.FC = () => {
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<InventoryTransaction[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    productId: '',
    type: 'in',
    quantity: 1,
    reason: '',
  });

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch transactions and products in parallel
        const [transactionsData, productsData] = await Promise.all([
          inventoryService.getTransactions(),
          productService.getProducts(),
        ]);
        setTransactions(transactionsData);
        setProducts(productsData);
      } catch (error) {
        console.error('Failed to fetch inventory data', error);
        toast({
          title: "Error",
          description: "Failed to load inventory data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Handle form input change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value) || 0 : value,
    }));
  };

  // Handle select change
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Find the selected product
      const product = products.find(p => p.id === formData.productId);
      
      if (!product) {
        toast({
          title: "Error",
          description: "Please select a valid product",
          variant: "destructive",
        });
        return;
      }
      
      // Create the transaction
      const newTransaction = await inventoryService.createTransaction({
        productId: formData.productId,
        productName: product.name,
        type: formData.type as 'in' | 'out' | 'adjustment',
        quantity: formData.type === 'out' ? -Math.abs(formData.quantity) : formData.quantity,
        reason: formData.reason,
        performedBy: 'Admin User', // Hardcoded for now
      });
      
      // Update the transactions list
      setTransactions(prev => [newTransaction, ...prev]);
      
      // Reset form and close dialog
      setFormData({
        productId: '',
        type: 'in',
        quantity: 1,
        reason: '',
      });
      setIsDialogOpen(false);
      
      toast({
        title: "Success",
        description: "Inventory transaction recorded successfully",
      });
    } catch (error) {
      console.error('Failed to create transaction', error);
      toast({
        title: "Error",
        description: "Failed to record inventory transaction",
        variant: "destructive",
      });
    }
  };

  // Get transaction type badge
  const getTransactionBadge = (type: string) => {
    switch (type) {
      case 'in':
        return <Badge variant="outline" className="bg-green-500/10 text-green-500">Entrada</Badge>;
      case 'out':
        return <Badge variant="outline" className="bg-orange-500/10 text-orange-500">Saída</Badge>;
      case 'adjustment':
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-500">Ajuste</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Controle de Estoque</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus size={16} className="mr-2" />
              Registrar Movimentação
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Registrar Movimentação de Estoque</DialogTitle>
                <DialogDescription>
                  Lance uma nova movimentação de estoque.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="productId">Produto</Label>
                  <Select 
                    value={formData.productId}
                    onValueChange={(value) => handleSelectChange('productId', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um produto" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map(product => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name} ({product.sku})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="type">Tipo de Movimentação</Label>
                  <Select 
                    value={formData.type}
                    onValueChange={(value) => handleSelectChange('type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in">Entrada</SelectItem>
                      <SelectItem value="out">Saída</SelectItem>
                      <SelectItem value="adjustment">Ajuste</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="quantity">Quantidade</Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="reason">Motivo</Label>
                  <Textarea
                    id="reason"
                    name="reason"
                    placeholder="Motivo da movimentação"
                    value={formData.reason}
                    onChange={handleInputChange}
                    className="resize-none"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Salvar</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Movimentações do Estoque</CardTitle>
          <CardDescription>
            Visualize o histórico e gerencie entradas e saídas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-pulse-subtle text-lg text-muted-foreground">
                Carregando movimentações...
              </div>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Quantidade</TableHead>
                    <TableHead>Motivo</TableHead>
                    <TableHead>Responsável</TableHead>
                    <TableHead>Data & Hora</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        Nenhuma movimentação encontrada.
                      </TableCell>
                    </TableRow>
                  ) : (
                    transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium">{transaction.productName}</TableCell>
                        <TableCell>{getTransactionBadge(transaction.type)}</TableCell>
                        <TableCell className={transaction.quantity < 0 ? "text-orange-500" : "text-green-500"}>
                          {transaction.quantity > 0 ? `+${transaction.quantity}` : transaction.quantity}
                        </TableCell>
                        <TableCell>{transaction.reason}</TableCell>
                        <TableCell>{transaction.performedBy}</TableCell>
                        <TableCell>{formatDate(transaction.timestamp)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryPage;