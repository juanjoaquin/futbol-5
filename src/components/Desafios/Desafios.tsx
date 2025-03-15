import axios from 'axios';
import { ArrowUpRightFromSquareIcon, Calendar, Clock, Info } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom';

interface DesafioProps {
    id: number;
    equipo_local_id: number;
    equipo_visitante_id: number;
    status: string;
    created_at: string;
}


export const Desafios = () => {

    const [desafiosPendientes, setDesafiosPendientes] = useState<DesafioProps[]>([]);
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

        const getDesafios = async () => {
            try {
                const response = await axios.get(import.meta.env.VITE_DESAFIOS_PENDIENTES, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                setDesafiosPendientes(response.data.partidos);
            } catch (error) {
                console.log(error);
            }
        }
        getUsuario();
        getDesafios();
    }, []);

    const handleGestionarDesafio = async (partidoId: number, status: string) => {
        const confirmacion = window.confirm(
            `¿Estás seguro de que queres ${status === 'aceptado' ? 'aceptar' : 'rechazar'} este desafío?`
        );

        if (!confirmacion) return;

        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/desafios/${partidoId}`, { status }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setDesafiosPendientes((prev) => prev.filter((desafio) => desafio.id !== partidoId));
        } catch (error: any) {
            console.log(error);
            alert(error.response?.data?.message || 'Error al procesar el desafío');
        }
    };



    return (
        <div className='p-6 min-h-screen bg-gray-900'>
            <div>
                <h1 className="text-3xl font-bold text-lime-300 mb-2">Desafios</h1>
                <h3 className='text-sm text-gray-400'>
                    En caso de ser lider de un grupo, te aparecerá una lista de aquellos equipos que quieran jugarte un partido. Estos los podrás rechazar, o aceptar.
                </h3>
                <Link className='text-sm text-lime-300 flex items-center gap-2' to='/desafios/aceptados'>
                    Ver desafios aceptados
                    <ArrowUpRightFromSquareIcon size={18}/>
                </Link>
            </div>

            {usuario?.role === 'leader' ? (
                desafiosPendientes.length > 0 ? (
                    desafiosPendientes.map((desafio) => (
                        <div key={desafio.id}>
                            <div className='bg-gray-800 border border-lime-300/40  gap-2 rounded-lg p-4 mt-4'>

                                <div className='flex items-center gap-3'>
                                    <Info size={20} className='text-lime-400' />
                                    <p className='text-gray-300'>Desafío #{desafio.id}</p>
                                </div>

                                <div className="flex items-center justify-center gap-6 mt-4 ">
                                    <div>
                                        <p className="text-gray-400 text-sm ">Tú equipo</p>
                                        <p className="text-gray-100 font-semibold text-center mt-2 bg-lime-500/70 rounded-full">#{desafio.equipo_local_id}</p>
                                    </div>
                                    <div className="text-gray-600">vs</div>
                                    <div>
                                        <p className="text-gray-400 text-sm">Equipo rival</p>
                                        <p className="text-gray-100 font-semibold text-center mt-2 bg-blue-500/70 rounded-full">#{desafio.equipo_visitante_id}</p>
                                    </div>
                                </div>

                                <div className='flex justify-center items-center gap-8 mt-6'>

                                    <div className="flex items-center gap-2 text-gray-400 ">
                                        <Calendar className="w-4 h-4 text-lime-400" />
                                        <span className="text-sm">
                                            {new Date(desafio.created_at).toLocaleDateString()}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 text-gray-400 ">
                                        <Clock className="w-4 h-4 text-lime-400" />
                                        <span className="text-sm text-yellow-400">
                                            {desafio.status === 'pendiente' ? 'Pendiente' : desafio.status === 'aceptado' ? 'Aceptado' : ''}
                                        </span>
                                    </div>
                                </div>


                                <div className='mt-4 flex justify-evenly'>

                                    <button
                                        className="bg-green-700 text-gray-300 font-medium px-3 py-1 rounded mx-2"
                                        onClick={() => handleGestionarDesafio(desafio.id, 'aceptado')}
                                    >
                                        Aceptar
                                    </button>

                                    <button
                                        className="bg-red-700 text-gray-300 font-medium px-3 py-1 rounded mx-2"
                                        onClick={() => handleGestionarDesafio(desafio.id, 'rechazado')}
                                    >
                                        Rechazar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className=' py-2 px-2'>
                        <h3 className='text-xl text-lime-300/90 '>No tienes desafíos pendientes</h3>
                        <h4 className='mt-2 text-gray-300'>Puede ser que ya hayas aceptado, o no has recibido solicitudes.</h4>
                        <div className='mt-6 text-center'>

                            <Link to="/equipos" className='px-2 py-2 bg-lime-300/80 rounded-sm text-gray-700 font-medium'>Volver a equipos</Link>
                        </div>
                    </div>
                )
            ) : usuario?.role === 'player' ? (
                <div className=' py-2 px-2'>
                    <h3 className='text-xl text-lime-300/90 '>No podes tener desafios</h3>
                    <h4 className='mt-2 text-gray-300'>Actualmente sos un usuario, necesitas ser lider de grupo para tener desafios.</h4>
                </div>
            ) : (
                <div>
                    <p>Cargando usuario...</p>
                </div>
            )}
        </div>
    );
}
