import axios from 'axios';
import { Check, X, Users, UserPlus, Mail, Crown, Clock, Loader2, UserX, ShieldHalf } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface SolicitudProps {
    id: number;
    equipo_id: number;
    equipo_nombre: string;
    created_at: string;
    user: {
        id: number;
        name: string;
        email: string;
        role: string;
    }
}

export const Solicitudes = () => {
    const [solicitudes, setSolicitudes] = useState<SolicitudProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [usuario, setUsuario] = useState<any>(null);
    

    const token = localStorage.getItem('JWT');
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            setTimeout(() => {
                navigate('/auth/login')
            }, 1000);
        }

        const getUsuario = async () => {
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
            }
        }

        const getSolicitudes = async () => {
            try {
                
                const response = await axios.get(import.meta.env.VITE_SOLICITUDES_LIDER, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setSolicitudes(response.data.solicitudes);
            } catch (error) {
                console.log('No se pueden obtener solicitudes');
            } finally {
                setLoading(false);
            }
        }
        getSolicitudes();
        getUsuario();
    }, []);

    const responderSolicitud = async (solicitudId: number, status: 'aceptada' | 'rechazada') => {
        try {
            console.log(`${import.meta.env.VITE_API_URL}/responder-invitacion/${solicitudId}`);

            await axios.post(
                `${import.meta.env.VITE_API_URL}/responder-invitacion/${solicitudId}`,
                { status },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert(`Solicitud ${status === 'aceptada' ? 'aceptada' : 'rechazada'} correctamente`);
            setSolicitudes(prev => prev.filter(s => s.id !== solicitudId));

        } catch (error) {
            console.log(error);
            alert('Error al procesar la solicitud');
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-lime-300 flex items-center gap-2">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span className="text-lg">Cargando solicitudes...</span>
                </div>
            </div>
        );
    }

    if (usuario?.role === 'player') {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-lime-300 flex items-center gap-2">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span className="text-lg">Cargando solicitudes...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 p-6 md:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-3 mb-4">
                    <UserPlus className="w-8 h-8 text-lime-300" />
                    <h1 className="text-2xl  font-bold text-white">Solicitudes Pendientes</h1>
                    
                </div>
                <div>
                <h3 className='text-sm text-gray-400 mb-4'>Acá veras la lista de usuarios que desean unirse a tu equipo. Vos decidis si queres aceptar o rechazar. En caso de aceptar, automáticamente se úniran a tu club, sino, se borrara la solicitud.</h3>

                </div>

                {solicitudes.length > 0 ? (
                    <div className="grid gap-6">
                        {solicitudes.map((solicitud) => (
                            <div
                                key={solicitud.id}
                                className="bg-gray-800 border border-lime-300/30 rounded-xl p-6 shadow-lg hover:border-lime-300/50 transition-colors"
                            >
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <ShieldHalf className="w-5 h-5 text-lime-300" />
                                            <span className="text-gray-400">Solicitud para</span>
                                            <span className="text-white font-semibold">{solicitud.equipo_nombre}</span>
                                        </div>

                                        {solicitud.user && (
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-white">
                                                    <UserPlus className="w-4 h-4 text-yellow-500" />
                                                    <span className="font-medium">{solicitud.user.name}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-400">
                                                    <Mail className="w-4 h-4" />
                                                    <span>{solicitud.user.email}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-400">
                                                    <Clock className="w-4 h-4" />
                                                    <span className="text-sm">
                                                        {new Date(solicitud.created_at).toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => responderSolicitud(solicitud.id, 'aceptada')}
                                            className="flex items-center gap-2 px-4 py-2 bg-green-700 hover:bg-green-600 text-gray-100 font-medium rounded-lg transition-colors"
                                        >
                                            <Check className="w-5 h-5" />
                                            <span>Aceptar</span>
                                        </button>
                                        <button
                                            onClick={() => responderSolicitud(solicitud.id, 'rechazada')}
                                            className="flex items-center gap-2 px-4 py-2 bg-red-700 hover:bg-red-600 text-gray-100 font-medium rounded-lg transition-colors"
                                        >
                                            <X className="w-5 h-5" />
                                            <span>Rechazar</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-gray-800/50 rounded-xl p-8 text-center">
                        <UserX className="w-16 h-16 text-lime-300/30 mx-auto mb-4" />
                        <h3 className="text-xl text-lime-300/90 font-semibold mb-2">
                            No hay solicitudes pendientes
                        </h3>
                        <p className="text-gray-400">
                            No tienes solicitudes de jugadores para unirse a tu equipo en este momento.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Solicitudes;