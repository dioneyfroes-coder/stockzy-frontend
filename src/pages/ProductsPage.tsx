import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../components/ui/select';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../components/ui/popover';
import ProductTable from '../components/products/ProductTable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { productService } from '../services/api';
import { Product, ProductFilter } from '../types';
import { useToast } from '../components/ui/use-toast';

const ProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<ProductFilter>({
    search: '',
    category: '',
    stockStatus: 'all',
    sortBy: 'name',
    sortDirection: 'asc',
  });

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const data = await productService.getProducts(filters);
        setProducts(data);
      } catch (error) {
        console.error('Falha ao buscar produtos', error);
        toast({
          title: "Erro",
          description: "Falha ao carregar produtos",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [filters, toast]);

  const handleAddProduct = () => {
    navigate('/products/new');
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await productService.deleteProduct(id);
      setProducts(products.filter(product => product.id !== id));
      toast({
        title: "Sucesso",
        description: "Produto excluído com sucesso",
      });
    } catch (error) {
      console.error('Falha ao excluir produto', error);
      toast({
        title: "Erro",
        description: "Falha ao excluir produto",
        variant: "destructive",
      });
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, search: e.target.value }));
  };

  const handleCategoryChange = (value: string) => {
    setFilters(prev => ({ ...prev, category: value }));
  };

  const handleStockStatusChange = (value: string) => {
    setFilters(prev => ({ ...prev, stockStatus: value as 'all' | 'in-stock' | 'low-stock' | 'out-of-stock' }));
  };

  const handleSortChange = (field: string) => {
    setFilters(prev => ({
      ...prev,
      sortBy: field as 'name' | 'sku' | 'stock' | 'price',
      sortDirection: prev.sortBy === field && prev.sortDirection === 'asc' ? 'desc' : 'asc',
    }));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Produtos</h1>
        <Button onClick={handleAddProduct}>
          <Plus size={16} className="mr-2" />
          Adicionar Produto
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Catálogo de Produtos</CardTitle>
          <CardDescription>
            Gerencie o catálogo e estoque de produtos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 mb-6">
            <div className="w-full md:w-1/2 relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar produtos..."
                className="pl-8"
                value={filters.search}
                onChange={handleSearchChange}
              />
            </div>
            
            <div className="flex space-x-2 w-full md:w-auto">
              <Select value={filters.category} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Todas categorias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas categorias</SelectItem>
                  <SelectItem value="Electronics">Eletrônicos</SelectItem>
                  <SelectItem value="Office Supplies">Suprimentos de Escritório</SelectItem>
                  <SelectItem value="Furniture">Móveis</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filters.stockStatus} onValueChange={handleStockStatusChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status de Estoque" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos itens</SelectItem>
                  <SelectItem value="in-stock">Em Estoque</SelectItem>
                  <SelectItem value="low-stock">Estoque Baixo</SelectItem>
                  <SelectItem value="out-of-stock">Sem Estoque</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-pulse-subtle text-lg text-muted-foreground">
                Carregando produtos...
              </div>
            </div>
          ) : (
            <ProductTable
              products={products}
              onDelete={handleDeleteProduct}
              onSort={handleSortChange}
              sortField={filters.sortBy}
              sortDirection={filters.sortDirection}
            />
          )}
          
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-muted-foreground">
              Mostrando {products.length} produtos
            </div>
            {/* Paginação no futuro */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductsPage;