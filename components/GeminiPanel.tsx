import { useState } from 'react';
import { LoadingState } from '@/types';

type GeminiPanelProps = {
  onGenerateTemplate: (prompt: string) => void | Promise<void>;
  onAnalyzePricing: () => void | Promise<void>;
  analysisResult: string;
  isLoading: LoadingState;
};

const GeminiPanel = ({
  onGenerateTemplate,
  onAnalyzePricing,
  analysisResult,
  isLoading,
}: GeminiPanelProps) => {
  const [prompt, setPrompt] = useState('');

  return (
    <aside className="rounded-xl bg-white p-6 shadow dark:bg-slate-900/30">
      <h2 className="text-lg font-semibold">Asistente Gemini</h2>
      <p className="mt-1 text-sm text-slate-500">
        Genera plantillas y valida tus precios con la base histórica de Cerezo Films.
      </p>
      <div className="mt-4 space-y-4">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-500">Requerimiento del cliente</span>
          <textarea
            rows={6}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="rounded-xl border border-slate-200 bg-transparent px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700"
            placeholder="Pega aquí el mensaje que recibiste por WhatsApp"
          />
        </label>
        <button
          type="button"
          onClick={() => onGenerateTemplate(prompt)}
          disabled={isLoading.template || !prompt.trim()}
          className="w-full rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-500 dark:bg-indigo-600 dark:hover:bg-indigo-500"
        >
          {isLoading.template ? 'Generando plantilla...' : 'Generar ítems con IA'}
        </button>
        <button
          type="button"
          onClick={onAnalyzePricing}
          disabled={isLoading.analysis}
          className="w-full rounded-xl border border-indigo-200 px-4 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-indigo-800 dark:text-indigo-200 dark:hover:bg-indigo-950"
        >
          {isLoading.analysis ? 'Analizando precios...' : 'Analizar pricing'}
        </button>
      </div>
      <div className="mt-6">
        <h3 className="text-sm font-semibold text-slate-600">Resultado del análisis</h3>
        <div className="mt-2 rounded-xl border border-slate-200 p-4 text-sm text-slate-700 dark:border-slate-700 dark:text-slate-200">
          {analysisResult ? (
            <pre className="whitespace-pre-wrap text-sm">{analysisResult}</pre>
          ) : (
            <p className="text-slate-400">Aún no hay un análisis disponible.</p>
          )}
        </div>
      </div>
    </aside>
  );
};

export default GeminiPanel;
