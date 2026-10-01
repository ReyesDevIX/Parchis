# Guía: Parchís online para jugar con amigos

Guía para dos personas (Noctis y su compañero de DAW). No es código hecho: es **qué construir, en qué orden y quién hace qué**. Los fragmentos de código son solo ejemplos para entender una idea.

---

## 1. Qué vais a construir (alcance)

**Versión 1 (MVP), lo mínimo jugable:**
- Crear una sala, elegir el número de jugadores (2 a 8) y compartir un código o enlace.
- Unirse a la sala con un nombre (sin registro de usuarios).
- Sala de espera con la lista de jugadores y el chat.
- Partida completa con las reglas clásicas, por turnos, en tiempo real.
- Chat de la sala que funciona antes y durante la partida.
- Pantalla de fin de partida con el orden de llegada.

**Fuera del MVP (para después):** cuentas de usuario, ranking, reconexión avanzada, partidas contra la máquina, animaciones elaboradas, variantes de reglas configurables.

> Consejo: no paséis a lo "extra" hasta que una partida de 4 jugadores funcione de principio a fin.

---

## 2. Stack recomendado y por qué

| Parte | Tecnología | Por qué |
|---|---|---|
| Lenguaje | **JavaScript** (en todo el proyecto) | Es lo que se ve en DAW; un solo lenguaje en cliente y servidor. Si os animáis, TypeScript más adelante. |
| Frontend | **HTML + CSS + JS con Vite** | Sin framework al principio para entender el DOM. El tablero se dibuja con **SVG** (fácil de escalar y de hacer clic en casillas). Si queréis React, se puede, pero no es necesario. |
| Backend | **Node.js + Express** | Sencillo, muy documentado, encaja con lo de DAW. |
| Tiempo real | **Socket.IO** | Gestiona salas ("rooms") por vosotros, perfecto para partidas y chat. |
| Tests | **Vitest** (unitarios) + **Playwright** (extremo a extremo, opcional en fase avanzada) | Vitest es rápido y con sintaxis tipo Jest. |
| Calidad | **ESLint + Prettier** | Que el código de los dos se vea igual. |
| CI | **GitHub Actions** | Ejecuta los tests en cada Pull Request. |
| Despliegue | **Render** o **Railway** (servidor Node con WebSockets) | Tienen plan gratuito o barato y soportan WebSockets. |

**Estado de la partida:** en memoria del servidor al principio (un objeto por sala). Base de datos solo si más adelante queréis historial o cuentas.

### Idea clave de arquitectura: el servidor manda

El cliente **nunca** decide si un movimiento es válido. El cliente envía "quiero mover la ficha 2" y el servidor:
1. comprueba que es tu turno y que el movimiento es legal,
2. actualiza el estado,
3. envía el nuevo estado a todos los de la sala.

Así nadie puede hacer trampas desde la consola del navegador, y además la lógica queda en un solo sitio, fácil de testear.

```
cliente  --"moverFicha {ficha: 2}"-->  servidor (valida con reglas)
cliente  <--"estado {tablero, turno, dado}"--  servidor (a toda la sala)
```

### Estructura de carpetas sugerida (monorepo)

```
parchis/
├── packages/
│   ├── reglas/        ← lógica pura del juego (sin red, sin DOM). 100 % testeable
│   ├── servidor/      ← Express + Socket.IO, salas, chat, usa "reglas"
│   └── cliente/       ← Vite: pantallas, tablero SVG, chat
├── .github/workflows/ ← CI
└── README.md
```

El paquete `reglas` es el corazón: funciones puras del tipo "dado este estado y este dado, ¿qué movimientos son legales?".

```js
// Ejemplo de la idea, no código final
export function movimientosLegales(estado, jugador, dado) { /* ... */ }
export function aplicarMovimiento(estado, movimiento) { /* devuelve un estado NUEVO */ }
```

---

## 3. Las reglas "de toda la vida" y el problema de 2 a 8 jugadores

### Tableros según el número de jugadores
El tablero clásico es de **4 colores**. Para más jugadores existen tableros de 6 y de 8:

| Jugadores | Tablero | Casillas del recorrido común |
|---|---|---|
| 2 a 4 | 4 colores | 68 (4 × 17) |
| 5 a 6 | 6 colores | 102 (6 × 17) |
| 7 a 8 | 8 colores | 136 (8 × 17) |

Cada color ocupa un "brazo" de 17 casillas. Si programáis el tablero en función de `numColores` (en vez de escribir 68 a mano), las reglas sirven para los tres tableros y solo cambia el dibujo. **Haced primero el de 4** y añadid 6 y 8 cuando todo funcione.

### Reglas a implementar (cerradlas por escrito antes de programar)
En el parchís hay muchas variantes caseras. Escribid en el README la lista exacta. Propuesta:

1. Cada jugador tiene 4 fichas en su casa.
2. Para **salir** de casa hace falta un **5**. Si hay fichas en casa y sale un 5, es obligatorio sacar ficha.
3. Con un **6** se repite tirada. Si un jugador ya no tiene fichas en casa, el 6 cuenta como **7** (variante común; decidid si la usáis).
4. **Tres 6 seguidos**: la última ficha movida vuelve a casa (salvo si ya está en el pasillo final).
5. **Comer**: caer en una casilla normal ocupada por un rival lo manda a casa y tú **cuentas 20**.
6. **Seguros**: en las casillas seguras no se come.
7. **Barrera**: dos fichas del mismo color en una casilla bloquean el paso a todos. Con un 6, si tienes barrera, estás obligado a abrirla.
8. **Pasillo final** de 7 casillas por color y meta; hay que entrar con la tirada **exacta**. Al meter una ficha, **cuentas 10**.
9. Si no hay movimiento posible, se pierde el turno.
10. Gana quien mete sus 4 fichas. Se puede seguir jugando para decidir 2.º, 3.º, etc.

Estas reglas son el mejor material posible para **testing**: cada una se convierte en varios tests.

---

## 4. Forma de trabajar en GitHub

### Configuración inicial (una sola vez)
- Un repositorio, los dos como colaboradores.
- Rama `main` **protegida**: no se puede hacer push directo; todo entra por Pull Request con **1 aprobación** del compañero y CI en verde.
- **GitHub Projects** (tablero Kanban: Por hacer, En curso, En revisión, Hecho) y cada tarea como **Issue**.
- Etiquetas: `reglas`, `servidor`, `cliente`, `chat`, `test`, `bug`, `docs`.

### Flujo por cada tarea
1. Coger una Issue y asignársela.
2. Crear rama desde `main`: `feat/12-dado`, `fix/30-barrera`, `test/18-comer`.
3. Commits pequeños con mensajes claros (por ejemplo [Conventional Commits](https://www.conventionalcommits.org/es/): `feat: tirar dado`, `test: comer ficha en casilla normal`).
4. Abrir **Pull Request** enlazando la Issue (`Closes #12`).
5. El otro revisa: lee el código, prueba en local, comenta. Aprender a revisar es tan importante como programar.
6. Se corrige, se aprueba, se fusiona (merge) y se borra la rama.

### Reglas de convivencia
- PR pequeñas (idealmente menos de 300 líneas). Más fáciles de revisar.
- Nadie aprueba su propio código.
- Si dos tocáis el mismo archivo, hablad antes. Los conflictos de merge se resuelven juntos las primeras veces: es aprendizaje.
- Un fichero `CONTRIBUTING.md` con todo esto.

---

## 5. Testing: qué testear y cómo

| Tipo | Herramienta | Qué cubre | Cuándo |
|---|---|---|---|
| Unitarios | Vitest | Todas las reglas del paquete `reglas` | Desde la fase 2, siempre |
| Integración | Vitest + cliente de Socket.IO | Crear sala, unirse, turnos, chat a través del servidor | Fase 3 en adelante |
| Extremo a extremo (E2E) | Playwright | Dos navegadores juegan y chatean | Fase 5 |
| Manual | Vosotros + amigos | Jugabilidad, móviles | Cada fase |

**Práctica recomendada en las reglas: TDD** (primero el test, luego el código). Ejemplo de cómo se ve un test:

```js
test('con un 5 y fichas en casa, sacar ficha es obligatorio', () => {
  const estado = crearPartida({ jugadores: 4 });
  const movs = movimientosLegales(estado, 'rojo', 5);
  expect(movs.every(m => m.tipo === 'salir')).toBe(true);
});
```

Truco útil: haced que el dado se pueda "inyectar" (pasarle una función o una lista de tiradas). Así los tests son predecibles en vez de aleatorios.

Objetivo: **cobertura alta (80 % o más) en `reglas`**; en cliente basta con lo crítico.

---

## 6. Hoja de ruta por fases (en orden cronológico)

Cada fase termina con algo que se puede **ver o probar**. No empecéis la siguiente sin cerrar la anterior.

### Fase 0: Preparación
- Decidir nombre, reglas exactas (sección 3) y diseño a mano alzada de las pantallas (inicio, sala de espera, partida, fin).
- Crear el repo, proteger `main`, tablero de Projects, Issues de las fases 1 y 2.
- Estructura de carpetas, ESLint, Prettier, Vitest y un test "hola mundo".
- GitHub Actions ejecutando `npm test` y `npm run lint` en cada PR.

**Hecho cuando:** una PR de prueba de cada uno pasa CI, se revisa y se fusiona.

### Fase 1: Esqueleto en tiempo real
- Servidor Express sirviendo el cliente y Socket.IO conectado.
- Crear sala (con número de jugadores 2 a 8) y unirse con código.
- Sala de espera con la lista de jugadores en vivo.
- **Chat de la sala** (mensajes con nombre y hora; limpiar el texto para evitar inyección de HTML).

**Hecho cuando:** dos navegadores en la misma sala se ven y chatean.

### Fase 2: Motor de reglas (sin interfaz)
- Modelo de datos: tablero con `numColores`, fichas, posiciones, turno, dado.
- Movimientos legales y aplicar movimiento, regla a regla, con TDD.
- Orden recomendado: salir con 5, avanzar, seguros, comer y contar 20, barreras, pasillo final y meta con tirada exacta, contar 10, el 6 y los tres 6, fin de partida.

**Hecho cuando:** todos los tests de reglas pasan y se puede simular una partida entera en un test.

### Fase 3: Conectar reglas y servidor
- El servidor guarda el estado de cada sala y usa `reglas` para validar.
- Eventos: `tirarDado`, `moverFicha`, `estado`, `finPartida`.
- Control de turno, desconexiones básicas (si alguien se va, se salta su turno).
- Tests de integración con dos clientes simulados.

**Hecho cuando:** se puede jugar una partida completa enviando eventos (aunque el tablero sea feo).

### Fase 4: Tablero visual de 4 jugadores
- Tablero SVG de 4 colores, fichas, dado, resaltar fichas que se pueden mover.
- Clic en ficha para mover, indicador de turno, chat al lado del tablero.
- Pantalla de fin de partida.

**Hecho cuando:** jugáis una partida real de 4 entre vosotros y dos amigos.

### Fase 5: 6 y 8 jugadores, pulido y E2E
- Dibujo de los tableros de 6 y 8 (las reglas ya deberían funcionar por `numColores`).
- Diseño adaptable a móvil, sonidos o animaciones sencillas.
- Tests E2E con Playwright (crear sala, unirse, chatear, tirar dado).

**Hecho cuando:** partidas de 2, 5 y 8 jugadores funcionan.

### Fase 6: Despliegue
- Variables de entorno, build de producción, despliegue en Render o Railway.
- README con cómo jugar y cómo ejecutar en local.

**Hecho cuando:** mandáis el enlace a los amigos y juegan desde sus casas.

### Fase 7 (opcional): Extras
Reconexión a la partida al recargar la página, cuentas de usuario y base de datos, historial, jugador bot, variantes de reglas configurables al crear la sala.

---

## 7. Reparto del trabajo

Reparto pensado para que **los dos toquéis frontend, backend y tests**, y para que cada uno sea "dueño" de una parte (y revisor de la otra). Persona A y Persona B: decidid vosotros quién es quién. Una sugerencia: quien esté en DAW puede llevar la parte visual (B), que encaja con lo que ve en clase, mientras A lleva reglas y servidor; pero ambos repartos funcionan.

| Fase | Persona A (dueña de reglas y servidor) | Persona B (dueña de cliente y chat) |
|---|---|---|
| 0 | Repo, protección de `main`, GitHub Actions | ESLint, Prettier, Vitest, estructura del cliente con Vite |
| 0 (juntos) | Redactar las reglas exactas y los bocetos de pantallas | |
| 1 | Servidor Express + Socket.IO, crear y unirse a salas | Pantallas de inicio y sala de espera, **chat** (cliente y eventos del servidor) |
| 2 | Modelo de datos, salir, avanzar, seguros, comer, contar 20 | Barreras, pasillo final, meta exacta, contar 10, el 6 y los tres 6 |
| 2 (cruzado) | Escribe tests para las reglas de B | Escribe tests para las reglas de A |
| 3 | Estado de la sala, validación, turnos, desconexiones | Tests de integración del servidor, eventos de chat en partida |
| 4 | Lógica de cliente: recibir estado, enviar movimientos, resaltar fichas válidas | Tablero SVG de 4, fichas, dado, layout con chat, pantalla final |
| 5 | Tablero de 8 colores y comprobar reglas con 8 | Tablero de 6 colores, versión móvil, tests E2E con Playwright |
| 6 | Despliegue y variables de entorno | README, guía de juego, pruebas con amigos |

**Normas del reparto:**
- Toda PR de A la revisa B y viceversa.
- En la fase 2 os cruzáis los tests a propósito: escribir tests para código ajeno obliga a entender la regla y encuentra más fallos.
- Si uno va más adelantado, ayuda con tests o coge Issues de la columna "Por hacer" en vez de esperar.
- Una reunión corta a la semana: qué hice, qué haré, en qué estoy bloqueado. Mover las tarjetas del tablero.

---

## 8. Primeros pasos para esta semana

1. Leer juntos esta guía y cerrar la lista de reglas (sección 3).
2. Crear el repositorio, añadir al compañero y proteger `main`.
3. Crear el tablero de GitHub Projects y las Issues de la Fase 0 y la Fase 1.
4. Cada uno hace su primera PR pequeña (por ejemplo, el README y la configuración de ESLint) y la revisa el otro.

## Recursos útiles
- Socket.IO, salas: https://socket.io/docs/v4/rooms/
- Vitest: https://vitest.dev/guide/
- Playwright: https://playwright.dev/docs/intro
- GitHub Flow: https://docs.github.com/es/get-started/using-github/github-flow
- SVG en MDN: https://developer.mozilla.org/es/docs/Web/SVG
