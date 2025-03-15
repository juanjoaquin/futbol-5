import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Trophy, Users, Calendar, AlertCircle, LucideShieldBan } from 'lucide-react';

interface DesafioProps {
    id: string;
    equipo_local_id: number;
    equipo_visitante_id: number;
    status: string;
    created_at: string;
}

export const DesafiosAceptados = () => {
    const [desafios, setDesafios] = useState<DesafioProps[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const token = localStorage.getItem('JWT');
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            setTimeout(() => {
                navigate('/auth/login');
            }, 1000);
            return;
        }

        const getDesafios = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const response = await axios.get(import.meta.env.VITE_DESAFIOS_ACEPTADOS, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setDesafios(response.data.partidos);
            } catch (error) {
                setError('Error al cargar los desafíos. Por favor, intente nuevamente.');
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        getDesafios();
    }, [token, navigate]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-800">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-lime-500 mx-auto" />
                    <p className="mt-2 text-gray-600">Cargando desafíos...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center p-6 max-w-sm mx-auto">
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <p className="text-gray-800">{error}</p>
                </div>
            </div>
        );
    }

    if (desafios.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center p-6">
                    <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <div className="text-gray-500 text-lg">No hay desafíos aceptados</div>
                    <p className="text-gray-400 mt-2">Los desafíos aceptados aparecerán aquí</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">

                <div className='mb-4'>
                    <div className='flex items-center justify-between '>
                        <h1 className="text-3xl font-bold text-lime-300 mb-2">Desafios aceptados</h1>

                      
                    </div>
                    <h3 className='text-sm text-gray-400'>Esta es un historial de todos los desafios que aceptaste como lider del grupo. Los que estás por jugar, y los que ya jugaste.</h3>
                </div>
                <div className="space-y-4">
                    {desafios.map((desafio) => (
                        <div
                            key={desafio.id}
                            className="bg-gray-800 rounded-lg shadow-sm border border-lime-300/60 p-6 hover:shadow-md transition-shadow duration-200"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-2">
                                    <LucideShieldBan className="h-5 w-5 text-lime-500" />
                                    <span className="text-lg font-medium text-gray-300">
                                        {`Equipo ${desafio.equipo_local_id} vs Equipo ${desafio.equipo_visitante_id}`}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center  text-sm  justify-between">
                                
                                <time className='flex items-center text-gray-500' dateTime={desafio.created_at}>
                                <Calendar className="h-4 w-4 mr-1" />
                                    {new Date(desafio.created_at).toLocaleDateString('es-ES', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </time>
                                <div>
                                    <span className='bg-green-500/20 text-green-500 border-green-500/20 px-2 py-2 rounded-lg'>{desafio.status}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};