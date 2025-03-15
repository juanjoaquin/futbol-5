import axios from 'axios';
import React, { useEffect, useState } from 'react'

interface NotiProps {
    id: number;
    tipo: string;
    created_at: string;
    mensaje: string;
    leida: boolean;
}

export const useNotifaciones = () => {
    const [notificaciones, setNotificaciones] = useState<NotiProps[]>([]);

    useEffect(() => {
        const token = localStorage.getItem('JWT');
        if (!token) return;

        const getNoti = async () => {
            try {
                const response = await axios.get(import.meta.env.VITE_NOTIFICACIONES, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setNotificaciones(response.data.notificaciones);
            } catch (error) {
                console.log(error);
            }
        };
        getNoti();
    }, []);

    const marcarComoLeidas = async () => {
        try {
            const token = localStorage.getItem('JWT');
            if (!token) return;

            // Llamada al backend para marcar todas como leídas
            await axios.patch(`${import.meta.env.VITE_API_URL}/notificaciones/marcar-todas-leidas`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Luego, actualizamos las notificaciones en el estado local
            setNotificaciones((prevNotificaciones) =>
                prevNotificaciones.map((noti) => ({ ...noti, leida: true }))
            );
        } catch (error) {
            console.error('Error al marcar las notificaciones como leídas', error);
        }
    };

    return { notificaciones, marcarComoLeidas };
};
