import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { UserPlus, Mail, Lock, User, ArrowRight } from 'lucide-react';

export const Register = () => {
    const registerSchema = z.object({
        name: z.string().min(1),
        email: z.string().min(1),
        password: z.string().min(1)
    });

    type RegisterForm = z.infer<typeof registerSchema>

    const navigate = useNavigate();

    const [formData, setFormData] = useState<RegisterForm>({
        name: '',
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState<string>('');
    const [isOk, setIsOk] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors('');
        setIsOk('');
        setIsLoading(true);

        try {
            registerSchema.parse(formData);
            await axios.post(import.meta.env.VITE_REGISTER, formData);
            setIsOk('¡Usuario registrado exitosamente!');

            setTimeout(() => {
                setTimeout(() => {
                    navigate("/");
                }, 500);
            }, 2000);
        } catch (error: any) {
            console.log("Error:", error);
            setErrors('Error al crear el usuario. Por favor, intente nuevamente.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        document.title = 'Registrarse';
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-900">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <div className="flex justify-center">
                        <div className="h-16 w-16 bg-lime-500/10 rounded-full flex items-center justify-center">
                            <UserPlus className="h-8 w-8 text-lime-500" />
                        </div>
                    </div>
                    <h1 className="mt-6 text-3xl font-extrabold text-lime-400 uppercase tracking-wider">
                        Crear Cuenta
                    </h1>
                    <p className="mt-2 text-sm text-gray-400">
                        Únite a nuestra comunidad de Fútbol 5
                    </p>
                </div>

                <div className="mt-8 bg-gray-800 rounded-xl shadow-2xl shadow-lime-900/20 p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-lime-400">
                                Nombre
                            </label>
                            <div className="mt-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-500" />
                                </div>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-lg bg-gray-900 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                                    placeholder="Escribé tú nombre"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-lime-400">
                                Email
                            </label>
                            <div className="mt-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-500" />
                                </div>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-lg bg-gray-900 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                                    placeholder="Escribé tú email"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-lime-400">
                                Contraseña
                            </label>
                            <div className="mt-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-500" />
                                </div>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-lg bg-gray-900 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                                    placeholder="Escribé la contraseña"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-lime-600 hover:bg-lime-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500 focus:ring-offset-gray-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Procesando...
                                </span>
                            ) : (
                                <span className="flex items-center">
                                    Registrarse
                                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                            )}
                        </button>

                        <div className="text-center text-sm">
                            <span className="text-gray-400">¿Ya tenes cuenta?{" "}</span>
                            <Link 
                                to="/auth/login" 
                                className="font-medium text-lime-400 hover:text-lime-300 transition-colors duration-200"
                            >
                                Iniciá sesión
                            </Link>
                        </div>
                    </form>

                    {errors && (
                        <div className="mt-4 p-3 bg-red-900/50 border border-red-500/50 text-red-200 rounded-lg text-sm text-center">
                            {errors}
                        </div>
                    )}

                    {isOk && (
                        <div className="mt-4 p-3 bg-green-900/50 border border-green-500/50 text-green-200 rounded-lg text-sm text-center">
                            {isOk}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Register