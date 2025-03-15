import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MessageSquare, User, Clock, Shield, Loader, CirclePlus,  OctagonX } from 'lucide-react';

interface CommentProps {
    id: number;
    contenido: string;
    user_id: number;
    post_id: number;
    created_at: number;
}

interface PostProps {
    id: number;
    titulo: string;
    comentario: string;
    user_id: number;
    equipo_id: number | null;
    created_at: number;
    comentarios: CommentProps[];
}

export const Muro = () => {
    const [posts, setPosts] = useState<PostProps[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const token = localStorage.getItem('JWT');
    const navigate = useNavigate();
    const [commentText, setCommentText] = useState<{ [key: number]: string }>({});
    const [userId, setUserId] = useState<number | null>(null);

    useEffect(() => {
        if (!token) {
            setTimeout(() => {
                navigate('/auth/login');
            }, 1000);
            return;
        }

        const fetchUserData = async () => {
            try {
                const response = await axios.get(import.meta.env.VITE_ME, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUserId(response.data.id); 
                console.log("Equipos del usuario:", response.data);

            } catch (error) {
                console.log("Error al obtener el usuario", error);
            }
        };

        const getPosts = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(import.meta.env.VITE_POSTS, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setPosts(response.data.posts);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        }
        getPosts();
        fetchUserData();
    }, [token, navigate]);

    const handleCommentSubmit = async (postId: number) => {
        if (!commentText[postId]) return;

        try {
            const response = await axios.post(import.meta.env.VITE_COMMENTS,
                {
                    contenido: commentText[postId],
                    post_id: postId
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }

            );
            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post.id === postId
                        ? { ...post, comentarios: [...post.comentarios, response.data.comentario] }
                        : post
                )
            );

            setCommentText((prev) => ({ ...prev, [postId]: '' }));

        } catch (error) {
            console.log(error);
        }
    }

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleDelete = async (postId: number) => {

        const confirmDelete = window.confirm("¿Estás seguro de que quieres eliminar este post?");
        if (!confirmDelete) return;
        
        try {
            await axios.delete(`${import.meta.env.VITE_ELIMINAR_POST}/${postId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
        }
        catch (error) {
            console.log('Error al elminar el post', error)
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-900 p-6">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3 mb-8">
                        <MessageSquare className="w-8 h-8 text-lime-400" />
                        Muro de Publicaciones
                    </h1>
                    <div className="flex flex-col items-center justify-center py-12">
                        <Loader className="w-12 h-12 text-lime-400 animate-spin mb-4" />
                        <p className="text-gray-400">Cargando publicaciones...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 p-6">
            <div className="max-w-3xl mx-auto space-y-6">
                <div>

                    <h1 className="text-3xl font-bold text-white flex items-center gap-3 mb-8">
                        <MessageSquare className="w-8 h-8 text-lime-400" />
                        Muro de Publicaciones
                    </h1>
                    <h3 className='text-sm text-gray-400'>Este es el muro de la App. Acá podes publicar si estas buscando equipo, si queres desafiar a otro, etc. También podes comentarle el post a otros usuarios.</h3>
                </div>

                <div>
                    <Link to="/muro/crear-post" className='flex items-center gap-2 text-center justify-center w-full bg-gradient-to-r from-lime-300 to-lime-600 shadow-lg py-2 uppercase text-gray-700 font-semibold'>Crear Post <CirclePlus size={19} className='text-gray-700' /> </Link>
                </div>

                {posts
                    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                    .map((post) => (
                        <div
                            key={post.id}
                            className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-lime-400/10 hover:border-lime-400/20 transition-all"
                        >
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
          
                                    <h2 className="text-xl font-semibold text-lime-400">
                                        {post.titulo}
                                    </h2>
                                    {post.equipo_id && (
                                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                                            <Shield className="w-4 h-4 text-lime-400" />
                                            <span>Equipo #{post.equipo_id}</span>
                                        </div>
                                    )}
                                </div>

                                <p className="text-gray-300 mb-6 leading-relaxed">
                                    {post.comentario}
                                </p>

                                <div className="flex items-center justify-between text-sm text-gray-400 border-t border-gray-700 pt-4">
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4 text-lime-400" />
                                        <span>Usuario #{post.user_id}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-lime-400" />
                                        <time>{formatDate(post.created_at)}</time>
                                    </div>
                                    <div>
                                    {userId === post.user_id && (

                                        <OctagonX className='text-red-500 font-bold'
                                        onClick={() => handleDelete(post.id)}
                                        />
                                )}
                                    </div>
                                </div>
                                


                                <div>


                                    {post.comentarios.length > 0 && (
                                        <div className="mt-4 bg-gray-900 p-4 rounded-lg">
                                            <h3 className="text-sm font-semibold text-lime-400 mb-3">Comentarios:</h3>
                                            {post.comentarios.map((comentario) => (
                                                <div key={comentario.id} className="text-gray-300 text-sm border-b border-gray-700 pb-2 mb-2">
                                                    <p>{comentario.contenido}</p>
                                                    <div className="text-gray-500 text-xs mt-1">
                                                        <span>Usuario #{comentario.user_id} - {formatDate(comentario.created_at)}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="mt-4">
                                    <input
                                        type="text"
                                        placeholder="Escribe un comentario..."
                                        className="w-full px-3 py-2 border border-gray-700 bg-gray-800 text-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-400"
                                        value={commentText[post.id] || ""}
                                        onChange={(e) =>
                                            setCommentText((prev) => ({ ...prev, [post.id]: e.target.value }))
                                        }
                                    />
                                    <button
                                        className="mt-2 bg-lime-500 text-gray-900 px-4 py-2 rounded-md text-sm font-semibold hover:bg-lime-600 transition"
                                        onClick={() => handleCommentSubmit(post.id)}
                                    >
                                        Comentar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                {!isLoading && posts.length === 0 && (
                    <div className="text-center py-12">
                        <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400">No hay publicaciones disponibles</p>
                    </div>
                )}
            </div>
        </div>
    );
};