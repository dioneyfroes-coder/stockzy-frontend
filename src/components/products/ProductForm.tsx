import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { ProductFormData, Product } from '../../types';
import { productService } from '../../services/api';
import { useToast } from '../ui/use-toast';

interface ProductFormProps {
  productId?: string;
  onSubmitSuccess?: () => void;
}

// Form schema
const productFormSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters"),
  sku: z.string().min(3, "SKU must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Category is required"),
  price: z
    .number({ invalid_type_error: "Price must be a number" })
    .positive("Price must be positive"),
  costPrice: z
    .number({ invalid_type_error: "Cost price must be a number" })
    .positive("Cost price must be positive"),
  stockQuantity: z
    .number({ invalid_type_error: "Stock quantity must be a number" })
    .int("Stock quantity must be an integer")
    .nonnegative("Stock quantity cannot be negative"),
  minStockLevel: z
    .number({ invalid_type_error: "Min stock level must be a number" })
    .int("Min stock level must be an integer")
    .nonnegative("Min stock level cannot be negative"),
  supplier: z.string().min(1, "Supplier is required"),
});

// Categories (in a real app, these would be fetched from the backend)
const categories = [
  "Electronics",
  "Office Supplies",
  "Furniture",
  "Kitchen",
  "Clothing",
  "Tools",
  "Other",
];

const ProductForm: React.FC<ProductFormProps> = ({ productId, onSubmitSuccess }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const isEditMode = !!productId;

  // Initialize form
  const form = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      sku: "",
      description: "",
      category: "",
      price: 0,
      costPrice: 0,
      stockQuantity: 0,
      minStockLevel: 5,
      supplier: "",
    },
  });

  // Load product data if in edit mode
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;

      setIsLoading(true);
      try {
        const product = await productService.getProductById(productId);
        // Update form values
        form.reset({
          name: product.name,
          sku: product.sku,
          description: product.description,
          category: product.category,
          price: product.price,
          costPrice: product.costPrice,
          stockQuantity: product.stockQuantity,
          minStockLevel: product.minStockLevel,
          supplier: product.supplier,
        });
      } catch (error) {
        console.error('Failed to fetch product', error);
        toast({
          title: "Error",
          description: "Failed to load product data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId, form, toast]);

  // Handle form submission
  const onSubmit = async (data: ProductFormData) => {
    setIsLoading(true);
    try {
      if (isEditMode && productId) {
        await productService.updateProduct(productId, data);
        toast({
          title: "Success",
          description: "Product updated successfully",
        });
      } else {
        await productService.createProduct(data);
        toast({
          title: "Success",
          description: "Product created successfully",
        });
      }

      if (onSubmitSuccess) {
        onSubmitSuccess();
      } else {
        navigate('/products');
      }
    } catch (error) {
      console.error('Failed to save product', error);
      toast({
        title: "Error",
        description: isEditMode ? "Failed to update product" : "Failed to create product",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditMode ? "Editar Produto" : "Criar Novo Produto"}</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Produto</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o nome do produto" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o SKU" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Digite a descrição do produto"
                      className="resize-none min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="supplier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fornecedor</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o nome do fornecedor" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preço de Venda</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0,00"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="costPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preço de Custo</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0,00"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="stockQuantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantidade em Estoque</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="minStockLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estoque Mínimo</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormDescription>
                      Um alerta será disparado quando o estoque cair abaixo deste nível
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/products')}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Salvando..." : isEditMode ? "Atualizar Produto" : "Criar Produto"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default ProductForm;