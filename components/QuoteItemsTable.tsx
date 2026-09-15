import { useState } from 'react';
import { Trash2 } from 'lucide-react';

const QuoteItemsTable = ({ items, setItems }) => {

  const handleAddItem = () => {
    setItems([...items, { description: '', quantity: 1, price: 0 }]);
  };

  const handleRemoveItem = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handleChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  return (
    <div className="mt-8">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-grafito-light">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Descripción</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Cantidad</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Precio Unitario</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Subtotal</th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Eliminar</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-gray-grafito divide-y divide-gray-700">
          {items.map((item, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap">
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => handleChange(index, 'description', e.target.value)}
                  className="bg-transparent w-full focus:outline-none"
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleChange(index, 'quantity', parseInt(e.target.value))}
                  className="bg-transparent w-20 focus:outline-none"
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <input
                  type="number"
                  value={item.price}
                  onChange={(e) => handleChange(index, 'price', parseFloat(e.target.value))}
                  className="bg-transparent w-24 focus:outline-none"
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                S/. {(item.quantity * item.price).toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button onClick={() => handleRemoveItem(index)} className="text-red-500 hover:text-red-700">
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4">
        <button onClick={handleAddItem} className="text-blue-500 hover:text-blue-700">
          + Añadir Ítem
        </button>
      </div>
    </div>
  );
};

export default QuoteItemsTable;
