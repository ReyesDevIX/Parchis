# 🎲 Parchís Online Multijugador

Juego de Parchís clásico multijugador en tiempo real para jugar con amigos desde el navegador, sin necesidad de registro. Desarrollado como proyecto colaborativo de **Desarrollo de Aplicaciones Web (DAW)** con arquitectura cliente-servidor autoritativa.

![JavaScript](https://img.shields.io/badge/JavaScript-ES2022-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-Tiempo_Real-010101?style=for-the-badge&logo=socket.io&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-Frontend-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-Testing-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)

---

## ✨ Características (MVP)

- **Salas privadas al instante:** Crea una partida eligiendo entre 2 y 8 jugadores y comparte el código de invitación.
- **Acceso sin registro:** Únete a cualquier sala únicamente eligiendo tu nombre.
- **Sala de espera y chat en vivo:** Lista de jugadores conectados en tiempo real y chat integrado antes y durante la partida.
- **Tablero interactivo en SVG:** Escalable para cualquier pantalla y preparado para tableros de 4, 6 y 8 colores.
- **Reglas clásicas validadas en servidor:** Toda la lógica del juego se ejecuta en el backend para evitar trampas y garantizar sincronización total.

---

## 🏗️ Arquitectura y Stack Tecnológico

El proyecto está organizado como un **monorepo con NPM Workspaces**, separando la lógica pura del juego de la interfaz y la red:

```text
parchis-online/
├── packages/
│   ├── reglas/        # Motor puro de reglas del Parchís (sin DOM ni red, 100 % testeable)
│   ├── servidor/      # Backend en Node.js + Express + Socket.IO (salas, turnos y chat)
│   └── cliente/       # Frontend en HTML, CSS, Vanilla JS y SVG empaquetado con Vite
├── .prettierrc        # Reglas de formateo compartido
├── eslint.config.mjs  # Linter para mantener calidad de código
└── package.json       # Configuración del monorepo y scripts globales
```

### ¿Por qué servidor autoritativo?
El cliente nunca decide si una jugada es válida. Cuando un jugador hace clic en una ficha, envía su intención al servidor; este consulta el paquete `reglas`, actualiza el estado de la partida en memoria y retransmite el nuevo estado a todos los jugadores de la sala.

---

## 📜 Reglas implementadas

1. Cada jugador comienza con **4 fichas** en su casa.
2. **Salida:** Hace falta sacar un **5** para sacar ficha (obligatorio si quedan fichas en casa y la casilla de salida está libre).
3. **Tirada de 6:** Repite turno. *(Opcional: cuenta como 7 si no quedan fichas en casa).*
4. **Tres 6 seguidos:** La última ficha movida vuelve a casa (salvo que ya se encuentre en el pasillo final).
5. **Comer ficha:** Caer en una casilla normal ocupada por un rival lo devuelve a su casa y otorga **+20 casillas**.
6. **Casillas seguras:** En los seguros no se puede comer.
7. **Barreras:** Dos fichas del mismo color en una misma casilla bloquean el paso a todos. Con un 6 es obligatorio abrir barrera si se posee una.
8. **Pasillo final y meta:** 7 casillas de color y entrada a meta con tirada **exacta**. Meter una ficha otorga **+10 casillas**.
9. **Sin movimientos:** Si no existe jugada legal posible, se pasa el turno automáticamente.
10. **Victoria:** Gana el primer jugador en llevar sus 4 fichas a la meta.

---

## 🚀 Instalación y ejecución en local

### Requisitos previos
- [Node.js](https://nodejs.org/) (v18 o superior)
- npm (incluido con Node.js)

### Pasos

1. **Clonar el repositorio:**
   ```bash
   git clone [https://github.com/ReyesDevIX/Parchis.git](https://github.com/ReyesDevIX/Parchis.git)
   cd Parchis/parchis-online
   ```

2. **Instalar dependencias de todo el monorepo:**
   ```bash
   npm install
   ```

3. **Arrancar el cliente en modo desarrollo:**
   ```bash
   npm run dev:cliente
   ```

4. **Ejecutar los tests unitarios (Vitest):**
   ```bash
   npm test
   ```

---

## 🗺️ Hoja de ruta

- [x] **Fase 0:** Configuración del monorepo, ESLint, Prettier, Vitest y flujo de GitHub.
- [ ] **Fase 1:** Servidor Express + Socket.IO, salas de espera, pantalla de inicio y chat en vivo.
- [ ] **Fase 2:** Motor de reglas completo desarrollado con TDD.
- [ ] **Fase 3:** Integración de reglas en el servidor, control de turnos y tests de integración.
- [ ] **Fase 4:** Tablero visual SVG de 4 jugadores, dado interactivo y pantalla de fin de partida.
- [ ] **Fase 5:** Tableros de 6 y 8 jugadores, diseño responsive y tests E2E con Playwright.
- [ ] **Fase 6:** Despliegue en producción.

---

## 🤝 Flujo de trabajo y contribución

- La rama `main` está protegida: todos los cambios entran mediante **Pull Request** con revisión del compañero.
- Seguimos el estándar [Conventional Commits](https://www.conventionalcommits.org/es/) (`feat:`, `fix:`, `test:`, `chore:`, `docs:`).
- El seguimiento de tareas se gestiona desde el tablero Kanban en **GitHub Projects**.

---

## 👥 Autores

- **Persona A (Backend y Motor de Reglas):** [@UsuarioA](https://github.com/ReyesDevIX)
- **Persona B (Frontend, UI y Chat):** [@UsuarioB](https://github.com/)
