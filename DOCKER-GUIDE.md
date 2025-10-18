# 🐳 Guía Completa de Docker - Paso a Paso

## 📋 Índice
1. [Instalación de Docker](#instalación-de-docker)
2. [Construir la Imagen](#construir-la-imagen)
3. [Ejecutar con Docker Compose](#ejecutar-con-docker-compose)
4. [Subir a Docker Hub](#subir-a-docker-hub)
5. [Comandos Útiles](#comandos-útiles)
6. [Troubleshooting](#troubleshooting)

---

## 1. Instalación de Docker

### Windows
1. Descargar Docker Desktop: https://www.docker.com/products/docker-desktop
2. Instalar y reiniciar el sistema
3. Verificar instalación:
\`\`\`bash
docker --version
docker-compose --version
\`\`\`

### Linux
\`\`\`bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install docker.io docker-compose

# Verificar
docker --version
docker-compose --version
\`\`\`

---

## 2. Construir la Imagen

### Paso 1: Navegar al directorio del proyecto
\`\`\`bash
cd C:\Users\Nicolas\Desktop\backend-proyecto
\`\`\`

### Paso 2: Construir la imagen Docker
\`\`\`bash
docker build -t backend-entregable:latest .
\`\`\`

### Paso 3: Verificar que la imagen se creó
\`\`\`bash
docker images
\`\`\`

Deberías ver:
\`\`\`
REPOSITORY            TAG       IMAGE ID       CREATED         SIZE
backend-entregable    latest    abc123def456   2 minutes ago   200MB
\`\`\`

---

## 3. Ejecutar con Docker Compose

### Paso 1: Detener servicios existentes (si los hay)
\`\`\`bash
docker-compose down
\`\`\`

### Paso 2: Levantar todos los servicios
\`\`\`bash
docker-compose up -d
\`\`\`

El flag `-d` ejecuta en modo "detached" (segundo plano)

### Paso 3: Verificar que los servicios están corriendo
\`\`\`bash
docker-compose ps
\`\`\`

Deberías ver:
\`\`\`
NAME                COMMAND                  SERVICE    STATUS
backend-app         "docker-entrypoint.s…"   app        Up
backend-mongodb     "docker-entrypoint.s…"   mongodb    Up
\`\`\`

### Paso 4: Ver logs en tiempo real
\`\`\`bash
docker-compose logs -f
\`\`\`

### Paso 5: Probar la aplicación
Abre tu navegador en: http://localhost:8080

---

## 4. Subir a Docker Hub

### Paso 1: Crear cuenta en Docker Hub
1. Ir a https://hub.docker.com/
2. Crear una cuenta gratuita
3. Verificar el email

### Paso 2: Iniciar sesión desde la terminal
\`\`\`bash
docker login
\`\`\`

Ingresar tu username y password de Docker Hub

### Paso 3: Etiquetar la imagen con tu username
\`\`\`bash
# Formato: docker tag imagen-local username/nombre-repositorio:tag
docker tag backend-entregable:latest TU-USUARIO-DOCKERHUB/backend-entregable:latest
\`\`\`

**Ejemplo:**
\`\`\`bash
docker tag backend-entregable:latest juanperez/backend-entregable:latest
\`\`\`

### Paso 4: Subir la imagen a Docker Hub
\`\`\`bash
docker push TU-USUARIO-DOCKERHUB/backend-entregable:latest
\`\`\`

**Ejemplo:**
\`\`\`bash
docker push juanperez/backend-entregable:latest
\`\`\`

### Paso 5: Verificar en Docker Hub
1. Ir a https://hub.docker.com/
2. Iniciar sesión
3. Deberías ver tu imagen en "Repositories"

### Paso 6: Actualizar el README.md
Edita el README.md y reemplaza:
- `TUNOMBREDEUSUARIO` por tu username real de Docker Hub
- Actualiza el link: `https://hub.docker.com/r/TU-USUARIO/backend-entregable`

---

## 5. Comandos Útiles

### Ver contenedores corriendo
\`\`\`bash
docker ps
\`\`\`

### Ver todos los contenedores (incluso detenidos)
\`\`\`bash
docker ps -a
\`\`\`

### Ver logs de un contenedor específico
\`\`\`bash
docker logs backend-app
docker logs -f backend-app  # Seguir logs en tiempo real
\`\`\`

### Entrar a un contenedor (shell interactivo)
\`\`\`bash
docker exec -it backend-app sh
\`\`\`

### Detener todos los servicios
\`\`\`bash
docker-compose down
\`\`\`

### Detener y eliminar volúmenes (CUIDADO: borra datos)
\`\`\`bash
docker-compose down -v
\`\`\`

### Reconstruir imagen y levantar servicios
\`\`\`bash
docker-compose up -d --build
\`\`\`

### Ver uso de recursos
\`\`\`bash
docker stats
\`\`\`

### Limpiar imágenes no usadas
\`\`\`bash
docker image prune -a
\`\`\`

### Limpiar todo (contenedores, imágenes, volúmenes)
\`\`\`bash
docker system prune -a --volumes
\`\`\`

---

## 6. Troubleshooting

### Problema: Puerto 8080 ya está en uso
**Solución:**
\`\`\`bash
# Opción 1: Cambiar el puerto en docker-compose.yml
ports:
  - "3000:8080"  # Usar puerto 3000 en lugar de 8080

# Opción 2: Detener el servicio que usa el puerto 8080
# Windows:
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Linux:
sudo lsof -i :8080
sudo kill -9 <PID>
\`\`\`

### Problema: MongoDB no se conecta
**Solución:**
\`\`\`bash
# Verificar que MongoDB está corriendo
docker logs backend-mongodb

# Reiniciar servicios
docker-compose restart

# Si persiste, eliminar volúmenes y volver a crear
docker-compose down -v
docker-compose up -d
\`\`\`

### Problema: Cambios en el código no se reflejan
**Solución:**
\`\`\`bash
# Reconstruir la imagen
docker-compose up -d --build
\`\`\`

### Problema: Error al subir a Docker Hub - "denied"
**Solución:**
\`\`\`bash
# Asegurarse de estar logueado
docker logout
docker login

# Verificar que el tag tiene tu username
docker images
docker tag backend-entregable:latest TU-USUARIO/backend-entregable:latest
docker push TU-USUARIO/backend-entregable:latest
\`\`\`

### Problema: Imagen muy pesada
**Solución:**
Ya estamos usando `node:18-alpine` que es ligera. Si quieres optimizar más:
\`\`\`dockerfile
# En el Dockerfile, usar multi-stage build
FROM node:18-alpine AS builder
# ... build steps

FROM node:18-alpine
COPY --from=builder /app /app
\`\`\`

---

## 📝 Checklist Final

Antes de entregar, verifica:

- [ ] Docker Desktop instalado y corriendo
- [ ] Imagen construida exitosamente (\`docker images\`)
- [ ] Servicios corriendo con docker-compose (\`docker-compose ps\`)
- [ ] Aplicación accesible en http://localhost:8080
- [ ] MongoDB conectado correctamente
- [ ] Tests ejecutados y pasando (\`npm test\`)
- [ ] Imagen subida a Docker Hub
- [ ] README.md actualizado con tu usuario de Docker Hub
- [ ] Link de Docker Hub funcionando

---

## 🎯 Comandos Rápidos de Referencia

\`\`\`bash
# Construir y ejecutar TODO
docker-compose up -d --build

# Ver estado
docker-compose ps

# Ver logs
docker-compose logs -f

# Detener TODO
docker-compose down

# Subir a Docker Hub
docker login
docker tag backend-entregable:latest TU-USUARIO/backend-entregable:latest
docker push TU-USUARIO/backend-entregable:latest
\`\`\`

---

**¡Listo! Tu proyecto está completamente dockerizado y listo para entregar! 🚀**
