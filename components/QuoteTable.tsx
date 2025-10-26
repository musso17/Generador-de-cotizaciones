
import React from 'react';
import { LineItem } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';

interface QuoteTableProps {
    items: LineItem[];
    onUpdateItem: (id: string, updatedItem: Partial<LineItem>) => void;
    onAddItem: () => void;
    onRemoveItem: (id: string) => void;
}

const QuoteTable: React.FC<QuoteTableProps> = ({ items, onUpdateItem, onAddItem, onRemoveItem }) => {

    const handleItemChange = (id: string, field: keyof Omit<LineItem, 'id'>, value: string | number) => {
        const numericValue = typeof value === 'string' ? parseFloat(value) : value;
        if (!isNaN(numericValue) || field === 'description') {
            onUpdateItem(id, { [field]: field === 'description' ? value : numericValue });
        }
    };
    
    return (
        <div className="mb-8 overflow-x-auto">
            <table className="w-full min-w-[600px] text-sm text-left text-slate-500 dark:text-slate-400">
                <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-100 dark:bg-slate-700">
                    <tr>
                        <th scope="col" className="px-6 py-3 rounded-l-lg w-1/2">Descripción</th>
                        <th scope="col" className="px-6 py-3 text-center">Cantidad</th>
                        <th scope="col" className="px-6 py-3 text-right">Precio Unitario</th>
                        <th scope="col" className="px-6 py-3 text-right">Subtotal</th>
                        <th scope="col" className="px-6 py-3 rounded-r-lg text-center">Acción</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => (
                        <tr key={item.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600/20">
                            <td className="px-6 py-4">
                                <input
                                    type="text"
                                    value={item.description}
                                    onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                                    className="w-full bg-transparent focus:outline-none"
                                    placeholder="Descripción del servicio"
                                />
                            </td>
                            <td className="px-6 py-4 text-center">
                                <input
                                    type="number"
                                    value={item.quantity}
                                    onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)}
                                    className="w-20 bg-transparent text-center focus:outline-none"
                                    min="0"
                                />
                            </td>
                            <td className="px-6 py-4 text-right">
                                <input
                                    type="number"
                                    value={item.unitPrice}
                                    onChange={(e) => handleItemChange(item.id, 'unitPrice', e.target.value)}
                                    className="w-28 bg-transparent text-right focus:outline-none"
                                    min="0"
                                    step="0.01"
                                />
                            </td>
                            <td className="px-6 py-4 font-semibold text-slate-800 dark:text-slate-200 text-right">
                                {(item.quantity * item.unitPrice).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                            </td>
                            <td className="px-6 py-4 text-center">
                                <button onClick={() => onRemoveItem(item.id)} className="text-red-500 hover:text-red-700">
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="mt-4">
                <button
                    onClick={onAddItem}
                    className="flex items-center gap-2 text-sky-600 dark:text-sky-400 font-semibold hover:text-sky-800 dark:hover:text-sky-300 transition-colors"
                >
                    <PlusIcon className="w-5 h-5" />
                    Añadir Ítem
                </button>
            </div>
        </div>
    );
};

export default QuoteTable;
