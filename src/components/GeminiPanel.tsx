import React, { useState } from 'react';
import Spinner from './Spinner';
import { WandIcon } from './icons/WandIcon';
import { ChartBarIcon } from './icons/ChartBarIcon';
import { XIcon } from './icons/XIcon';

interface GeminiPanelProps {
    onGenerateTemplate: (prompt: string) => void;
    onAnalyzePricing: () => void;
    analysisResult: string;
    isLoading: Record<string, boolean>;
    setAnalysisResult: (result: string) => void;
}

const GeminiPanel: React.FC<GeminiPanelProps> = ({ onGenerateTemplate, onAnalyzePricing, analysisResult, isLoading, setAnalysisResult }) => {
    const [templatePrompt, setTemplatePrompt] = useState('');

    return (
        <div className="sticky top-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6 space-y-6">
            <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-sky-400 to-indigo-500 p-2 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Asistente IA</h2>
            </div>
            
            <div className="space-y-4">
                <div className="space-y-2">
                     <label htmlFor="templatePrompt" className="block text-sm font-medium text-slate-600 dark:text-slate-400">
                        1. Ingresa el requerimiento del cliente
                    </label>
                    <textarea
                        id="templatePrompt"
                        value={templatePrompt}
                        onChange={(e) => setTemplatePrompt(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                        placeholder="Ej: Un video corporativo de 2 min y 5 fotos de producto"
                        rows={3}
                    />
                    <button
                        onClick={() => onGenerateTemplate(templatePrompt)}
                        disabled={isLoading.template || !templatePrompt}
                        className="w-full flex items-center justify-center gap-3 bg-sky-500 text-white font-semibold px-4 py-3 rounded-lg shadow-md hover:bg-sky-600 transition-all focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 disabled:bg-sky-300 dark:disabled:bg-sky-800/50 disabled:cursor-not-allowed"
                    >
                        {isLoading.template ? <Spinner /> : <WandIcon className="w-5 h-5" />}
                        <span>Generar Plantilla de Ítems</span>
                    </button>
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-400">
                        2. Analiza tu cotización final
                    </label>
                    <button
                        onClick={onAnalyzePricing}
                        disabled={isLoading.analysis}
                        className="w-full flex items-center justify-center gap-3 bg-indigo-500 text-white font-semibold px-4 py-3 rounded-lg shadow-md hover:bg-indigo-600 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 disabled:bg-indigo-300 dark:disabled:bg-indigo-800/50 disabled:cursor-not-allowed"
                    >
                        {isLoading.analysis ? <Spinner /> : <ChartBarIcon className="w-5 h-5" />}
                        <span>Analizar Precios</span>
                    </button>
                </div>
            </div>
            
            {(isLoading.analysis || analysisResult) && (
                <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Análisis de Precios</h3>
                        {analysisResult && (
                             <button onClick={() => setAnalysisResult('')} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                                <XIcon className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                    {isLoading.analysis && (
                        <div className="flex items-center justify-center p-8">
                            <Spinner />
                            <p className="ml-4 text-slate-500 dark:text-slate-400">Analizando...</p>
                        </div>
                    )}
                    {analysisResult && (
                         <div className="prose prose-sm dark:prose-invert max-w-none p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                            {analysisResult.split('\n').map((line, i) => {
                                if (line.startsWith('### ')) {
                                    return <h3 key={i} className="font-bold mt-2">{line.replace('### ', '')}</h3>;
                                }
                                if (line.startsWith('**') && line.endsWith('**')) {
                                    // FIX: Replace `replaceAll` with `replace` using a global regex for compatibility with older TypeScript targets.
                                    return <p key={i}><strong>{line.replace(/\*\*/g,'')}</strong></p>;
                                }
                                 if (line.startsWith('* ')) {
                                    return <li key={i}>{line.replace('* ', '')}</li>;
                                }
                                return <p key={i}>{line}</p>;
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default GeminiPanel;