import axios from 'axios';
import { TextCursorInput } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { z } from 'zod'

export const FormMuro = () => {


  const [errors, setErrors] = useState<string>('');
  const [isOk, setIsOk] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const token = localStorage.getItem('JWT');
  const navigate = useNavigate();

  const muroSchema = z.object({
    titulo: z.string().min(1, 'El titulo debe tener al menos un digito'),
    comentario: z.string().min(3, 'El titulo debe tener al menos 3 digitos')
  });

  type MuroForm = z.infer<typeof muroSchema>;

  const [formData, setFormData] = useState<MuroForm>({
    titulo: '',
    comentario: ''
  });

  useEffect(() => {
    if (!token) {
      navigate('/auth/login');
      return;
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrors('');
    setIsOk('');
    setIsLoading(true);

    try {
      muroSchema.parse(formData);

      await axios.post(import.meta.env.VITE_PUBLICAR_POST, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setIsOk('El post fue publicado correctamente')
      setTimeout(() => {
        navigate('/muro');
      }, 1000);
    } catch (error) {
      setErrors('Error al crear el post');
      console.log(error)
    }

  }


  return (
    <div className='p-6 min-h-screen bg-gray-900'>

      <div>

        <h1 className="text-3xl font-bold text-white flex items-center gap-3 mb-4">
          <TextCursorInput className="w-8 h-8 text-lime-400" />
          Formulario de post
        </h1>
        <h3 className='text-sm text-gray-400'>Este es el formulario para publicar el post que desees.</h3>
      </div>

      <div className='bg-gray-800  px-2 w-full rounded-lg border border-lime-400/20 mt-6'>
        <form action="" onSubmit={handleSubmit} className='space-y-4 mt-4'>

          <label htmlFor="titulo" className="block text-base font-medium text-lime-400 mb-2">Titulo</label>

          <input type="text"
            id='titulo'
            name='titulo'
            value={formData.titulo}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-lime-300 rounded-md focus:outline-none text-gray-200 focus:ring-2 focus:ring-lime-500"
            placeholder='Titulo del post'
          />

          <label htmlFor="comentario" className="block text-base font-medium text-lime-400 mb-2">Contenido</label>

          <input type="text"
            id='comentario'
            name='comentario'
            value={formData.comentario}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-lime-300 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-lime-500"
            placeholder='Contenido del post'
          />


          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-lime-300 text-white py-2 px-4 rounded-md hover:bg-lime-400 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <p className="font-bold text-lime-500">Creando...</p>
            ) : (
              <span className="font-medium text-gray-700">Publicar Post</span>
            )}
          </button>

        </form>
        <div className="m-2 flex justify-center text-center ">

          {errors && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {errors}
            </div>
          )}
        </div>

        {isOk && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {isOk}
          </div>
        )}
      </div>

    </div>
  )
}
