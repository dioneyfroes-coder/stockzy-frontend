import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Package, 
  BarChart, 
  Database, 
  Settings, 
  LogOut 
} from 'lucide-react';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';

interface SidebarProps {
  className?: string;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  className,
  collapsed = false,
  onToggleCollapse
}) => {
  const { user, logout } = useAuth();
  
  // Determine which nav items to show based on user role
  const getNavItems = () => {
    const baseItems = [
      { to: "/dashboard", icon: <LayoutDashboard size={20} />, label: "Painel" },
      { to: "/products", icon: <Package size={20} />, label: "Produtos" },
      { to: "/inventory", icon: <Database size={20} />, label: "Estoque" },
    ];
    
    // Adicionar itens apenas para administradores
    if (user && user.role === 'admin') {
      baseItems.push(
        { to: "/reports", icon: <BarChart size={20} />, label: "Relatórios" },
        { to: "/settings", icon: <Settings size={20} />, label: "Configurações" }
      );
    }
    
    return baseItems;
  };

  const navItems = getNavItems();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <aside className={cn(
      "min-h-screen bg-card flex flex-col border-r transition-all duration-300",
      collapsed ? "w-16" : "w-64",
      className
    )}>
      {/* Logo/Brand */}
      <div className="p-4 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="bg-primary/20 text-primary font-bold rounded p-1">
            <span className="text-xl">S</span>
          </div>
          {!collapsed && (
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              Stockzy
            </span>
          )}
        </div>
      </div>
      
      <Separator />
      
      {/* Nav Links */}
      <nav className="flex-1 py-6 px-3">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent/50 transition-colors",
                  isActive ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground",
                  collapsed ? "justify-center" : ""
                )}
              >
                {item.icon}
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* User Profile Section */}
      <div className="p-4 mt-auto">
        {user && (
          <div className="flex flex-col space-y-4">
            <Separator />
            
            {!collapsed && (
              <div className="flex items-center space-x-2 py-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  {user.name.charAt(0)}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-medium truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
              </div>
            )}
            
            <Button 
              variant="ghost" 
              size={collapsed ? "icon" : "default"}
              className="w-full justify-start" 
              onClick={handleLogout}
            >
              <LogOut size={20} />
              {!collapsed && <span className="ml-2">Sair</span>}
            </Button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;