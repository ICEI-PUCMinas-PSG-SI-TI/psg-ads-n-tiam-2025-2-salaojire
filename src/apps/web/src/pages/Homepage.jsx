import React from 'react';

import Apresentacao from '../components/homepage/Apresentacao';
import Galeria from '../components/homepage/Galeria';
import QuemSomos from '../components/homepage/QuemSomos';
import Servicos from '../components/homepage/Servicos';
import Mapa from '../components/homepage/Mapa';

export default function App() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 selection:bg-amber-500 selection:text-black">
      <Apresentacao />
      <QuemSomos />
      <Servicos />
      <Galeria />
      <Mapa />
    </div>
  );
}