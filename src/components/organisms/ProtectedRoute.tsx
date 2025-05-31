import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, Spinner, Heading, Text, Button } from '../atoms';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="xl" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md">
          <Heading level={2} className="mb-4">
            Acesso Negado
          </Heading>
          <Text color="muted" className="mb-6">
            Você precisa estar logado para acessar esta página.
          </Text>
          <Button 
            fullWidth
            onClick={() => window.location.href = '/login'}
          >
            Ir para Login
          </Button>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
