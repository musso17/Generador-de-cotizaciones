import { Quote, Totals } from '@/types';

type QuoteDocumentProps = {
  quote: Quote;
  totals: Totals;
};

const currencyFormatter = new Intl.NumberFormat('es-PE', {
  style: 'currency',
  currency: 'PEN',
  minimumFractionDigits: 2,
});

const QuoteDocument = ({ quote, totals }: QuoteDocumentProps) => {
  return (
    <div className="rounded-3xl bg-white p-8 text-slate-900 shadow-2xl">
      <header className="flex flex-col gap-6 border-b border-slate-200 pb-6 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-2xl font-bold tracking-tight">Cerezo Films</p>
          <p className="text-sm text-slate-500">Musso y Huarcaya SAC · RUC 20609124734</p>
          <p className="text-sm text-slate-500">hola@cerezoperu.com</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-semibold tracking-[0.3em] text-slate-400">COTIZACIÓN</p>
          <p className="text-xl font-bold text-slate-900">RUC 20609124734</p>
          <p className="text-sm text-slate-500">
            Fecha:{' '}
            {new Date(quote.date + 'T00:00:00').toLocaleDateString('es-PE', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>
      </header>

      <section className="mt-6 grid gap-4 rounded-2xl border border-slate-200 p-6 md:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Cliente</p>
          <p className="text-lg font-semibold text-slate-900">
            {quote.client.name || '—'}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Proyecto</p>
          <p className="text-base font-semibold text-slate-900">
            {quote.projectDescription || 'Descripción pendiente'}
          </p>
          <p className="text-sm text-slate-500">{quote.serviceType}</p>
        </div>
      </section>

      <section className="mt-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Servicios
        </p>
        <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">
                  Descripción
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">
                  Cantidad / entregable
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide">
                  S/.
                </th>
              </tr>
            </thead>
            <tbody>
              {quote.items.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-4 py-6 text-center text-sm text-slate-500"
                  >
                    No hay ítems en la cotización.
                  </td>
                </tr>
              ) : (
                quote.items.map((item) => (
                  <tr key={item.id} className="border-t border-slate-100">
                    <td className="px-4 py-4 text-sm font-medium text-slate-900 truncate max-w-xs">
                      {item.description || '—'}
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-600">
                      {item.quantityLabel?.trim() || '—'}
                    </td>
                    <td className="px-4 py-4 text-right text-sm font-semibold text-slate-900">
                      {currencyFormatter.format(item.unitPrice)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-6 flex flex-col gap-4 rounded-2xl border border-slate-200 p-6">
        <div className="flex justify-between text-sm text-slate-500">
          <span>Subtotal</span>
          <span className="font-semibold text-slate-900">
            {currencyFormatter.format(totals.subtotal)}
          </span>
        </div>
        {quote.showIgv !== false && (
          <div className="flex justify-between text-sm text-slate-500">
            <span>IGV (18%)</span>
            <span className="font-semibold text-slate-900">
              {currencyFormatter.format(totals.igv)}
            </span>
          </div>
        )}
        <div className="flex justify-between border-t border-slate-200 pt-4 text-lg font-semibold text-slate-900">
          <span>{quote.showIgv !== false ? 'Total + IGV' : 'Total SIN IGV'}</span>
          <span>{currencyFormatter.format(quote.showIgv !== false ? totals.total : totals.subtotal)}</span>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-slate-200 p-6 text-sm text-slate-600">
        <p className="font-semibold text-slate-800">Condiciones comerciales</p>
        <ul className="mt-3 list-disc pl-4 space-y-1">
          {quote.conditions.map((condition, index) => (
            <li key={index}>{condition}</li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default QuoteDocument;
