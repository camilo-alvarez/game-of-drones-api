# 🎮 Game of Drones API

API REST para el juego multijugador "Game of Drones" (variación de Piedra, Papel o Tijeras).

## 📋 Descripción

Backend desarrollado con Node.js, TypeScript, Express y MongoDB que permite gestionar partidas entre dos jugadores. El primer jugador en ganar 3 rondas es declarado campeón.

## 🛠️ Stack Tecnológico

- **Runtime**: Node.js v22.20.0
- **Lenguaje**: TypeScript
- **Framework**: Express
- **Base de Datos**: MongoDB
- **Validación**: Zod
- **Testing**: Jest + Supertest
- **Documentación**: Swagger/OpenAPI

## 📦 Instalación

### Prerrequisitos

- Node.js v22.20.0
- MongoDB (local o Atlas)
- npm o yarn

### Pasos

```bash
# Clonar el repositorio
git clone <repository-url>
cd game-of-drones-api

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones

# Iniciar en modo desarrollo
npm run dev
```

## 🔧 Scripts Disponibles

```bash
npm run dev          # Inicia el servidor en modo desarrollo con hot reload
npm run build        # Compila el proyecto TypeScript a JavaScript
npm start            # Inicia el servidor en producción (requiere build)
npm test             # Ejecuta los tests con cobertura
npm run test:watch   # Ejecuta tests en modo watch
npm run lint         # Analiza el código con ESLint
npm run lint:fix     # Corrige problemas de ESLint automáticamente
npm run format       # Formatea el código con Prettier
```

## 🌍 Variables de Entorno

Ver archivo `.env.example` para la configuración completa.

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/game-of-drones
```

## 📚 Documentación API

Una vez iniciado el servidor, la documentación interactiva estará disponible en:

```
http://localhost:3000/api-docs
```

## 🎯 Endpoints Principales

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/players` | Crear un nuevo jugador |
| GET | `/players` | Listar todos los jugadores |
| GET | `/players/:id/stats` | Estadísticas de un jugador |
| POST | `/matches` | Crear una nueva partida |
| POST | `/matches/:id/move` | Registrar movimiento |
| GET | `/matches/:id` | Obtener estado de partida |

## 🏗️ Arquitectura

El proyecto sigue una arquitectura en capas con separación de responsabilidades:

```
src/
├── controllers/    # Manejo de HTTP requests/responses
├── services/       # Lógica de negocio
├── models/         # Schemas de MongoDB (Mongoose)
├── routes/         # Definición de endpoints
├── middlewares/    # Validación y manejo de errores
├── types/          # Interfaces y tipos TypeScript
├── utils/          # Funciones auxiliares
└── config/         # Configuración de base de datos
```

### Principios Aplicados

- **SOLID**: Cada componente tiene una única responsabilidad
- **Dependency Injection**: Servicios desacoplados de controladores
- **Tipado Estricto**: TypeScript en modo strict
- **Validación**: Schemas Zod en todos los endpoints

## 🎲 Reglas del Juego

- **Papel** gana a **Piedra**
- **Piedra** gana a **Tijeras**
- **Tijeras** gana a **Papel**
- Primer jugador en ganar **3 rondas** gana la partida

## 🎮 Uso de la API

### Ejemplo: Jugar una partida completa

```bash
# 1. Crear dos jugadores
curl -X POST http://localhost:3000/api/v1/players \
  -H "Content-Type: application/json" \
  -d '{"name": "Alice"}'

curl -X POST http://localhost:3000/api/v1/players \
  -H "Content-Type: application/json" \
  -d '{"name": "Bob"}'

# 2. Crear una partida (usa los IDs de los jugadores)
curl -X POST http://localhost:3000/api/v1/matches \
  -H "Content-Type: application/json" \
  -d '{
    "player1Id": "PLAYER1_ID",
    "player2Id": "PLAYER2_ID"
  }'

# 3. Registrar movimientos (usa el ID de la partida)
# Alice juega "rock"
curl -X POST http://localhost:3000/api/v1/matches/MATCH_ID/move \
  -H "Content-Type: application/json" \
  -d '{
    "playerId": "PLAYER1_ID",
    "move": "rock"
  }'

# Bob juega "scissors" (Alice gana la ronda)
curl -X POST http://localhost:3000/api/v1/matches/MATCH_ID/move \
  -H "Content-Type: application/json" \
  -d '{
    "playerId": "PLAYER2_ID",
    "move": "scissors"
  }'

# 4. Ver estado de la partida
curl http://localhost:3000/api/v1/matches/MATCH_ID

# 5. Ver estadísticas del jugador
curl http://localhost:3000/api/v1/players/PLAYER1_ID/stats
```

### Colección de Postman

Importa el archivo `postman_collection.json` en Postman para probar todos los endpoints fácilmente.

## 🧪 Testing

```bash
# Ejecutar todos los tests
npm test

# Tests en modo watch
npm run test:watch

# Ver cobertura
npm test -- --coverage
```

### Tests Incluidos

- ✅ **Unit Tests**: Lógica del juego (determinar ganador, validaciones)
- ✅ **Helper Tests**: Utilidades (ObjectId, cálculos, sanitización)
- ✅ **Integration Tests**: API endpoints de Players

## 🐳 Docker

### Usando Docker Compose (Recomendado)

```bash
# Iniciar todos los servicios (API + MongoDB)
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down

# Limpiar volúmenes (resetear base de datos)
docker-compose down -v
```

### Solo Docker

```bash
# Construir imagen
docker build -t game-of-drones-api .

# Ejecutar contenedor
docker run -p 3000:3000 -e MONGODB_URI=mongodb://host.docker.internal:27017/game-of-drones game-of-drones-api
```

## 📝 Licencia

ISC

## 👤 Autor

[Tu Nombre]

---

**Nota**: Proyecto desarrollado como prueba técnica para demostrar habilidades en desarrollo backend con Node.js, TypeScript y arquitectura limpia.
