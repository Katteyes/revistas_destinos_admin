import React, { useState, useEffect } from 'react';
import type { User } from '../../types/User';
import UserModal from '../UserManagement/Components/UserModal';

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    // Simulación de carga
    setTimeout(() => {
      setUsers([
        {
          id: 1,
          full_name: 'Administrador General',
          username: 'admin01',
          email: 'admin@example.com',
          password: '12345',
          role: 'admin',
          status: 'activo',
          createdAt: '2024-06-01'
        },
        {
          id: 2,
          full_name: 'Editor Secundario',
          username: 'editor02',
          email: 'editor@example.com',
          password: '12345',
          role: 'editor',
          status: 'inactivo',
          createdAt: '2024-06-10'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleSaveUser = (user: User) => {
    if (user.id === 0) {
      const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
      setUsers([...users, { ...user, id: newId }]);
    } else {
      const updatedUsers = users.map(u => (u.id === user.id ? user : u));
      setUsers(updatedUsers);
    }

    setShowModal(false);
    setEditingUser(null);
  };

  return (
    <div className="min-h-screen px-6 py-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Saludo a la derecha */}
        <div className="flex justify-end mb-4">
          <div className="flex text-[17px] items-center gap-1.5 px-4 py-1.5 bg-white border-[#111C85] rounded-3xl border-[0.1rem] hover:bg-[#f8f0e3]/10 transition-all duration-300">
            <span className="text-[#111C85] font-semibold">Hola ...</span>
            <img
              src="/icons/user.svg"
              className="w-auto h-7 p-0.5 bg-[#111C85] rounded-full"
              alt="user"
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Botón agregar */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => {
              setEditingUser(null);
              setShowModal(true);
            }}
            className="flex items-center gap-2 bg-[#111C85] hover:bg-blue-800 text-white px-4 py-2 rounded-2xl transition"
          >
            <img
              src="/icons/addUser.svg"
              className="w-6 h-6"
              alt="icono usuario"
              aria-hidden="true"
            />
            Agregar Usuario
          </button>
        </div>

        {/* Tabla de usuarios */}
        {loading ? (
          <div className="text-center text-gray-600">Cargando usuarios...</div>
        ) : (
          <div className="w-full bg-[#E2E4F0] shadow-md rounded-sm pt-8">
            <h1 className="text-[26px] text-center font-extrabold text-[#111C85] mb-6">
              ADMINISTRAR USUARIOS
            </h1>

            <div className="overflow-x-auto">
              <table className="w-full text-center border-collapse table-auto bg-[#ffffff]">
                <thead className="bg-blue-900 text-white">
                  <tr>
                    <th className="px-6 py-3">Usuario</th>
                    <th className="px-6 py-3">Rol</th>
                    <th className="px-6 py-3">Estado</th>
                    <th className="px-6 py-3">Fecha de creación</th>
                    <th className="px-6 py-3">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id} className="hover:bg-[#f9f9f9]">
                      <td className="px-6 py-3">{user.username}</td>
                      <td className="px-6 py-3 capitalize">{user.role}</td>
                      <td className="px-6 py-3 capitalize">{user.status}</td>
                      <td className="px-6 py-3">{user.createdAt}</td>
                      <td className="px-6 py-3">
                        <div className="flex justify-center gap-2">
                          <button
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md text-sm"
                            onClick={() => {
                              setEditingUser(user);
                              setShowModal(true);
                            }}
                          >
                            Editar
                          </button>
                          <button className="bg-red-600 hover:bg-red-800 text-white px-3 py-1 rounded-md text-sm">
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Botón regresar */}
        <div className="flex justify-end mt-4">
          <button
            className="flex items-center gap-2 bg-[#111C85] hover:bg-blue-800 text-white px-4 w-auto py-2 rounded-2xl transition"
          >
            <img
              src="/icons/back.svg"
              className="w-6 h-6"
              alt="icono regresar"
              aria-hidden="true"
            />
            Regresar
          </button>
        </div>

        {/* Modal */}
        {showModal && (
          <UserModal
            user={editingUser}
            onClose={() => {
              setShowModal(false);
              setEditingUser(null);
            }}
            onSave={handleSaveUser}
          />
        )}
      </div>
    </div>
  );
}
