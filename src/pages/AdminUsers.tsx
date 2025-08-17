import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import UserModal from "../components/UsersPage/UserModal";

export interface User {
  id: number;
  full_name: string;
  username: string;
  email: string;
  role: "admin" | "editor";
  password?: string;
  last_login?: string;
  status?: "activo" | "inactivo";
  createdAt?: string;
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    const cachedUsers = localStorage.getItem('cachedUsers');
    const cachedTime = localStorage.getItem('cacheTimeUsers');

    const isExpired = !cachedTime || (Date.now() - parseInt(cachedTime)) > 24 * 60 * 60 * 1000;

    if (cachedUsers && !isExpired) {
        setUsers(JSON.parse(cachedUsers));
        setLoading(false); 
    } else {
        fetch(`${import.meta.env.VITE_API_URL}/users`)
            .then(res => res.json())
            .then(data => {
              const usuarios = Array.isArray(data) ? data : data.data || [];
                setUsers(usuarios);
                localStorage.setItem('cachedUsers', JSON.stringify(usuarios));
                localStorage.setItem('cacheTimeUsers', Date.now().toString());
            })
            
            .catch(err => console.error(err))
            .finally(() => setLoading(false)); 
    }
  }, []);

  // Guardar o editar usuario
  const handleSaveUser = (user: User) => {
    const method = user.id === 0 ? "POST" : "PUT";
    const url =
      user.id === 0
        ? `${import.meta.env.VITE_API_URL}/users`
        : `${import.meta.env.VITE_API_URL}/users/${user.id}`;

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al guardar el usuario");
        return res.json();
      })
      .then((savedUser: User) => {
        if (user.id === 0) {
          setUsers([...users, savedUser]);
        } else {
          setUsers(users.map((u) => (u.id === savedUser.id ? savedUser : u)));
        }
        setShowModal(false);
        setEditingUser(null);
        Swal.fire("Éxito", "Usuario guardado correctamente", "success");
      })
      .catch((err) => {
        console.error(err);
        Swal.fire("Error", "No se pudo guardar el usuario", "error");
      });
  };

  // Eliminar usuario
  const handleDeleteUser = (id: number) => {
    Swal.fire({
      title: "¿Eliminar usuario?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#C62828",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, eliminar",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`${import.meta.env.VITE_API_URL}/users/${id}`, {
          method: "DELETE",
        })
          .then((res) => {
            if (!res.ok) throw new Error("Error al eliminar");
            setUsers(users.filter((u) => u.id !== id));
            Swal.fire("Eliminado", "Usuario eliminado con éxito", "success");
          })
          .catch((err) => {
            console.error(err);
            Swal.fire("Error", "No se pudo eliminar el usuario", "error");
          });
      }
    });
  };

  return (
    <div className="min-h-screen px-6 py-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">       

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
            />
            Agregar Usuario
          </button>
        </div>

        {/* Tabla */}
        {loading ? (
          <div className="text-center text-gray-600">
            Cargando usuarios...
          </div>
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
                  {users.map((user) => (
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
                          <button
                            className="bg-red-600 hover:bg-red-800 text-white px-3 py-1 rounded-md text-sm"
                            onClick={() => handleDeleteUser(user.id)}
                          >
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

        <div className="flex justify-end mt-4">
          <button className="flex items-center gap-2 bg-[#111C85] hover:bg-blue-800 text-white px-4 py-2 rounded-2xl transition">
            <img
              src="/icons/back.svg"
              className="w-6 h-6"
              alt="icono regresar"
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
