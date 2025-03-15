import axios from 'axios';
import React, { useEffect, useState } from 'react';
import cancha from '../../assets/images/equipo-component.jpg';
import EquipoList from './EquiposList';
import { CircleFadingPlus, Frown, LogOut, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

// interface EquipoProps {
//     id: number;
//     nombre: string;
//     leader_id: number;
//     maximo_jugadores: number;
//     status: string;
//     created_at: string;
//     path_image: string | null;
// }

interface EquipoProps {
    id: number;
    nombre: string;
    leader_id: number;
    maximo_jugadores: number;
    status: string;
    path_image: string | null;
    currentUserId: number;
    created_at: string;
    usuario: UsuarioProps;
}


interface UsuarioProps {
    id: number;
    name: string;
    email: string;
    role: string;
    equipos: EquipoProps[];
}


export const EquiposContainer = () => {
    const [equipos, setEquipos] = useState<EquipoProps[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [usuario, setUsuario] = useState<UsuarioProps | any>(null);

    const token = localStorage.getItem('JWT');

    useEffect(() => {
        document.title = "Equipos";

        if (!token) {
            setError('Debes estar logueado para acceder.');
            setIsLoading(false);
            return;
        }

        const getUser = async () => {
            try {
                const response = await axios.get(import.meta.env.VITE_ME, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const userData = response.data;
                setUsuario(userData);
                console.log(userData);
            } catch (error) {
                setError('Error al obtener el user');
                console.log(error);
            }
        }

        const getEquipos = async () => {

            try {
                const response = await axios.get(import.meta.env.VITE_EQUIPOS, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setEquipos(response.data.equipos);
                setError(null);

            } catch (error) {
                setError('Error al obtener los equipos.');
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        };
        getUser();
        getEquipos();
    }, []);

    const handleSalirEquipo = async (equipoId: number) => {
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/equipos/${equipoId}/salir`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            alert('Has salido del equipo');

            setUsuario((prevUsuario: UsuarioProps) => ({
                ...prevUsuario,
                equipos: prevUsuario.equipos.filter(equipo => equipo.id !== equipoId),
            }));
        } catch (error) {
            console.log(error)
        }
    }

    const equipoUsuario = usuario?.equipos?.length > 0 ? usuario.equipos[0] : null;



    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lime-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="bg-red-900/50 border border-red-500/50 text-red-200 p-4 rounded-lg">
                    {error}
                </div>
            </div>
        );
    }

    if (equipos.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-gray-400 text-lg">No hay equipos disponibles.</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 bg-gray-900">

            <div className='mb-4'>
                <div className='flex items-center justify-between '>
                    <h1 className="text-3xl font-bold text-lime-300 mb-2">Equipos</h1>

                    <Link to="/equipos/crear-equipo" title='Crear un nuevo equipo'>
                        <CircleFadingPlus size={24} className='text-lime-300' />

                    </Link>
                </div>
                <h3 className='text-sm text-gray-400'>Acá podrás ver todos los equipos que hay. Podes solicitar unirte para ser parte de uno, o podes crear tu propio equipo.</h3>
            </div>

            <div className="relative flex justify-center">
                <img
                    src={cancha}
                    className="w-full h-52 rounded-lg object-cover flex justify-center items-center"
                    alt="Fútbol"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-transparent"></div>
            </div>


            {equipoUsuario ? (
                <div className="mt-8">

                    <div className='mb-4 mt-4'>
                        <hr className='w-full text-gray-400/60 ' />
                    </div>
                    <div className='bg-gray-800/50 rounded-2xl overflow-hidden border border-lime-400/10'>

                        <div className="p-6">

                            <div className="space-y-2">
                                <h2 className="text-xl font-semibold text-lime-400">Tu equipo actual</h2>
                                <p className="text-gray-400 text-sm">
                                    Actualmente formas parte de {equipoUsuario.nombre}. Si deseas abandonar el equipo, asegúrate de estar seguro de tu decisión.
                                </p>
                            </div>

                            {/* Team Card */}
                            <div className="mt-4 bg-gray-800/80 rounded-xl p-4 border border-lime-400/5">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <img
                                            src={equipoUsuario.path_image || "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&auto=format&fit=crop&q=60"}
                                            alt={equipoUsuario.nombre}
                                            className="w-16 h-16 rounded-xl object-cover ring-2 ring-lime-400/20"
                                        />
                                        <div className="absolute -bottom-1 -right-1 bg-lime-400 w-4 h-4 rounded-full border-2 border-gray-800" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-lime-400">{equipoUsuario.nombre}</h3>
                                        <p className="text-sm text-gray-400">ID del equipo: #{equipoUsuario.id}</p>
                                    </div>


                                </div>
                            </div>

                            {/* Leave Button */}
                            <div className="mt-6">
                                <div className='flex items-center justify-between gap-2'>
                                    <div>
                                        <Link to={`/equipo/${equipoUsuario.id}`} className='px-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-400 
                                    rounded-xl py-3 font-medium transition-all duration-200 hover:border-blue-500/30
                                    flex items-center justify-center gap-2 group'>Ver mi equipo</Link>
                                    </div>

                                    <button
                                        onClick={() => {
                                            const confirmLeave = window.confirm('¿Estás seguro que deseas abandonar el equipo? En caso de que seas lider, se eliminará.');
                                            if (confirmLeave) {
                                                handleSalirEquipo(equipoUsuario.id);
                                            }
                                        }}
                                        className="px-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 
                                    rounded-xl py-3 font-medium transition-all duration-200 hover:border-red-500/30
                                    flex items-center justify-center gap-2 group"
                                    >
                                        
                                        Abandonar equipo
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className='mb-4 mt-4'>
                        <hr className='w-full text-gray-400/60 ' />
                    </div>
                </div>

            ) : (
                <div className="mt-8 text-center p-6 bg-gray-800/50 rounded-2xl border border-lime-400/10">

                    <Users className="w-12 h-12 text-lime-400/30 mx-auto mb-3" />
                    <p className="text-gray-400">
                        Aún no estás en un equipo. Únite a uno para jugar.
                    </p>
                </div>
            )}



            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                {equipos
                    .filter((equipo) => equipo.leader_id !== usuario?.id && equipo.id !== equipoUsuario?.id)
                    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                    .map((equipo) => (
                        <EquipoList
                            key={equipo.id}
                            id={equipo.id}
                            nombre={equipo.nombre}
                            leader_id={equipo.leader_id}
                            maximo_jugadores={equipo.maximo_jugadores}
                            status={equipo.status}
                            path_image={equipo.path_image}
                            created_at={equipo.created_at}
                            usuario={usuario}
                        />
                    ))}
            </div>
        </div>
    );
};
