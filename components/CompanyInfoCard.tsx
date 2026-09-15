import { useState, useEffect } from 'react';

const CompanyInfoCard = () => {
  const [timestamp, setTimestamp] = useState(null);
  const [today, setToday] = useState(null);

  useEffect(() => {
    setTimestamp(new Date().getTime());
    setToday(new Date().toLocaleDateString('es-PE'));
  }, []);

  return (
    <div className="bg-gray-grafito-light p-6 rounded-xl shadow-lg flex justify-between">
      <div>
        <p className="font-bold text-lg">Cerezo Films</p>
        <p className="text-sm text-gray-400">Musso y Huarcaya SAC - RUC 20609124734</p>
        <p className="text-sm text-gray-400">hola@cerezoperu.com</p>
      </div>
      <div className="text-right">
        <p className="font-bold text-lg">COTIZACIÓN</p>
        <p className="text-sm text-gray-400">COT-{timestamp}</p>
        <p className="text-sm text-gray-400">Fecha: {today}</p>
      </div>
    </div>
  );
};

export default CompanyInfoCard;
