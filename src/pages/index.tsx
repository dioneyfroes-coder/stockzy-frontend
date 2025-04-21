import React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redireciona para dashboard ou login conforme status de autenticação
    const token = localStorage.getItem('stockzy_token');
    if (token) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Bem-vindo ao Stockzy</h1>
        <p className="text-xl text-muted-foreground">
          Redirecionando para a página apropriada...
        </p>
      </div>
    </div>
  );
};

export default Index;