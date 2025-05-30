import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-primary-600 mb-4">
            TaskSphere
          </h1>
          <p className="text-xl text-secondary-600 mb-8">
            Gestão colaborativa de projetos em desenvolvimento...
          </p>
          
          <div className="card max-w-md mx-auto">
            <h2 className="text-2xl font-semibold text-secondary-800 mb-4">
              🚀 Projeto em Construção
            </h2>
            <p className="text-secondary-600 mb-6">
              Sistema moderno de gestão de projetos e tarefas colaborativas.
            </p>
            
            <div className="space-y-3">
              <button className="btn-primary w-full">
                Entrar no Sistema
              </button>
              <button className="btn-secondary w-full">
                Saber Mais
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;