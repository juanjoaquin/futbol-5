import { BrowserRouter, Route, Routes } from 'react-router-dom';

import './App.css'
import { Register } from './auth/Register';
import { Login } from './auth/Login';
import { Home } from './components/Home/Home';
import { Nav } from './components/Nav/Nav';
import { EquiposContainer } from './components/Equipos/EquiposContainer';
import { EquipoForm } from './components/Equipos/EquipoForm';
import { Notificaciones } from './components/Equipos/Notificaciones';
import { JugadoresLibres } from './components/Jugadores/JugadoresLibres';
import { Solicitudes } from './components/Solicitudes/Solicitudes';
import { EquipoDetail } from './components/Equipos/EquipoDetail';
import { Muro } from './components/Muro/Muro';
import { FormMuro } from './components/Muro/FormMuro';
import { Desafios } from './components/Desafios/Desafios';
import { DesafiosAceptados } from './components/Desafios/DesafiosAceptados';
import { SolicitudesJugador } from './components/Solicitudes/SolicitudesJugador';
import NotFound from './components/NotFound/NotFound';

function App() {

  return (

<BrowserRouter >
      <Nav />
      <Routes>


        <Route path="/" element={<Home />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        {/* <Route path="/auth/logout" element={<Logout />} /> */}

        <Route path="/equipos" element={<EquiposContainer />} />
        <Route path="/equipo/:id" element={<EquipoDetail />} />
        <Route path="/equipos/crear-equipo" element={<EquipoForm />} />
        <Route path="/notificaciones" element={<Notificaciones />} />
        <Route path="/jugadores/jugadores-libres" element={<JugadoresLibres />} />
        <Route path="/solicitudes" element={<Solicitudes />} />
        <Route path="/solicitudes/jugador" element={<SolicitudesJugador />} />
        <Route path="/muro" element={<Muro />} />
        <Route path="/muro/crear-post" element={<FormMuro />} />
        <Route path="/desafios" element={<Desafios />} />
        <Route path="/desafios/aceptados" element={<DesafiosAceptados />} />
        <Route path="*" element={<NotFound />} />


      </Routes>
    </BrowserRouter>
  )
}

export default App
