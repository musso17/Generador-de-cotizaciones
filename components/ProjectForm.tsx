const ProjectForm = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
      <div>
        <label htmlFor="clientName" className="block text-sm font-medium text-gray-400">Nombre del Cliente</label>
        <input
          type="text"
          id="clientName"
          className="mt-1 block w-full bg-gray-grafito-light border-gray-600 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"
        />
      </div>
      <div>
        <label htmlFor="projectDescription" className="block text-sm font-medium text-gray-400">Descripción del Proyecto</label>
        <input
          type="text"
          id="projectDescription"
          placeholder="Ej: Video corporativo para redes sociales"
          className="mt-1 block w-full bg-gray-grafito-light border-gray-600 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"
        />
      </div>
      <div>
        <label htmlFor="serviceType" className="block text-sm font-medium text-gray-400">Tipo de Servicio</label>
        <select
          id="serviceType"
          className="mt-1 block w-full bg-gray-grafito-light border-gray-600 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"
        >
          <option>Producción</option>
          <option>Postproducción</option>
          <option>Pack de Contenido</option>
          <option>Evento</option>
          <option>Otro</option>
        </select>
      </div>
    </div>
  );
};

export default ProjectForm;
