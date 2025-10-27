import React, { useState, useMemo, useCallback, useRef } from 'react';
import { LineItem, Quote, ServiceType, ClientIndustry } from './types';
import { IGV_RATE, SERVICE_TYPES, CLIENT_INDUSTRIES } from './constants';
import QuoteForm from './components/QuoteForm';
import QuoteTable from './components/QuoteTable';
import QuoteTotals from './components/QuoteTotals';
import GeminiPanel from './components/GeminiPanel';
import { classifyProject, generateTemplateItems, analyzePricing } from './services/geminiService';

const App: React.FC = () => {
    const [quote, setQuote] = useState<Quote>({
        id: `COT-${Date.now()}`,
        client: { name: '', industry: ClientIndustry.OTRO },
        serviceType: ServiceType.OTRO,
        projectDescription: '',
        items: [],
        igvRate: IGV_RATE,
    });
    const [isLoading, setIsLoading] = useState<Record<string, boolean>>({
        classification: false,
        template: false,
        analysis: false,
    });
    const [analysisResult, setAnalysisResult] = useState<string>('');
    
    const quoteRef = useRef<HTMLDivElement>(null);

    const handleInputChange = useCallback((field: keyof Quote['client'] | 'projectDescription', value: string) => {
        if (field === 'projectDescription') {
            setQuote(prev => ({ ...prev, projectDescription: value }));
        } else {
            setQuote(prev => ({ ...prev, client: { ...prev.client, [field]: value } }));
        }
    }, []);

    const handleSelectChange = useCallback((field: 'serviceType' | 'industry', value: ServiceType | ClientIndustry) => {
        if (field === 'serviceType') {
            setQuote(prev => ({ ...prev, serviceType: value as ServiceType }));
        } else {
            setQuote(prev => ({ ...prev, client: { ...prev.client, industry: value as ClientIndustry } }));
        }
    }, []);
    
    const handleClassify = useCallback(async () => {
        if (!quote.projectDescription) return;
        setIsLoading(prev => ({ ...prev, classification: true }));
        try {
            const result = await classifyProject(quote.projectDescription, SERVICE_TYPES, CLIENT_INDUSTRIES);
            if (result.serviceType && Object.values(ServiceType).includes(result.serviceType as ServiceType)) {
                 setQuote(prev => ({ ...prev, serviceType: result.serviceType as ServiceType }));
            }
            if (result.clientIndustry && Object.values(ClientIndustry).includes(result.clientIndustry as ClientIndustry)) {
                setQuote(prev => ({ ...prev, client: { ...prev.client, industry: result.clientIndustry as ClientIndustry } }));
            }
        } catch (error) {
            console.error("Error classifying project:", error);
            alert("Hubo un error al clasificar el proyecto.");
        } finally {
            setIsLoading(prev => ({ ...prev, classification: false }));
        }
    }, [quote.projectDescription]);

    const handleGenerateTemplate = useCallback(async (prompt: string) => {
        if (!prompt) {
            alert("Por favor, ingrese el requerimiento del cliente para generar una plantilla.");
            return;
        }
        setIsLoading(prev => ({ ...prev, template: true }));
        try {
            const templateItems = await generateTemplateItems(prompt, quote.serviceType, quote.client.industry);
            setQuote(prev => ({...prev, items: templateItems.map(item => ({...item, id: crypto.randomUUID()}))}));
        } catch (error) {
            console.error("Error generating template:", error);
            alert("Hubo un error al generar la plantilla.");
        } finally {
            setIsLoading(prev => ({ ...prev, template: false }));
        }
    }, [quote.serviceType, quote.client.industry]);

    const handleAnalyzePricing = useCallback(async () => {
        if (quote.items.length === 0) {
            alert("Añada ítems a la cotización antes de analizar.");
            return;
        }
        setIsLoading(prev => ({ ...prev, analysis: true }));
        setAnalysisResult('');
        try {
            const result = await analyzePricing(quote.serviceType, quote.client.industry, quote.items);
            setAnalysisResult(result);
        } catch (error) {
            console.error("Error analyzing pricing:", error);
            alert("Hubo un error al analizar los precios.");
        } finally {
            setIsLoading(prev => ({ ...prev, analysis: false }));
        }
    }, [quote.items, quote.serviceType, quote.client.industry]);

    const updateItem = useCallback((id: string, updatedItem: Partial<LineItem>) => {
        setQuote(prev => ({
            ...prev,
            items: prev.items.map(item => item.id === id ? { ...item, ...updatedItem } : item)
        }));
    }, []);

    const addItem = useCallback(() => {
        setQuote(prev => ({
            ...prev,
            items: [...prev.items, { id: crypto.randomUUID(), description: '', quantity: 1, unitPrice: 0 }]
        }));
    }, []);

    const removeItem = useCallback((id: string) => {
        setQuote(prev => ({
            ...prev,
            items: prev.items.filter(item => item.id !== id)
        }));
    }, []);

    const totals = useMemo(() => {
        const subtotal = quote.items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
        const igv = subtotal * quote.igvRate;
        const total = subtotal + igv;
        return { subtotal, igv, total };
    }, [quote.items, quote.igvRate]);

    const handleExportPDF = async () => {
        // FIX: Cast window to any to access jspdf which is not declared in TypeScript's global types.
        const { jsPDF } = (window as any).jspdf;
        const quoteElement = quoteRef.current;
        if (!quoteElement) return;

        // FIX: Cast window to any to access html2canvas which is not declared in TypeScript's global types.
        const canvas = await (window as any).html2canvas(quoteElement, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`cotizacion-${quote.client.name.replace(/\s/g, '_') || 'cliente'}.pdf`);
    };

    return (
        <div className="min-h-screen text-slate-800 dark:text-slate-200 p-4 sm:p-6 lg:p-8 font-sans">
            <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Generador de Cotizaciones Cerezo</h1>
                            <p className="text-slate-500 dark:text-slate-400 mt-1">Crea, analiza y exporta cotizaciones con ayuda de IA.</p>
                        </div>
                         <button
                            onClick={handleExportPDF}
                            className="flex items-center gap-2 bg-green-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                            Exportar a PDF
                        </button>
                    </header>

                    <div ref={quoteRef} className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                         <div className="flex justify-between items-start pb-8 border-b-2 border-slate-200 dark:border-slate-700 mb-8">
                            <div>
                                <h2 className="text-2xl font-bold text-sky-600 dark:text-sky-400">Cerezo</h2>
                                <p className="text-slate-500 dark:text-slate-400">Musso y Huarcaya SAC - RUC 20609124734</p>
                                <p className="text-slate-500 dark:text-slate-400">hola@cerezoperu.com</p>
                            </div>
                            <div className="text-right">
                                <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300">COTIZACIÓN</h3>
                                <p className="text-slate-500 dark:text-slate-400">{quote.id}</p>
                                <p className="text-slate-500 dark:text-slate-400">Fecha: {new Date().toLocaleDateString('es-ES')}</p>
                            </div>
                        </div>
                        
                        <QuoteForm 
                            quote={quote}
                            onInputChange={handleInputChange}
                            onSelectChange={handleSelectChange}
                            onClassify={handleClassify}
                            isLoading={isLoading.classification}
                        />
                        <QuoteTable 
                            items={quote.items}
                            onUpdateItem={updateItem}
                            onAddItem={addItem}
                            onRemoveItem={removeItem}
                        />
                        <QuoteTotals totals={totals} igvRate={quote.igvRate} />
                    </div>
                </div>

                <aside className="lg:col-span-1">
                    <GeminiPanel
                        onGenerateTemplate={handleGenerateTemplate}
                        onAnalyzePricing={handleAnalyzePricing}
                        analysisResult={analysisResult}
                        isLoading={isLoading}
                        setAnalysisResult={setAnalysisResult}
                    />
                </aside>
            </main>
        </div>
    );
};

export default App;