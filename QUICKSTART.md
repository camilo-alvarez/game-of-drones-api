# 🚀 Guía de Inicio Rápido - Game of Drones API

## ⚡ Inicio Rápido (5 minutos)

### Opción 1: Con Docker (Más Fácil)

```bash
# 1. Clonar o navegar al proyecto
cd game-of-drones-api

# 2. Iniciar todo con Docker Compose
docker-compose up -d

# 3. ¡Listo! La API está corriendo en http://localhost:3000
```

### Opción 2: Local (Desarrollo)

```bash
# 1. Asegúrate de tener MongoDB corriendo localmente
# mongod

# 2. Crear archivo .env
cp .env.example .env

# 3. Instalar dependencias
npm install

# 4. Iniciar en modo desarrollo
npm run dev

# La API estará en http://localhost:3000
```

---

## 🎯 Primeros Pasos

### 1. Verificar que la API está funcionando

```bash
curl http://localhost:3000/api/v1/health
```

Respuesta esperada:
```json
{
  "success": true,
  "message": "Game of Drones API is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 2. Ver documentación interactiva

Abre en tu navegador:
```
http://localhost:3000/api-docs
```

---

## 🎮 Tutorial: Tu Primera Partida

### Paso 1: Crear dos jugadores

**Jugador 1:**
```bash
curl -X POST http://localhost:3000/api/v1/players \
  -H "Content-Type: application/json" \
  -d '{"name": "Alice"}'
```

**Jugador 2:**
```bash
curl -X POST http://localhost:3000/api/v1/players \
  -H "Content-Type: application/json" \
  -d '{"name": "Bob"}'
```

📝 **Importante:** Guarda los `_id` de cada jugador de la respuesta.

### Paso 2: Crear una partida

```bash
curl -X POST http://localhost:3000/api/v1/matches \
  -H "Content-Type: application/json" \
  -d '{
    "player1Id": "ALICE_ID_AQUI",
    "player2Id": "BOB_ID_AQUI"
  }'
```

📝 **Importante:** Guarda el `_id` de la partida.

### Paso 3: Jugar rondas

**Ronda 1:**

Alice juega "rock":
```bash
curl -X POST http://localhost:3000/api/v1/matches/MATCH_ID/move \
  -H "Content-Type: application/json" \
  -d '{
    "playerId": "ALICE_ID",
    "move": "rock"
  }'
```

Bob juega "scissors":
```bash
curl -X POST http://localhost:3000/api/v1/matches/MATCH_ID/move \
  -H "Content-Type: application/json" \
  -d '{
    "playerId": "BOB_ID",
    "move": "scissors"
  }'
```

🎉 **Resultado:** Alice gana la ronda! (Score: 1-0)

### Paso 4: Continuar hasta que alguien gane 3 rondas

Repite el paso 3 jugando diferentes movimientos hasta que un jugador alcance 3 victorias.

**Movimientos válidos:**
- `rock` (piedra)
- `paper` (papel)
- `scissors` (tijeras)

### Paso 5: Ver resultados

**Ver estado de la partida:**
```bash
curl http://localhost:3000/api/v1/matches/MATCH_ID
```

**Ver estadísticas de Alice:**
```bash
curl http://localhost:3000/api/v1/players/ALICE_ID/stats
```

**Ver tabla de posiciones:**
```bash
curl http://localhost:3000/api/v1/players/leaderboard
```

---

## 📚 Recursos Útiles

| Recurso | URL |
|---------|-----|
| **API Root** | http://localhost:3000 |
| **Health Check** | http://localhost:3000/api/v1/health |
| **Swagger Docs** | http://localhost:3000/api-docs |
| **Postman Collection** | `postman_collection.json` |

---

## 🛠️ Comandos Útiles

```bash
# Desarrollo
npm run dev           # Iniciar con hot reload
npm run build         # Compilar TypeScript
npm start             # Iniciar en producción

# Testing
npm test              # Ejecutar todos los tests
npm run test:watch    # Tests en modo watch

# Calidad de código
npm run lint          # Analizar código
npm run lint:fix      # Corregir problemas
npm run format        # Formatear código

# Docker
docker-compose up -d          # Iniciar servicios
docker-compose down           # Detener servicios
docker-compose logs -f api    # Ver logs de la API
docker-compose down -v        # Limpiar todo (incluye DB)
```

---

## 🐛 Solución de Problemas

### Error: "Cannot connect to MongoDB"

**Solución 1 (Docker):**
```bash
docker-compose down
docker-compose up -d mongodb
# Espera 10 segundos
docker-compose up -d api
```

**Solución 2 (Local):**
- Verifica que MongoDB esté corriendo: `mongod --version`
- Revisa el `MONGODB_URI` en tu archivo `.env`

### Error: "Port 3000 already in use"

**Solución:**
```bash
# Cambiar puerto en .env
PORT=3001

# O matar el proceso en el puerto 3000
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### Tests fallan

**Solución:**
```bash
# Limpiar y reinstalar
rm -rf node_modules package-lock.json
npm install
npm test
```

---

## 📖 Siguiente Paso

Lee el [README.md](README.md) completo para:
- Arquitectura detallada del proyecto
- Principios SOLID aplicados
- Endpoints completos
- Documentación avanzada

---

## 💡 Tips

- Usa **Postman** importando `postman_collection.json` para testing más fácil
- La documentación **Swagger** es interactiva - prueba los endpoints directamente
- Modo **desarrollo** incluye logs detallados de cada request
- Los tests están en `/tests` - úsalos como ejemplos de uso

---

¡Feliz codificación! 🎮🚀
