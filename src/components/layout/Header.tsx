import React from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, Search, Bell } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Separator } from '../ui/separator';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const location = useLocation();
  const { user } = useAuth();
  
  // Determine the page title based on current route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return 'Painel';
    if (path.includes('/products')) return 'Produtos';
    if (path.includes('/inventory')) return 'Estoque';
    if (path.includes('/reports')) return 'Relatórios';
    if (path.includes('/settings')) return 'Configurações';
    return 'Stockzy';
  };

  return (
    <header className="h-16 px-4 bg-card border-b flex items-center justify-between">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="mr-2">
          <Menu size={20} />
        </Button>
        <h1 className="text-xl font-semibold">{getPageTitle()}</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar..."
            className="pl-8 bg-secondary"
          />
        </div>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className="relative">
              <Bell size={18} />
              <span className="absolute -top-1 -right-1 h-4 w-4 text-[10px] rounded-full bg-primary flex items-center justify-center text-white">
                3
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end">
            <div className="p-3 font-medium">Notificações</div>
            <Separator />
            
            {/* Notification items */}
            <div className="overflow-hidden">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-3 hover:bg-secondary cursor-pointer">
                  <div className="flex justify-between items-start">
                    <p className="font-medium text-sm">Alerta de estoque baixo</p>
                    <span className="text-xs text-muted-foreground">2h atrás</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Produto SKU-{1000 + i} com estoque baixo.
                  </p>
                </div>
              ))}
            </div>
            
            <Separator />
            <div className="p-2">
              <Button variant="ghost" size="sm" className="w-full">
                Ver todas notificações
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
};

export default Header;