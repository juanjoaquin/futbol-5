<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ComentarioController;
use App\Http\Controllers\EquipoController;
use App\Http\Controllers\JugadorController;
use App\Http\Controllers\NotificacionController;
use App\Http\Controllers\PartidoController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\SolicitudController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::group(['middleware' => 'api', 'prefix' => 'auth'], function ($router) {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
    Route::post('logout',  [AuthController::class, 'logout']);
    Route::post('refresh',  [AuthController::class, 'refresh']);
    Route::get('me',  [AuthController::class, 'me']);
});

// Equipo
Route::get('equipos', [EquipoController::class, 'traerEquipos']); // => Crear lugar siendo leader del Equipo
Route::get('equipo/{equipoId}', [EquipoController::class, 'getEquipoById']); // => Traer equipo por id con jugadores
Route::post('equipos/crear-equipo', [EquipoController::class, 'crearEquipo']); // => Crear equipo -> Pasar a ser leader
Route::get('equipos/{equipoId}/solicitudes', [EquipoController::class, 'verSolicitudes']); // => Ver solicitudes de desafios
Route::put('equipos/{equipoId}/solicitudes/{solicitudId}', [EquipoController::class, 'gestionarSolicitud']); // => Responder solicitud de unirse ENVIADA POR EL LEADER AL JUGADOR
Route::get('equipos/equipos-con-jugadores', [EquipoController::class, 'obtenerEquiposConJugadores']); // => Traer equipos con jugadores
Route::post('invitar-jugador/{equipoId}', [EquipoController::class, 'invitarJugador']); // => Invitar a jugador siendo leader
Route::delete('/equipos/{equipoId}/salir', [EquipoController::class, 'salirDelEquipo']); // => Salir del equipo

// Lugar relacionado con Equipo
// Route::post('lugares', [LugarController::class, 'crearLugar']); // => Crear lugar siendo leader del Equipo
// Route::get('lugares/equipos/{equipoId}', [LugarController::class, 'getLugaresByEquipoId']); // => Traer lugar por id de equipo

// Jugador
Route::post('equipos/{equipoId}/solicitar', [JugadorController::class, 'solicitarUnirse']); // => Solicitar unirse a club
Route::get('jugadores/libres', [JugadorController::class, 'listarJugadoresLibres']); // => Jugador sin equipos
Route::post('responder-invitacion/{solicitudId}', [JugadorController::class, 'responderInvitacion']); // => Gestionar invitacion de unirse a equipo

// Desafiar equipo
Route::post('/desafios', [PartidoController::class, 'crearDesafio']); // => Desafiar a otro equipo
Route::put('/desafios/{partidoId}', [PartidoController::class, 'gestionarDesafio']); // => Responder desafio
Route::get('/desafios/pendientes', [PartidoController::class, 'getDesafiosPendientes']); // => Traer desafios pendientes
Route::get('/desafios/aceptados', [PartidoController::class, 'getDesafiosAceptados']); // => Traer desafios aceptados

//Post
Route::get('/posts', [PostController::class, 'index']); // => Get posts
Route::post('/post/publicar-post', [PostController::class, 'store']); // => Crear post
Route::delete('/posts/eliminar-post/{postId}', [PostController::class, 'destroy']); // => Eliminar post x user

//Comentarios por post
Route::post('/comentarios', [ComentarioController::class, 'store']); // => Comentar post de user 
Route::post('/comentario/{comentarioId}', [ComentarioController::class, 'destroy']); // => Eliminar comentario de post

//Notificaciones
Route::get('/notificaciones', [NotificacionController::class, 'getNotificaciones']); // => get notificaciones
Route::delete('/notificacion/{notificacionId}', [NotificacionController::class, 'deleteNotificacion']); // => Eliminar notificacion x id
Route::patch('/notificaciones/marcar-todas-leidas', [NotificacionController::class, 'marcarComoLeidas']); // => Marcar como leidas las notificaciones

//Solicitudes
Route::get('/solicitudes/jugador', [SolicitudController::class, 'getSolicitudes']);
Route::get('/solicitudes/lider', [SolicitudController::class, 'getSolicitudesRecibidas']);


Route::get('users', [EquipoController::class, 'index']);

Route::get('equipos/{id}/jugadores', [EquipoController::class, 'obtenerJugadores']);
