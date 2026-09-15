import { LineItem } from '@/types';

type QuoteTableProps = {
  items: LineItem[];
  onUpdateItem: (id: string, updatedItem: Partial<LineItem>) => void;
  onRemoveItem: (id: string) => void;
  onAddItem: () => void;
};

const QuoteTable = ({ items, onUpdateItem, onRemoveItem, onAddItem }: QuoteTableProps) => {
  const handlePriceChange = (id: string, value: string) => {
    const parsedValue = Number(value);
    if (Number.isNaN(parsedValue)) {
      return;
    }
    onUpdateItem(id, { unitPrice: parsedValue < 0 ? 0 : parsedValue });
  };

  return (
    <section className="mt-8">
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
          <thead className="bg-slate-50 dark:bg-slate-900/30">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Descripción
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Cantidad / entregable
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                S/.
              </th>
              <th className="w-16 px-4 py-3" aria-hidden />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-800 dark:bg-slate-900/20">
            {items.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-6 text-center text-sm text-slate-500"
                >
                  No hay ítems registrados todavía.
                </td>
              </tr>
            )}
            {items.map((item) => (
              <tr key={item.id}>
                <td className="px-4 py-3">
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => onUpdateItem(item.id, { description: e.target.value })}
                    className="w-full rounded-lg border border-transparent bg-transparent px-2 py-1 text-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                    placeholder="Describe el servicio"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="text"
                    value={item.quantityLabel ?? ''}
                    onChange={(e) => onUpdateItem(item.id, { quantityLabel: e.target.value })}
                    className="w-full rounded-lg border border-transparent bg-transparent px-2 py-1 text-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                    placeholder="Ej: 3h, 2 videos"
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-400">S/.</span>
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) => handlePriceChange(item.id, e.target.value)}
                      className="w-28 rounded-lg border border-transparent bg-transparent px-2 py-1 text-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                    />
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.id)}
                    className="text-sm font-semibold text-rose-500 hover:text-rose-400"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4">
        <button
          type="button"
          onClick={onAddItem}
          className="text-sm font-semibold text-indigo-600 hover:text-indigo-500"
        >
          + Añadir ítem
        </button>
      </div>
    </section>
  );
};

export default QuoteTable;
