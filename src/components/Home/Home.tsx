import React from 'react'
import imageHome from '../../assets/images/futbol-home.jpg'
import { Link } from 'react-router-dom';

export const Home = () => {
  return (
    <div className="h-screen flex flex-col">
      <div className="relative">
        <img src={imageHome} className="w-full h-full object-cover" alt="Fútbol" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
      </div>

      <div className="flex-1 bg-gray-900 p-6">
        <div>
          <h1 className='text-gray-300 text-3xl max-w-64'>
            Armá tu equipo, unite, desafiá a otros y competí
          </h1>
          <h3 className='text-gray-400 text-sm text-start mt-4 '>
            La aplicación de Fútbol 5 donde vas a poder armar tú equipo, invitar personas a jugar, y desafiar a otros equipos.
          </h3>

          <div className='mt-4'>
            <div className='w-full  bg-lime-300 rounded-lg py-3 text-center'>

            <Link to="/auth/register" className='text-gray-900 font-semibold'>Empezar</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};