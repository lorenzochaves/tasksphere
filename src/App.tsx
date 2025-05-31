import React from 'react';
import './App.css';
import { AuthProvider } from './contexts/AuthContext';
import { Card, Button, Heading, Text } from './components/atoms';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <Heading level={1} className="text-primary-600 mb-4">
              TaskSphere
            </Heading>
            <Text variant="caption" color="muted" className="mb-8">
              Gestão colaborativa de projetos em desenvolvimento...
            </Text>
            
            <Card className="max-w-md mx-auto">
              <Heading level={2} className="mb-4">
                🚀 Projeto em Construção
              </Heading>
              <Text color="muted" className="mb-6">
                AuthContext configurado! Próximo: React Router e Login
              </Text>
              
              <div className="space-y-3">
                <Button fullWidth>
                  Entrar no Sistema
                </Button>
                <Button variant="secondary" fullWidth>
                  Saber Mais
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;