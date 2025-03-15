import axios from 'axios';
import { Info } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

interface NotiProps {
    id: number;
    tipo: string;
    created_at: string;
    mensaje: string;
}

export const Notificaciones = () => {

    const [notificaciones, setNotificaciones] = useState<NotiProps[]>([]);
    const navigate = useNavigate();

    const token = localStorage.getItem('JWT');

    useEffect(() => {
        if (!token) {
            setTimeout(() => {
                navigate('/auth/login')
            }, 1000);
        }
        const getNoti = async () => {
            try {
                const reponse = await axios.get(import.meta.env.VITE_NOTIFICACIONES, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setNotificaciones(reponse.data.notificaciones);
            } catch (error) {
                console.log(error)
            }
        }
        getNoti();
    }, [])

    return (
        <div className='p-6 bg-gray-900 min-h-screen'>
            <div>
                <h1 className="text-3xl font-bold text-lime-300 mb-2">Notificaciones</h1>
                <h3 className='text-sm text-gray-400'>Estás son las notificaciones que tienes.</h3>

            </div>
            <div className='mt-4'>

                {notificaciones.length > 0 ? (
                    notificaciones.map((noti) => (
                        <div key={noti.id} className="border p-2 mb-2 rounded-lg bg-gray-800 shadow-lg">
                            <div className='flex items-center gap-2'>
                                <Info size={20} className='text-lime-300 font-semibold' />

                                <span className='text-lime-300  font-semibold '>
                                    {noti.tipo === 'solicitud_unirse' ? 'Solicitud Unirse' : noti.tipo === 'aceptacion_solicitud' ? 'Aceptación de solicitud' : noti.tipo === 'desafio' ? 'Desafio' : ''}

                                </span>

                            </div>

                            <div className='mt-2 px-2'>
                                <p className='text-gray-200'>{noti.mensaje}</p>

                            </div>

                            <div className='mt-2 px-2'>
                                <span className='text-sm text-gray-400'> {new Date(noti.created_at).toLocaleString()}</span>

                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-400">No tienes notificaciones.</p>
                )}
            </div>
        </div>
    )
}
