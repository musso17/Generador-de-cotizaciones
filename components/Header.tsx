import { Download } from 'lucide-react';

const Header = () => {
  return (
    <header className="flex items-center justify-between p-8">
      <div>
        <h1 className="text-3xl font-bold">Generador de Cotizaciones Cerezo Films</h1>
        <p className="text-sm text-gray-400">Crea, analiza y exporta cotizaciones con ayuda de IA.</p>
      </div>
    </header>
  );
};

export default Header;
