import React from "react";

const AgregarRevista = () => {
 return (
  <div className="min-h-screen flex items-center justify-center bg-[#fefffe] px-4">
    <div className="bg-[#e3e3f1] p-8 shadow-md w-full my-4">
      <h1 className="text-2xl font-bold mb-8 text-[#111c85] text-center">AGREGAR  REVISTA</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Título</label>
            <input
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white"
              placeholder="Título de la Revista"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Link de la imagen</label>
            <input
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white"
              placeholder="Link de la imagen"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Fecha</label>
              <input
                type="date"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white"
              />
            </div>
          </div>

        </div>

        <div className="flex flex-col bg-white p-2 rounded-xl shadow h-full text-center border-2 border-gray-300 hover:border-gray-400 transition">
          <label className="text-sm text-gray-500">Portada</label>
          <div className="flex-1 w-full flex justify-center items-center overflow-hidden mt-4">
            <img
              src="https://via.placeholder.com/300x200"
              alt="preview"
              className="max-h-full object-contain rounded"
              style={{ maxHeight: '300px' }}
            />
          </div>
          <label className="cursor-pointer inline-block bg-gray-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-600 transition self-center mt-4">
            Seleccionar imagen
            <input type="file" accept="image/*" className="hidden" />
          </label>
        </div>
      </div>

      <div className="flex justify-between items-center mt-4 flex-wrap gap-2">
        <div className="flex gap-4">
          <button className="bg-[#111c85] text-white py-2 px-4 rounded-xl hover:bg-[#0b1460] transition inline-flex items-center gap-2">
            REGISTRAR REVISTA
          </button>
          <button className="bg-[#C62828] text-white py-2 px-4 rounded-xl hover:bg-[#9A1F1F] transition inline-flex items-center gap-2">
            LIMPIAR FORMULARIO
          </button>
        </div>

        <button className="bg-[#111c85] text-white py-2 px-4 rounded-xl hover:bg-[#0b1460] transition inline-flex items-center gap-2">
          VOLVER
        </button>
      </div>
    </div>
  </div>
);
};

export default AgregarRevista;
