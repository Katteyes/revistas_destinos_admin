import { useState, useEffect } from 'react';
import type { User } from '../../../types/User';

interface Props {
  user: User | null;
  onClose: () => void;
  onSave: (user: User) => void;
}

export default function UserModal({ user, onClose, onSave }: Props) {
  const [formData, setFormData] = useState<User>({
    id: 0,
    full_name: '',
    username: '',
    email: '',
    password: '',
    role: 'editor',
    status: 'activo',
    createdAt: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData(user);
    } else {
      setFormData({
        id: 0,
        full_name: '',
        username: '',
        email: '',
        password: '',
        role: 'editor',
        status: 'activo',
        createdAt: '',
      });
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.7)] flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-8 text-center">
          {user ? 'Editar Usuario' : 'Agregar Usuario'}
        </h2>

        <div className="space-y-4">
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            placeholder="Nombre completo"
            className="w-full border border-zinc-500 px-3 py-3 rounded-2xl"
            required
          />
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Usuario"
            className="w-full border border-zinc-500 px-3 py-3 rounded-2xl"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Correo electrónico"
            className="w-full border border-zinc-500 px-3 py-3 rounded-2xl"
            required
          />

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Contraseña"
              className="w-full border border-zinc-500 px-3 py-3 rounded-2xl pr-10"
              required
            />
            <img
              src={showPassword ? '/icons/eye.svg' : '/icons/eyeOff.svg'}
              alt="toggle password"
              className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full border border-zinc-500 px-3 py-3 rounded-2xl"
          >
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
          </select>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border border-zinc-500 px-3 py-3 rounded-2xl"
          >
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
        </div>

        <div className="flex justify-end mt-5 space-x-3">
          <button
            onClick={onClose}
            className="text-gray-600 px-4 py-2 rounded-2xl hover:bg-gray-100 transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="bg-[#111C85] text-white px-4 py-2 rounded-2xl hover:bg-blue-900 transition"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
