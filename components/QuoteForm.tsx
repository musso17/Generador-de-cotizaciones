import { Quote, ServiceType } from '@/types';
import { Plus, Trash2 } from 'lucide-react';

type QuoteFormProps = {
  quote: Quote;
  onInputChange: (field: keyof Quote['client'], value: string) => void;
  onDescriptionChange: (value: string) => void;
  onSelectChange: (field: 'serviceType', value: ServiceType) => void;
  onCheckboxChange?: (field: 'showIgv', value: boolean) => void;
  onDateChange: (value: string) => void;
  onConditionsChange: (value: string[]) => void;
  serviceTypes: ServiceType[];
};

const QuoteForm = ({
  quote,
  onInputChange,
  onDescriptionChange,
  onSelectChange,
  onCheckboxChange,
  onDateChange,
  onConditionsChange,
  serviceTypes,
}: QuoteFormProps) => {

  const handleConditionChange = (index: number, value: string) => {
    const newConditions = [...quote.conditions];
    newConditions[index] = value;
    onConditionsChange(newConditions);
  };

  const handleAddCondition = () => {
    onConditionsChange([...quote.conditions, '']);
  };

  const handleRemoveCondition = (index: number) => {
    const newConditions = quote.conditions.filter((_, i) => i !== index);
    onConditionsChange(newConditions);
  };

  return (
    <section className="mt-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-gray-500">Nombre del cliente</span>
          <input
            type="text"
            value={quote.client.name}
            onChange={(e) => onInputChange('name', e.target.value)}
            className="rounded-xl border border-slate-200 bg-transparent px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-600"
            placeholder="Ej: Kaldis"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-gray-500">Descripción del proyecto</span>
          <textarea
            value={quote.projectDescription}
            onChange={(e) => onDescriptionChange(e.target.value)}
            rows={3}
            className="rounded-xl border border-slate-200 bg-transparent px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-600"
            placeholder="La IA generará automáticamente la descripción del proyecto."
          />
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-gray-500">Tipo de servicio</span>
          <select
            value={quote.serviceType}
            onChange={(e) => onSelectChange('serviceType', e.target.value as ServiceType)}
            className="rounded-xl border border-slate-200 bg-transparent px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-600"
          >
            {serviceTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-gray-500">Fecha de cotización</span>
          <input
            type="date"
            value={quote.date}
            onChange={(e) => onDateChange(e.target.value)}
            className="rounded-xl border border-slate-200 bg-transparent px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-600"
          />
        </label>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={quote.showIgv !== false}
            onChange={(e) => onCheckboxChange && onCheckboxChange('showIgv', e.target.checked)}
            className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
          />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Mostrar IGV en la cotización
          </span>
        </label>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="flex flex-col gap-4">
          <span className="text-sm font-medium text-gray-500">Condiciones comerciales</span>

          <div className="space-y-4">
            {quote.conditions.map((condition, index) => (
              <div key={index} className="flex gap-2 items-center">
                <input
                  type="text"
                  value={condition}
                  onChange={(e) => handleConditionChange(index, e.target.value)}
                  className="flex-1 rounded-xl border border-slate-200 bg-transparent px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-600"
                  placeholder="Escriba una condición"
                />
                <button
                  onClick={() => handleRemoveCondition(index)}
                  className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                  title="Eliminar condición"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={handleAddCondition}
            className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 w-fit"
          >
            <Plus size={16} />
            Añadir otra condición
          </button>
        </div>
      </div>
    </section>
  );
};

export default QuoteForm;
