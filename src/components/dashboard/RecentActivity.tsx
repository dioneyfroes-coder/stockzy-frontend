import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { InventoryTransaction } from '../../types';

interface RecentActivityProps {
  transactions: InventoryTransaction[];
  className?: string;
}

const RecentActivity: React.FC<RecentActivityProps> = ({ transactions, className }) => {
  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Get badge variant based on transaction type
  const getTransactionBadge = (type: string) => {
    switch (type) {
      case 'in':
        return <Badge variant="outline" className="bg-green-500/10 text-green-500 hover:bg-green-500/20">Entrada</Badge>;
      case 'out':
        return <Badge variant="outline" className="bg-orange-500/10 text-orange-500 hover:bg-orange-500/20">Saída</Badge>;
      case 'adjustment':
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20">Ajuste</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base font-medium">Atividade Recente</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-0">
          {transactions.map((transaction) => (
            <div 
              key={transaction.id} 
              className="flex items-center justify-between py-3 px-6 hover:bg-secondary/50 border-b last:border-0"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {transaction.productName}
                  </p>
                  <div className="flex items-center mt-1">
                    {getTransactionBadge(transaction.type)}
                    <span className="text-xs text-muted-foreground ml-2">
                      {transaction.reason}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">
                  {transaction.quantity > 0 ? `+${transaction.quantity}` : transaction.quantity}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(transaction.timestamp)}
                </p>
              </div>
            </div>
          ))}

          {transactions.length === 0 && (
            <div className="py-8 text-center text-muted-foreground">
              Nenhuma atividade recente
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;