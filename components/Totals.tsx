const Totals = ({ items }) => {
  const subtotal = items.reduce((acc, item) => acc + item.quantity * item.price, 0);
  const igv = subtotal * 0.18;
  const total = subtotal + igv;

  return (
    <div className="mt-8 flex justify-end">
      <div className="w-full max-w-xs">
        <div className="flex justify-between text-lg">
          <p className="text-gray-400">Subtotal:</p>
          <p>S/. {subtotal.toFixed(2)}</p>
        </div>
        <div className="flex justify-between text-lg mt-2">
          <p className="text-gray-400">IGV (18%):</p>
          <p>S/. {igv.toFixed(2)}</p>
        </div>
        <div className="flex justify-between text-2xl font-semibold mt-4">
          <p>Total:</p>
          <p>S/. {total.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default Totals;
