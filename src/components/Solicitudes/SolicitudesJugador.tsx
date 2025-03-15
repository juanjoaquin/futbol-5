import axios from 'axios';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

// interface UsuarioProps {
//     id: number;
//     name: string;
//     email: string;
//     role: string;
// }

interface SolicitudProps {
    id: number;
    equipo_id: number;
    created_at: string;
    equipo_nombre: string;

}

export const SolicitudesJugador = () => {

    const [solicitudesJugador, setSolicitudesJugador] = useState<SolicitudProps[]>([]);
    const [usuario, setUsuario] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);


    const navigate = useNavigate();
    const token = localStorage.getItem('JWT');

    if (!token) {
        console.error("Token no encontrado. Asegúrate de haber iniciado sesión.");
        return;
    }

    useEffect(() => {


        const getUsuario = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(import.meta.env.VITE_ME, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                const userData = response.data;
                setUsuario(response.data);
                console.log(userData);

            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        }

        const getSolicitud = async () => {
            setIsLoading(true);

            if (!token) {
                setTimeout(() => {
                    navigate('/auth/login')
                }, 1000);
                return;
            }
            
            try {
                const response = await axios.get(import.meta.env.VITE_SOLICITUDES_JUGADOR, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setSolicitudesJugador(response.data.solicitudes);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        }
        getSolicitud();
        getUsuario();
    }, [token, navigate]);

    const handleResponderSolicitud = async (solicitudId: number, status: 'aceptada' | 'rechazada') => {
        const confirmacion = window.confirm(
            `¿Estás seguro de que quieres ${status === 'aceptada' ? 'aceptar' : 'rechazar'} esta solicitud?`
        );

        if (!confirmacion) return;

        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/responder-invitacion/${solicitudId}`, { status }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setSolicitudesJugador((prevSolicitudes) => prevSolicitudes.filter((soli) => soli.id !== solicitudId));

            if (status === 'aceptada') {
                setTimeout(() => {
                    navigate('/equipos');
                }, 1500);
            }
        } catch (error) {
            console.log(error)
        }
    }


    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-lime-400 mx-auto" />
                    <p className="mt-4 text-gray-400">Cargando invitaciones...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 min-h-screen bg-gray-900">
            <div className='mb-4'>
                <div className='flex items-center justify-between '>
                    <h1 className="text-3xl font-bold text-lime-300 mb-2">Invitaciones para unirse a equipos</h1>

                </div>
                <h3 className='text-sm text-gray-400'>Veras todas las solicitudes que te envían los equipos para que formes parte de ellos. Si decidis aceptar, te úniras automáticamente, y en caso de rechazar, se eliminará la notificación.</h3>
            </div>


            {solicitudesJugador.length === 0 ? (
                <p className="text-gray-500">No tienes solicitudes pendientes.</p>
            ) : (
                solicitudesJugador.map((soli) => (
                    <div key={soli.id} className="bg-gray-800 p-4 rounded-lg border border-gray-300/20 shadow-md mb-4">
                        <div className='space-y-4'>

                            <div className='flex items-center gap-2'>
                                <span className='text-sm text-gray-500'>Inivitación de </span>
                                <p className='text-lg text-lime-400 font-medium'>
                                    {soli.equipo_nombre}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">
                                    Invitación recibida el{' '}
                                    {new Date(soli.created_at).toLocaleDateString('es-ES', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </p>
                            </div>


                            <div className="mt-3 flex items-center justify-evenly gap-2">
                                <button
                                    className="bg-lime-500 text-gray-900 flex items-center gap-2 px-4 py-2 rounded-lg font-medium"
                                    onClick={() => handleResponderSolicitud(soli.id, 'aceptada')}
                                >
                                    <CheckCircle size={18} />
                                    Aceptar
                                </button>
                                <button
                                    className="bg-gray-700 text-gray-300 flex items-center gap-2 px-4 py-2 rounded-lg font-medium"
                                    onClick={() => handleResponderSolicitud(soli.id, 'rechazada')}
                                >
                                    <XCircle size={18} />
                                    Rechazar
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
