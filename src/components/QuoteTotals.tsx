import React from 'react';

interface QuoteTotalsProps {
    totals: {
        subtotal: number;
        igv: number;
        total: number;
    };
    igvRate: number;
}

const QuoteTotals: React.FC<QuoteTotalsProps> = ({ totals, igvRate }) => {
    return (
        <div className="flex justify-end mt-8">
            <div className="w-full max-w-sm">
                <div className="flex justify-between py-2 text-slate-600 dark:text-slate-400">
                    <span>Subtotal:</span>
                    <span>{totals.subtotal.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
                </div>
                <div className="flex justify-between py-2 text-slate-600 dark:text-slate-400">
                    <span>IGV ({(igvRate * 100).toFixed(0)}%):</span>
                    <span>{totals.igv.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
                </div>
                <div className="flex justify-between py-3 text-xl font-bold text-slate-900 dark:text-white border-t-2 border-slate-200 dark:border-slate-600 mt-2">
                    <span>Total:</span>
                    <span>{totals.total.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
                </div>
            </div>
        </div>
    );
};

export default QuoteTotals;