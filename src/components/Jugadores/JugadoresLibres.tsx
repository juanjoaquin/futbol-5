import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { JugadoresList } from './JugadoresList';
import { Loader2 } from 'lucide-react';

interface JugadorProps {
  id: number;
  name: string;
  email: string;
  created_at: string;
  path_image: string | null;
  role: string;
  equipoId: number | null;
}

export const JugadoresLibres = () => {
  const [jugadoresLibres, setJugadoresLibres] = useState<JugadorProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState<any>(null);

  const token = localStorage.getItem('JWT');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/auth/login');
      return;
    }

    const getUsuario = async () => {
      try {
        const response = await axios.get(import.meta.env.VITE_ME, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });

        const userData = response.data;
        setUsuario({
          ...userData,
          equipoId: userData.equipos?.length > 0 ? userData.equipos[0].id : null,  
        });

        console.log('Usuario autenticado:', userData);
      } catch (error) {
        console.log(error);
      }
    };

    const getJugadores = async () => {
      try {
        const response = await axios.get(import.meta.env.VITE_JUGADORES_LIBRES, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setJugadoresLibres(response.data.jugadores_libres);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getUsuario();
    getJugadores();
  }, [token]);


  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
    );
  }


  return (
    <div className="p-6 flex flex-col gap-6 min-h-screen bg-gray-900">
      <div>
        <h1 className="text-3xl font-bold text-lime-300 mb-2">Jugadores libres</h1>
        <h3 className='text-sm text-gray-400'>
          Esta es una lista de los jugadores disponibles actualmente. Si sos líder del grupo, podés enviarles una invitación para que se unan a tu club.
        </h3>
      </div>

      {jugadoresLibres.length === 0 ? (
        <p className="text-gray-400 text-center mt-10">No hay jugadores libres en este momento.</p>
      ) : (
        jugadoresLibres
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .map((jugador) => (
            <JugadoresList
              key={jugador.id}
              id={jugador.id}
              name={jugador.name}
              email={jugador.email}
              path_image={jugador.path_image ?? null}
              created_at={jugador.created_at}
              role={jugador.role}
              equipoId={usuario?.equipoId}
            />
          ))
      )}
    </div>
  );
};
