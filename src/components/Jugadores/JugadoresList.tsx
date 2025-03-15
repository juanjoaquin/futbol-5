import React, { useState } from 'react';
import imagenPerfil from '../../assets/images/pelota-perfil.jpg';
import { Calendar, Mail } from 'lucide-react';
import axios from 'axios';

interface JugadorProps {
  id: number;
  name: string;
  email: string;
  created_at: string;
  path_image: string | null;
  role: string; 
  equipoId: number | null; 
}

export const JugadoresList: React.FC<JugadorProps> = ({ id, name, email, created_at, path_image, equipoId }) => {

  const [invitacionEnviada, setInvitacionEnviada] = useState<number[]>([]);

  const token = localStorage.getItem('JWT');

  const handleInvitarJugador = async (equipoId: number | null, userId: number) => {
    if (invitacionEnviada.includes(userId)) return;

    if (!token) {
      console.error('No hay token de autenticación.');
      alert('Por favor, inicia sesión.');
      return;
    }

    if (!equipoId) {
      console.error('El jugador no está asignado a un equipo.');
      alert('Este jugador no está asignado a un equipo.');
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/invitar-jugador/${equipoId}`,
        { user_id: userId }, { headers: { Authorization: `Bearer ${token}` } }
      );
      setInvitacionEnviada((prev) => [...prev, userId]);
      alert('Invitación enviada');
    } catch (error) {
      console.log(error);
      alert('FALLO al enviar invitación');
    }
  };

  console.log('Nombre:', name, 'Equipo:', equipoId);

  return (
    <div>
      <div className='bg-gray-800 p-4 border border-lime-300/20 rounded-lg shadow-lg'>
        <div className='flex items-center gap-4'>
          <img
            src={path_image || imagenPerfil}
            alt={name}
            className="w-10 h-10 object-cover rounded-full mb-4 opacity-80"
          />
          <p className='text-lg text-lime-300 font-semibold'>{name}</p>
        </div>
        <div className='flex gap-2 items-center'>
          <span className='text-lime-300 text-lg font-semibold'>ID</span><p className='text-gray-300'># {id}</p>
        </div>

        <div className='flex gap-2 items-center'>
          <span className='text-lime-300'><Mail size={16} /></span><p className='text-gray-300'>{email}</p>
        </div>

        <div className='flex gap-2 items-center'>
          <span className='text-lime-300'><Calendar size={16} /></span>
          <span className='text-gray-300'>
            {new Date(created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </span>
        </div>

        <div className="mt-4">
          <button
            onClick={() => handleInvitarJugador(equipoId, id)}
            className={`text-gray-900 font-semibold w-full py-1 rounded-lg ${invitacionEnviada.includes(id) ? 'bg-gray-500 cursor-not-allowed' : 'bg-lime-300 hover:bg-lime-400'
              }`}
            disabled={invitacionEnviada.includes(id)}
          >
            {invitacionEnviada.includes(id) ? 'Invitación enviada' : 'Enviar invitación'}
          </button>
        </div>
      </div>
    </div>
  );
};
