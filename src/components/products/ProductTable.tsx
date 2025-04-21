import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '../ui/dropdown-menu';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { 
  Edit, 
  Trash2, 
  MoreVertical, 
  ChevronUp, 
  ChevronDown 
} from 'lucide-react';
import { Product } from '../../types';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';

interface ProductTableProps {
  products: Product[];
  onDelete: (id: string) => Promise<void>;
  onSort: (field: string) => void;
  sortField: string;
  sortDirection: 'asc' | 'desc';
}

const ProductTable: React.FC<ProductTableProps> = ({
  products,
  onDelete,
  onSort,
  sortField,
  sortDirection,
}) => {
  const navigate = useNavigate();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };

  // Determine stock status
  const getStockStatus = (quantity: number, minLevel: number) => {
    if (quantity <= 0) {
      return <Badge variant="destructive">Sem Estoque</Badge>;
    }
    if (quantity <= minLevel) {
      return <Badge variant="outline" className="bg-orange-500/10 text-orange-500">Estoque Baixo</Badge>;
    }
    return <Badge variant="outline" className="bg-green-500/10 text-green-500">Em Estoque</Badge>;
  };

  // Handle sort click
  const handleSortClick = (field: string) => {
    onSort(field);
  };

  // Get sort icon
  const getSortIcon = (field: string) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
  };

  // Handle edit click
  const handleEditClick = (id: string) => {
    navigate(`/products/edit/${id}`);
  };

  // Handle delete click
  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (deleteId) {
      await onDelete(deleteId);
      setIsDeleteDialogOpen(false);
      setDeleteId(null);
    }
  };

  // Get table header with sort functionality
  const SortableHeader = ({ field, label }: { field: string, label: string }) => (
    <div
      className="flex items-center gap-1 cursor-pointer"
      onClick={() => handleSortClick(field)}
    >
      {label}
      {getSortIcon(field)}
    </div>
  );

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead><SortableHeader field="name" label="Nome do Produto" /></TableHead>
              <TableHead><SortableHeader field="sku" label="SKU" /></TableHead>
              <TableHead><SortableHeader field="category" label="Categoria" /></TableHead>
              <TableHead className="text-right"><SortableHeader field="price" label="Preço" /></TableHead>
              <TableHead className="text-right"><SortableHeader field="stockQuantity" label="Estoque" /></TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Nenhum produto encontrado.
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell className="text-right">{formatCurrency(product.price)}</TableCell>
                  <TableCell className="text-right">{product.stockQuantity}</TableCell>
                  <TableCell>{getStockStatus(product.stockQuantity, product.minStockLevel)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleEditClick(product.id)}>
                          <Edit size={16} className="mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDeleteClick(product.id)}
                        >
                          <Trash2 size={16} className="mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O produto será removido permanentemente do seu estoque.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ProductTable;