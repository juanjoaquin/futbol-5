import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import iconEquipo from '../../assets/images/icon-equipo.png';
import { CheckCircle2Icon, CircleUserRound, Clock, Shield, Shield as ShieldUser, UserCheck2, UsersRoundIcon } from 'lucide-react';

interface User {
    id: number;
    name: string;
}

interface EquipoDetailProps {
    id: number;
    nombre: string;
    leader_id: number;
    status: string;
    created_at: string;
    maximo_jugadores: number;
    leader: User;
    updated_at: string;
    path_image: string | null;
    jugadores: User[];
}

export const EquipoDetail = () => {
    const { id } = useParams();
    const [equipo, setEquipo] = useState<EquipoDetailProps | null>(null);

    useEffect(() => {
        const getEquipoById = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_EQUIPO_BY_ID}/${id}`);
                console.log('Response:', response.data);
                setEquipo(response.data.equipo);
            } catch (error) {
                console.log(error);
            }
        }
        getEquipoById();
    }, [id]);

    return (
        <div className="p-6 bg-gray-900 min-h-screen">
            <div>
                <h1 className="text-3xl font-bold text-lime-300 mb-4 flex items-center gap-2">
                    <Shield /> Detalles del Equipo
                </h1>
                <h3 className='text-sm text-gray-400 mb-4'>
                    Información detallada del equipo y sus integrantes.
                </h3>
            </div>

            <div className="bg-gray-800 border border-lime-300/20 rounded-xl shadow-lg">
                <div className="bg-gradient-to-r from-lime-700 to-lime-500 w-full rounded-t-xl">
                    <div className='flex items-center justify-center gap-4 pt-4'>
                        <img
                            src={equipo?.path_image || iconEquipo}
                            alt={equipo?.nombre}
                            className="w-20 h-20 object-cover rounded-lg mb-4 border-2 border-gray-200"
                        />
                        <h2 className="text-2xl font-semibold text-gray-200 mb-2">
                            {equipo?.nombre}
                        </h2>
                    </div>
                </div>

                <div>
                    <div className='px-6 mt-4 space-y-4'>
                        <p className='flex items-center gap-2 text-gray-300 font-semibold'>
                            <span className='flex items-center gap-2 text-gray-400 font-medium'>
                                <UserCheck2 className='text-lime-400' />
                                Lider:
                            </span>
                            {equipo?.leader?.name}
                        </p>

                        <p className='flex items-center gap-2 text-gray-300 font-semibold'>
                            <span className='flex items-center gap-2 text-gray-400 font-medium'>
                                <ShieldUser className='text-lime-400' />
                                Máximo jugadores:
                            </span>
                            {equipo?.maximo_jugadores}
                        </p>

                        <p className='flex items-center gap-2 text-gray-300 font-semibold'>
                            <span className='flex items-center gap-2 text-gray-400 font-medium'>
                                <Clock className='text-lime-400' />
                                Creado:
                            </span>
                            {equipo?.created_at ? new Date(equipo.created_at).toLocaleDateString() : 'Fecha no disponible'}
                        </p>
                    </div>

                    <div className='px-6 mt-4 mb-4'>
                        <div className='bg-gray-900 rounded-lg p-4'>
                            <div>
                                <h3 className='flex items-center gap-2 text-gray-300 font-medium'>
                                    <UsersRoundIcon className='text-lime-400' size={19}/>
                                    Integrantes del grupo ({equipo?.jugadores?.length || 0})
                                </h3>
                            </div>
                            {equipo?.jugadores && equipo.jugadores.length > 0 ? (
                                equipo.jugadores.map((jugador) => (
                                    <div key={jugador.id}>
                                        <div className='gap-2 space-y-2 mt-2 pt-2 pb-2 bg-gray-800 rounded-sm'>
                                            <p className='gap-2 space-y-2 flex items-center px-2 text-gray-300 font-medium'>
                                                <CircleUserRound className='text-lime-400' size={19} />
                                                {jugador.name}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-400 mt-2">No hay jugadores en este equipo</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}