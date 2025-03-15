import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Shield, Users, Trophy, LogIn, UserPlus2, Swords, ShieldHalf, Calendar as Calendar1 } from 'lucide-react';

interface UsuarioProps {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface EquipoProps {
    id: number;
    nombre: string;
    leader_id: number;
    maximo_jugadores: number;
    status: string;
    path_image: string | null;
    usuario: UsuarioProps;
    created_at: string;
}

const EquipoList: React.FC<EquipoProps> = ({ id, nombre, leader_id, maximo_jugadores, status, path_image, usuario, created_at}) => {

    const [jugadoresCount, setJugadoresCount] = useState<number>(0);
    const [isFull, setIsFull] = useState<boolean>(false);
    const [hasBeenChallenged, setHasBeenChallenged] = useState<boolean>(false);

    const navigate = useNavigate();
    const token = localStorage.getItem('JWT');

    useEffect(() => {
        const fetchJugadoresCount = async () => {
            try {
                const responseJugadores = await axios.get(`${import.meta.env.VITE_API_URL}/equipos/${id}/jugadores`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                setJugadoresCount(responseJugadores.data.count);
                setIsFull(responseJugadores.data.count >= maximo_jugadores);
            } catch (error) {
                console.log("Error fetching jugadores count", error);
            }
        }
        fetchJugadoresCount();
    }, [id, maximo_jugadores]);

    const handleSolicitarUnirse = async () => {
        try {
            if (!token) {
                setTimeout(() => {
                    navigate('/auth/login')
                }, 1000);
                return;
            }

            if (isFull) {
                alert('El equipo está lleno');
                return;
            }

            const response = await axios.post(`${import.meta.env.VITE_EQUIPOS}/${id}/solicitar`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            alert(response.data.message)
        } catch (error) {
            alert('Ya has envíado solicitud de unirte, o el equipo está completo');
        }
    }

    const handleDesafiarEquipo = async () => {
        try {
            if (!token) {
                setTimeout(() => {
                    navigate('/auth/login')
                }, 1000);
                return;
            }

            const confirmacion = window.confirm('¿Estás seguro de que deseas desafiar a este equipo?');

            if (!confirmacion) return;

            await axios.post(`${import.meta.env.VITE_API_URL}/desafios`, { equipo_visitante_id: id }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setHasBeenChallenged(true);
            alert('Has desafiado al equipo con éxito');
        } catch (error) {
            console.log(error);
            alert('Error al enviar la solicitud');
        }
    };

    return (
        <div className="relative bg-gray-800 rounded-2xl overflow-hidden">
            {/* Team Header Image */}
            <div className="h-32 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-800/90" />
                <img
                    src={path_image || "https://icdn.sempremilan.com/wp-content/uploads/2023/02/MilanTottenham_9b-min-630x394.jpg"}
                    alt={nombre}
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="relative -mt-16 px-6 pb-6">
                <div className="flex justify-between items-start">
                    <div className="bg-gray-700 p-2 rounded-xl border-4 border-gray-800">
                        <ShieldHalf className="w-12 h-12 text-lime-400" />
                    </div>
                    <Link
                        to={`/equipo/${id}`}
                        className="bg-gray-700/50 hover:bg-gray-700 transition-colors px-4 py-2 rounded-lg flex items-center gap-2 text-lime-400/80 hover:text-lime-400"
                    >
                        <LogIn size={18} />
                        <span className="text-sm font-medium">Ver equipo</span>
                    </Link>
                </div>

                <div className="mt-4">
                    <h2 className="text-2xl font-bold text-lime-400">{nombre}</h2>

                    <div className="mt-4 space-y-3">
                        <div className="flex items-center text-gray-300">
                            <Users className="w-5 h-5 mr-2 text-lime-400/70" />
                            <span className='text-gray-300'>Jugadores: <span className="text-lime-400">{jugadoresCount}/{maximo_jugadores}</span></span>
                        </div>
                        <div className="flex items-center text-gray-300">
                            <Trophy className="w-5 h-5 mr-2 text-lime-400/70" />
                            <span className='text-gray-300'>Estado: <span className={`${isFull ? 'text-red-600 font-medium' : 'text-green-600 font-medium'}`}>{isFull ? 'No disponible' : 'Disponible'}</span></span>
                        </div>

                        <div className="flex items-center text-gray-300">
                            <Calendar1 className="w-5 h-5 mr-2 text-lime-400/70" /> 
                            <div className='flex items-center gap-1'>
                            <span>Fundado: </span> 
                            <span className='text-gray-400'> {new Date(created_at).toLocaleDateString()} </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 space-y-3">
                    {usuario?.role !== 'leader' && (
                        <button
                            onClick={handleSolicitarUnirse}
                            className="w-full bg-lime-500 hover:bg-lime-600 transition-colors text-gray-900 rounded-xl py-2 font-semibold flex items-center justify-center gap-2"
                        >
                            <UserPlus2 size={20} />
                            Solicitar unirse
                        </button>
                    )}

                    {usuario?.role !== 'player' && (
                        <button
                            onClick={handleDesafiarEquipo}
                            disabled={hasBeenChallenged}
                            className={`w-full ${hasBeenChallenged 
                                ? 'bg-gray-500 cursor-not-allowed' 
                                : 'bg-gray-700 hover:bg-gray-600'
                            } transition-colors text-lime-400 rounded-xl py-3 font-semibold flex items-center justify-center gap-2`}
                        >
                            <Swords size={20} />
                            {hasBeenChallenged ? 'Equipo desafiado' : 'Desafiar equipo'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EquipoList;