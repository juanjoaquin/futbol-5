import React from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon, AlertCircle } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="relative">
          {/* Large 404 with gradient */}
          <h1 className="text-[150px] font-bold leading-none bg-gradient-to-r from-lime-300 to-lime-400 text-transparent bg-clip-text">
            404
          </h1>
          
          {/* Alert circle icon positioned absolutely */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-lime-400/20">
            <AlertCircle size={180} />
          </div>
        </div>

        {/* Error message */}
        <h2 className="text-2xl font-semibold text-lime-300 mt-8 mb-4">
          Página no encontrada
        </h2>
        <p className="text-gray-400 mb-8">
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </p>

        {/* Return home button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-lime-400 px-6 py-3 rounded-xl transition-colors duration-200 font-medium"
        >
          <HomeIcon size={20} />
          Volver al inicio
        </Link>

        {/* Decorative elements */}
        <div className="mt-12 flex justify-center gap-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-lime-400/30"
              style={{
                animation: `pulse 1.5s ease-in-out ${i * 0.2}s infinite`
              }}
            />
          ))}
        </div>
      </div>

      {/* Add the animation keyframes */}
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 1; }
          }
        `}
      </style>
    </div>
  );
};

export default NotFound;