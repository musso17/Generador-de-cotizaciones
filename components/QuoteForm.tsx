
import React from 'react';
import { Quote, ServiceType, ClientIndustry } from '../types';
import { SERVICE_TYPES, CLIENT_INDUSTRIES } from '../constants';
import { SparklesIcon } from './icons/SparklesIcon';
import Spinner from './Spinner';

interface QuoteFormProps {
    quote: Quote;
    onInputChange: (field: keyof Quote['client'] | 'projectDescription', value: string) => void;
    onSelectChange: (field: 'serviceType' | 'industry', value: ServiceType | ClientIndustry) => void;
    onClassify: () => void;
    isLoading: boolean;
}

const QuoteForm: React.FC<QuoteFormProps> = ({ quote, onInputChange, onSelectChange, onClassify, isLoading }) => {
    return (
        <div className="mb-8">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">Detalles del Cliente y Proyecto</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="clientName" className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Nombre del Cliente</label>
                    <input
                        type="text"
                        id="clientName"
                        value={quote.client.name}
                        onChange={(e) => onInputChange('name', e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                        placeholder="Ej: Cafetería El Buen Sabor"
                    />
                </div>
                <div>
                    <label htmlFor="projectDescription" className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Descripción del Proyecto</label>
                    <div className="relative">
                        <textarea
                            id="projectDescription"
                            value={quote.projectDescription}
                            onChange={(e) => onInputChange('projectDescription', e.target.value)}
                            onBlur={onClassify}
                            className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                            placeholder="Ej: Paquete de 4 reels y 20 fotos para redes sociales"
                            rows={1}
                        />
                         <button
                            onClick={onClassify}
                            disabled={isLoading}
                            className="absolute top-1/2 right-2 -translate-y-1/2 text-sky-600 dark:text-sky-400 hover:text-sky-800 dark:hover:text-sky-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Clasificar con IA"
                        >
                            {isLoading ? <Spinner /> : <SparklesIcon className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
                <div>
                    <label htmlFor="clientIndustry" className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Rubro del Cliente</label>
                    <select
                        id="clientIndustry"
                        value={quote.client.industry}
                        onChange={(e) => onSelectChange('industry', e.target.value as ClientIndustry)}
                        className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    >
                        {CLIENT_INDUSTRIES.map(industry => (
                            <option key={industry} value={industry}>{industry}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="serviceType" className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Tipo de Servicio</label>
                    <select
                        id="serviceType"
                        value={quote.serviceType}
                        onChange={(e) => onSelectChange('serviceType', e.target.value as ServiceType)}
                        className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    >
                        {SERVICE_TYPES.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
};

export default QuoteForm;
