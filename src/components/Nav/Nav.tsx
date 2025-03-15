import React, { useEffect, useState } from 'react'
import { authService } from '../../services/authService';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { AlignJustify, AppWindow, CircleUserRound, FileUserIcon, Home, LogOut, ReceiptText, ScanFace, ShieldHalf, Swords, UserRoundPlus, Users2, WrapTextIcon, X } from 'lucide-react';
import NotificacionIcon from '../../Widget/NotificacionIcon';


export const Nav = () => {
    const token = localStorage.getItem('JWT');

    const [menuOpen, setMenuOpen] = useState(false);
    const toggleMenu = () => setMenuOpen(!menuOpen);
    const [user, setUser] = useState<any>(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            if (!token) return;
            try {
                const userData = await authService();
                setUser(userData);
            } catch (error) {
                console.log(error)
            }
        }
        fetchUser();
    }, [token])

    const handleLogout = async () => {
        if (!token) return;

        try {
            await axios.post(import.meta.env.VITE_LOGOUT, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            localStorage.removeItem('JWT');
            setUser(null);
            setTimeout(() => {
                navigate('/')
            }, 1000);
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <nav className='bg-gray-800 px-6 py-4 w-full z-50'>
            <div className='flex items-center justify-between'>
                <h2 className="text-gray-200 text-xl">
                    <Link to="/" className='flex items-center gap-2 font-semibold text-lime-300'>
                        Fútbol 5
                    </Link>


                </h2>

                <div className='flex items-center'>
                    <div className='relative flex items-center'>

                        <div className='text-white '>
                       
                               {user ? (<NotificacionIcon/>) : ''} 

                        </div>

                        <button onClick={toggleMenu}
                            className="text-lime-300 hover:text-lime-400 transition-colors p-2 rounded-full hover:bg-lime-700 cursor-pointer">
                            <AlignJustify />
                        </button>

                    </div>
                </div>
            </div>

            <div
                className={`fixed top-0 left-0 h-full w-full bg-gray-800 text-white transform ${menuOpen ? 'translate-y-0' : '-translate-y-full'} transition-transform duration-300 ease-in-out shadow-lg z-60`}>
                <div className='flex justify-between items-center p-6 border-gray-700'>
                    <h3 className='text-lg font-semibold text-lime-500'>Menú</h3>
                    <button
                        onClick={toggleMenu}
                        className="text-lime-500 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-700"
                    >
                        <X />
                    </button>
                </div>
                <ul className='p-6 space-y-2'>
                    <li onClick={toggleMenu}>
                        {user ? (
                            <>
                                <div className='flex justify-between'>

                                    <span className="flex items-center gap-2 mb-4 text-gray-100">
                                        <CircleUserRound className='text-lime-400' size={18} /> Hola {user.name}
                                    </span>

                                    <span className="flex items-center gap-2 mb-4 text-gray-300">
                                        <FileUserIcon className='text-lime-400' size={18} />Rol  {user.role}
                                    </span>

                                </div>
                                <div className='flex flex-col space-y-2'>
                                    <span onClick={toggleMenu} className="cursor-pointer flex items-center  gap-2 hover:text-gray-300 transition-colors">
                                        <Home size={20} className='text-lime-400' /><Link to='/' className='text-gray-300'>Home</Link>
                                    </span>

                                    <span onClick={toggleMenu} className="cursor-pointer flex items-center gap-2 hover:text-gray-300 transition-colors">
                                        <ShieldHalf size={20} className='text-lime-400' /><Link to='/equipos' className='text-gray-300'>Equipos</Link>
                                    </span>
                                    <span onClick={toggleMenu} className="cursor-pointer flex items-center gap-2 hover:text-gray-300 transition-colors">
                                        <Users2 size={20} className='text-lime-400' /><Link to='/jugadores/jugadores-libres' className='text-gray-300'>Jugadores libres</Link>
                                    </span>

                                    <span onClick={toggleMenu} className="cursor-pointer flex items-center gap-2 hover:text-gray-300 transition-colors">
                                        <Swords size={20} className='text-lime-400' /><Link to='/desafios' className='text-gray-300'>Desafios</Link>
                                    </span>

                                    <span onClick={toggleMenu} className="cursor-pointer flex items-center gap-2 hover:text-gray-300 transition-colors">
                                        <AppWindow size={20} className='text-lime-400' /><Link to='/muro' className='text-gray-300'>Muro</Link>
                                    </span>

                                    <span onClick={toggleMenu} className="cursor-pointer flex items-center gap-2 hover:text-gray-300 transition-colors">
                                        <ReceiptText size={20} className='text-lime-400'/><Link to='/solicitudes' className='text-gray-300'>Solicitudes (Leader)</Link>
                                    </span>

                                    <span onClick={toggleMenu} className="cursor-pointer flex items-center gap-2 hover:text-gray-300 transition-colors">
                                        <WrapTextIcon size={20} className='text-lime-400'/><Link to='/solicitudes/jugador' className='text-gray-300'>Solicitudes (Jugador)</Link>
                                    </span>


                                    <button
                                        onClick={() => { handleLogout(); setMenuOpen(false) }}
                                        className='flex items-center gap-2 mt-4  text-sm text-gray-300 hover:bg-gray-600 transition-colors'
                                    >
                                        <LogOut className='text-lime-500' size={18} /> Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className='flex flex-col space-y-4'>
                                    <Link to='auth/login' className='flex items-center gap-2'>
                                        <ScanFace className='text-lime-400' size={22} /> <span className='text-gray-300 '>Iniciar sesión</span>
                                    </Link>

                                    <Link to='auth/register' className='flex items-center gap-2'>
                                        <UserRoundPlus className='text-lime-400' size={22} /> <span className='text-gray-300 '>Registrarse</span>
                                    </Link>
                                </div>
                            </>
                        )}
                    </li>
                </ul>
            </div>
        </nav>
    );
};
