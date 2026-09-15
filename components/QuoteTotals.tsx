import { Totals } from '@/types';

type QuoteTotalsProps = {
  totals: Totals;
  showIgv?: boolean;
};

const currencyFormatter = new Intl.NumberFormat('es-PE', {
  style: 'currency',
  currency: 'PEN',
  minimumFractionDigits: 2,
});

const QuoteTotals = ({ totals, showIgv = true }: QuoteTotalsProps) => {
  return (
    <section className="mt-6 flex justify-end">
      <div className="w-full max-w-sm space-y-3 rounded-xl border border-slate-200 p-6 dark:border-slate-700 dark:bg-slate-900/20">
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span>Subtotal</span>
          <span className="font-semibold text-slate-800 dark:text-slate-100">
            {currencyFormatter.format(totals.subtotal)}
          </span>
        </div>
        {showIgv && (
          <div className="flex items-center justify-between text-sm text-slate-500">
            <span>IGV ({Math.round(totals.igv / (totals.subtotal || 1) * 100)}%)</span>
            <span className="font-semibold text-slate-800 dark:text-slate-100">
              {currencyFormatter.format(totals.igv)}
            </span>
          </div>
        )}
        <div className="flex items-center justify-between pt-2 text-lg font-semibold">
          <span>{showIgv ? 'Total' : 'Total SIN IGV'}</span>
          <span>{currencyFormatter.format(showIgv ? totals.total : totals.subtotal)}</span>
        </div>
      </div>
    </section>
  );
};

export default QuoteTotals;
