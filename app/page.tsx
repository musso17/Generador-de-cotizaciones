'use client';

import { useState, useRef, useCallback, useMemo } from 'react';
import Header from '@/components/Header';
import CompanyInfoCard from '@/components/CompanyInfoCard';
import { Quote, LineItem, ServiceType, LoadingState } from '@/types';
import { IGV_RATE, SERVICE_TYPES } from '@/constants';
import { classifyProject, generateTemplateItems, analyzePricing } from '@/services/geminiService';
import GeminiPanel from '@/components/GeminiPanel';
import QuoteForm from '@/components/QuoteForm';
import QuoteTable from '@/components/QuoteTable';
import QuoteTotals from '@/components/QuoteTotals';
import QuoteDocument from '@/components/QuoteDocument';

export default function HomePage() {
  const [quote, setQuote] = useState<Quote>({
    id: `COT-${Date.now()}`,
    client: { name: '' },
    serviceType: ServiceType.OTRO,
    projectDescription: '',
    items: [],
    igvRate: IGV_RATE,
    showIgv: true,
    date: new Date().toISOString().split('T')[0],
    conditions: [
      'Moneda: Sol peruano (PEN).',
      'Incluye hasta 3-4 rondas de ajustes según alcance acordado.',
      'Viáticos, talentos, locaciones o permisos se cotizan por separado.',
      'Condiciones de pago sujetas a acuerdo comercial final.'
    ]
  });
  const [isLoading, setIsLoading] = useState<LoadingState>({
    template: false,
    analysis: false,
    pdf: false,
  });
  const [analysisResult, setAnalysisResult] = useState<string>('');

  const quoteRef = useRef<HTMLDivElement>(null);

  const handleClientInputChange = useCallback((field: keyof Quote['client'], value: string) => {
    setQuote(prev => ({ ...prev, client: { ...prev.client, [field]: value } }));
  }, []);

  const handleCheckboxChange = useCallback((field: 'showIgv', value: boolean) => {
    setQuote(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleDescriptionChange = useCallback((value: string) => {
    setQuote(prev => ({ ...prev, projectDescription: value }));
  }, []);

  const handleSelectChange = useCallback((field: 'serviceType', value: ServiceType) => {
    if (field === 'serviceType') {
      setQuote(prev => ({ ...prev, serviceType: value as ServiceType }));
    }
  }, []);

  const handleDateChange = useCallback((value: string) => {
    setQuote(prev => ({ ...prev, date: value }));
  }, []);

  const handleConditionsChange = useCallback((value: string[]) => {
    setQuote(prev => ({ ...prev, conditions: value }));
  }, []);

  const handleGenerateTemplate = useCallback(async (rawPrompt: string) => {
    const normalizedPrompt = rawPrompt.trim();
    if (!normalizedPrompt) {
      alert("Por favor, ingrese el requerimiento del cliente para generar una plantilla.");
      return;
    }
    setIsLoading(prev => ({ ...prev, template: true }));
    try {
      const classification = await classifyProject(normalizedPrompt, SERVICE_TYPES);
      let resolvedServiceType = quote.serviceType;

      if (classification.serviceType && Object.values(ServiceType).includes(classification.serviceType as ServiceType)) {
        resolvedServiceType = classification.serviceType as ServiceType;
      }

      const templateData = await generateTemplateItems(normalizedPrompt, resolvedServiceType);

      setQuote(prev => ({
        ...prev,
        serviceType: resolvedServiceType,
        client: {
          ...prev.client,
          name: templateData.clientName ?? prev.client.name,
        },
        projectDescription: templateData.projectDescription,
        items: templateData.items.map(item => ({ ...item, id: crypto.randomUUID() })),
      }));
    } catch (error) {
      console.error("Error generating template:", error);
      alert("Hubo un error al generar la plantilla.");
    } finally {
      setIsLoading(prev => ({ ...prev, template: false }));
    }
  }, [quote.serviceType]);

  const handleAnalyzePricing = useCallback(async () => {
    if (quote.items.length === 0) {
      alert("Añada ítems a la cotización antes de analizar.");
      return;
    }
    setIsLoading(prev => ({ ...prev, analysis: true }));
    setAnalysisResult('');
    try {
      const result = await analyzePricing(quote.serviceType, quote.items);
      setAnalysisResult(result);
    } catch (error) {
      console.error("Error analyzing pricing:", error);
      alert("Hubo un error al analizar los precios.");
    } finally {
      setIsLoading(prev => ({ ...prev, analysis: false }));
    }
  }, [quote.items, quote.serviceType]);

  const updateItem = useCallback((id: string, updatedItem: Partial<LineItem>) => {
    setQuote(prev => ({
      ...prev,
      items: prev.items.map(item => item.id === id ? { ...item, ...updatedItem } : item)
    }));
  }, []);

  const addItem = useCallback(() => {
    setQuote(prev => ({
      ...prev,
      items: [...prev.items, { id: crypto.randomUUID(), description: '', quantityLabel: '', unitPrice: 0 }]
    }));
  }, []);

  const removeItem = useCallback((id: string) => {
    setQuote(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
  }, []);

  const totals = useMemo(() => {
    const subtotal = quote.items.reduce((acc, item) => acc + item.unitPrice, 0);
    const igv = subtotal * quote.igvRate;
    const total = subtotal + igv;
    return { subtotal, igv, total };
  }, [quote.items, quote.igvRate]);

  const handleExportPDF = async () => {
    const quoteElement = quoteRef.current;
    if (!quoteElement) return;

    setIsLoading(prev => ({ ...prev, pdf: true }));
    try {
      // Dynamic imports for client-side only libraries
      const { default: jsPDF } = await import('jspdf');
      const { default: html2canvas } = await import('html2canvas');

      const canvas = await html2canvas(quoteElement, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`cotizacion-${quote.client.name.replace(/\s/g, '_') || 'cliente'}.pdf`);
    } catch (error) {
      console.error("Error exporting PDF:", error);
      alert("Hubo un error al generar el PDF.");
    } finally {
      setIsLoading(prev => ({ ...prev, pdf: false }));
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Header />
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow">
            <CompanyInfoCard />
            <QuoteForm
              quote={quote}
              onInputChange={handleClientInputChange}
              onDescriptionChange={handleDescriptionChange}
              onSelectChange={handleSelectChange}
              onCheckboxChange={handleCheckboxChange}
              serviceTypes={SERVICE_TYPES}
              onDateChange={handleDateChange}
              onConditionsChange={handleConditionsChange}
            />
            <QuoteTable items={quote.items} onUpdateItem={updateItem} onRemoveItem={removeItem} onAddItem={addItem} />
            <QuoteTotals totals={totals} showIgv={quote.showIgv !== false} />
          </div>
          <div className="space-y-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Vista previa del documento</h2>
                <p className="text-sm text-slate-500">
                  Esta versión se exportará a PDF.
                </p>
              </div>
              <button
                onClick={handleExportPDF}
                disabled={isLoading.pdf}
                className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {isLoading.pdf ? 'Generando PDF...' : 'Descargar PDF'}
              </button>
            </div>
            <div ref={quoteRef}>
              <QuoteDocument quote={quote} totals={totals} />
            </div>
          </div>
        </div>
        <div className="lg:col-span-1">
          <GeminiPanel
            onGenerateTemplate={handleGenerateTemplate}
            onAnalyzePricing={handleAnalyzePricing}
            analysisResult={analysisResult}
            isLoading={isLoading}
          />
        </div>
      </main>
    </div>
  );
}
