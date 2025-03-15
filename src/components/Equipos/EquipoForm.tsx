import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import equipoForm from '../../assets/images/equipo-form.jpg'

export const EquipoForm = () => {

  const [error, setError] = useState<string>('');
  const [isOk, setIsOk] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const token = localStorage.getItem('JWT');
  const navigate = useNavigate();

  const equipoSchema = z.object({
    nombre: z.string().min(3, 'El nombre debe teener al menos 3 carácteres'),
    maximo_jugadores: z.number().int('El número debe ser un entero'),
    path_image: z.string().nullable()
  });

  type EquipoForm = z.infer<typeof equipoSchema>;

  const [formData, setFormData] = useState<EquipoForm>({
    nombre: '',
    maximo_jugadores: 1,
    path_image: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === 'maximo_jugadores' ? Number(value) : value
    }));
  };

  useEffect(() => {
    document.title = "Crear equipo"

    if(!token) {
      navigate('/auth/login');
      return;
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError('');
    setIsOk('');
    setIsLoading(true);

    try {
      equipoSchema.parse(formData);

      await axios.post(import.meta.env.VITE_CREAR_EQUIPO, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setIsOk('El equipo fue creado exitosamente');
  
    
      setTimeout(() => {
        navigate('/equipos');
      }, 2000);
    } catch (error) {
      setError('Error al crear el equipo');
      console.log(error)
    }
  }

  return (
    <div className='min-h-screen bg-gray-900 p-6'>

      <div className='mb-4 '>
        <h1 className="text-3xl font-bold text-lime-300 mb-4">Crear equipo</h1>
        <h3 className='text-sm text-gray-400 mb-4'>Crea tú equipo, y pasarás a ser el lider del equipo. Vas a poder gestionar solicitudes para aquellos que quieran unirse, y para desafiar a otros equipos.</h3>

        <img src={equipoForm} alt="" className='opacity-50 rounded-lg' />
      </div>

      <div className='bg-gray-800 pb-4 p-2 rounded-lg'>


        <form action="" onSubmit={handleSubmit} className='space-y-4 mt-6 w-full px-2'>

          <label htmlFor="nombre" className="block text-base font-medium text-lime-300 mb-2">Nombre del equipo</label>

          <input type="text"
            id='nombre'
            name='nombre'
            value={formData.nombre}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-lime-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500 text-white"
            placeholder='Nombre de la prenda de ropa'
          />

          <label htmlFor="maximo_jugadores" className="block text-base font-medium text-lime-300 mb-2">Cantidad de jugadores</label>

          <input type="number"
            id='maximo_jugadores'
            name='maximo_jugadores'
            value={formData.maximo_jugadores}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-lime-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500 text-white"
          />



          <label htmlFor="path_image" className="block text-base font-medium text-lime-300 mb-2">URL de imagen</label>

          <input type="text"
            id='path_image'
            name='path_image'
            value={formData.path_image ?? ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-lime-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500 text-white"
            placeholder='Agregar URL para la imagen'
          />


          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-lime-400 text-white py-2 px-4 rounded-md hover:bg-lime-700 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <p className="font-bold text-gray-300">Creando...</p>
            ) : (
              <span className=" text-gray-700 font-semibold">Crear equipo</span>
            )}
          </button>

        </form>
      </div>
      <div className="m-2 flex justify-center text-center ">

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
      </div>

      {isOk && (
        <div className="mb-4 p-3 bg-green-300 border border-green-400 text-green-700 rounded">
          {isOk}
        </div>
      )}
    </div>
  )
}
