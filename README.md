# Fútbol 5: Formas tu propio equipo, invitas a jugadores a unirse, y desafías a otros equipos. 
``
Lógica de la aplicación
``

Es una app web que se centra en la idea de tener un equipo de fútbol, donde vos al ser usuario ya podes tener el tuyo con el simple hecho de crearlo y pasar a ser el líder.
El líder posee mayores permisos, y manejos que el usuario común, ya que esté puede gestionar solicitudes para aquellos jugadores que quieren unirse a su equipo, también puede
invitar a jugadores que no poseen un club, y lo más importante es que puede gestionar el hecho de desafiar a otros equipos a jugar un partido. Además el flujo en el caso de
que el líder abandone el equipo, esté se desintegrá y todos los jugadores pasan a ser libres automáticamente.
Cuenta con un componente que es como un Muro, estilo facebook, pero simple. Solamente se pueden publicar posts, con su contenido, y otros usuarios pueden comentarlos. Solamente
pueden borrar los posts aquellos usuarios propietarios del mismo. 


``
Desarrollo
``

La desarrollé full stack, con Laravel en el backend, y en el frontend usé React JS + TypeScript. Mientras que para la base de datos utilicé MySQL.
Tiene validaciones desde el backend, y para el frontend en los formularios aplico Zod. También tiene sus restricciones para los usuarios.
Esto es en conjunto de los stacks: Cada equipo posee un máximo de jugadores (5), las solicitudes de jugadores o lideres a unirse a los clubes no van a ser creadas en caso
de que esté en un estado de "No disponible" al contar con todos los jugadores. Hay componentes que los jugadores pueden ver únicamente, y que los líderes tambien, como por ejemplo:
las solicitudes de unirse a los clubes (únicamente los líderes), esté arrojará automáticamente una http de 403.
Para la autenticación utilicé JWT, y en el frontend al token lo almacenó con LocalStorage. 
En el frontend tengo rutas protegidas, únicamente los usuarios autenticados pueden acceder a todos los componentes. Los no autenticados únicamente a la Home Page, y los de autenticación,
y en el backend, también tengo aplicado para que únicamente puedan acceder usuarios autenticados.


# Pasos a seguir para utilizarlo

1. Clonar el repositorio
2. Instalar Vite usando React + TypeScript
3. Una vez creado Laravel con Composer realizar las migraciones con `php artisan migrate`
4. Ejecutar `npm run dev` para la copilación del frontend.
5. Ejecutar `php artisan serve` para levantar el backend. 

# Imagenes del proyecto

![0](https://imgur.com/31Kfd62.jpg)
![1](https://imgur.com/gRSHFhe.jpg)
![2](https://imgur.com/xrY5gKP.jpg)
![3](https://imgur.com/2cxEaEO.jpg)
![4](https://imgur.com/sNt35bi.jpg)
![5](https://imgur.com/TEya2Ew.jpg)
![6](https://imgur.com/PL9JC2s.jpg)
![7](https://imgur.com/Gr2yIUC.jpg)
![8](https://imgur.com/iN4KNFC.jpg)
![9](https://imgur.com/32w235s.jpg)
![10](https://imgur.com/KT1ShbQ.jpg)
![11](https://imgur.com/ipcWfX5.jpg)
![12](https://imgur.com/YM5PYeO.jpg)
![13](https://imgur.com/50TZJYT.jpg)
![14](https://imgur.com/F9mzmcs.jpg)
![15](https://imgur.com/3IBGnYY.jpg)
