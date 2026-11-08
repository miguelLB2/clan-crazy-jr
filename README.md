# 🔥 BLOODFIRE ESPORTS - Portal Web Oficial del Clan de Free Fire

Sitio web oficial, completo y 100% responsivo para clanes de **Free Fire**, diseñado con estética gamer oscura, acentos en fuego ardiente (naranja y rojo), tipografías de impacto (Orbitron y Rajdhani) y optimizado para navegación desde teléfonos móviles.

---

## ⚡ Características Principales

### 🌐 Parte Pública (Cualquier visitante, sin login)
1. **Inicio / Portada**:
   - Escudo oficial con resplandor de fuego animado.
   - Nombre y lema del clan.
   - Botón directo de **"Únete al Clan"**.
   - **Podio Top 3 de la Semana**: Tarjetas destacadas con coronas y medallas de Oro, Plata y Bronce, apodo del miembro y sus honores semanales.
   - Vista previa de los últimos reconocimientos entregados en el Muro de Honor.
2. **Honores de la Semana**:
   - Tabla y tarjetas adaptables con medallas para el Top 3.
   - Buscador en tiempo real por nombre o ID de Free Fire.
   - Un solo número capturado de honores por cada miembro.
   - Botón de 1 toque para copiar el ID de Free Fire al portapapeles.
3. **Historial de Semanas**:
   - Selector interactivo para consultar semanas anteriores, fechas del período y el ranking histórico de honores.
4. **Muro de Premios (Salón de la Fama)**:
   - Galería de tarjetas de premios (ej. *MVP de la Semana*, *Más Constante*, *Mejor Novato*, *Premio Mensual de Honor*).
   - Cada premio incluye ícono gamer, descripción, ganador reconocido y semana o mes de entrega.
5. **Miembros Oficiales**:
   - Roster completo con apodo, ID de Free Fire (con botón copiar), rol distinguido con insignias (*Líder*, *Sublíder*, *Miembro*) y avatar opcional.
   - Filtros rápidos por rol y buscador.
6. **Sección Únete**:
   - Requisitos de ingreso configurables.
   - Botones directos con enlaces a **WhatsApp** y **Discord** oficiales del clan.

---

### 🛡️ Panel de Administración (`/admin` o botón en barra superior)
- **Acceso Protegido**: Ingreso exclusivo mediante **Firebase Authentication** (Email / Contraseña).
- **Captura Rápida de Honores (Optimizada para Celular)**:
  - Tabla ágil para capturar los honores de cada miembro en segundos directamente desde el teléfono o PC.
  - El ranking se recalcula e inserta automáticamente de mayor a menor honor.
- **Gestión de Semanas**:
  - Crear nuevas semanas (con fecha de inicio y fin).
  - Activar la semana en curso.
  - Editar y eliminar semanas anteriores.
- **Gestión de Miembros**:
  - Agregar nuevos jugadores (Nombre, ID de Free Fire, Rol y Avatar opcional).
  - Editar datos o eliminar miembros.
- **Gestión de Premios**:
  - Crear, editar o borrar reconocimientos con selector de íconos gamer (*Trophy*, *Flame*, *Crown*, *Star*, *Medal*, *Target*, *Shield*) y selección de ganador.
- **Configuración General del Clan**:
  - Cambiar nombre del clan, lema, enlace de grupo de WhatsApp, enlace de Discord y requisitos.
- **Cargar Datos de Ejemplo Iniciales**:
  - Botón de 1 solo clic en el panel para sembrar miembros, semanas y premios de ejemplo en cualquier momento.

---

## 🛠️ Stack Tecnológico
- **Frontend**: Vite + React 18
- **Estilos**: Tailwind CSS con paleta gamer fuego
- **Íconos**: Lucide React
- **Backend & Base de Datos**: Firebase (Authentication + Cloud Firestore)
- **Despliegue**: Firebase Hosting

---

## 🚀 Cómo Ejecutar Localmente

1. Clonar o abrir la carpeta del proyecto:
   ```bash
   cd c:\Clan
   ```

2. Instalar las dependencias (si aún no las tienes):
   ```bash
   npm install
   ```

3. Iniciar el servidor local de desarrollo:
   ```bash
   npm run dev
   ```

4. Abre en tu navegador la dirección mostrada (usualmente `http://localhost:5173`).

> 💡 **Nota sobre el Modo Demostración:**  
> Si aún no has conectado Firebase, la aplicación iniciará automáticamente en **Modo Local / Demo**. Podrás probar toda la navegación y entrar al panel `/admin` con cualquier correo y contraseña (mínimo 6 caracteres) para probar la captura de honores y la edición de datos.

---

## ☁️ Paso a Paso: Cómo Conectar tu Proyecto de Firebase

Sigue estos sencillos pasos para conectar tu propio proyecto en la nube:

### 1. Crear el Proyecto en Firebase Console
1. Ingresa a [Firebase Console](https://console.firebase.google.com/) con tu cuenta de Google.
2. Haz clic en **"Agregar proyecto"** (o "Crear un proyecto").
3. Asigna un nombre a tu proyecto (por ejemplo, `clan-bloodfire-ff`) y desactiva Google Analytics (opcional).
4. Haz clic en **"Crear proyecto"**.

---

### 2. Obtener las Credenciales Web
1. En la vista general de tu proyecto en Firebase, haz clic en el ícono de aplicación Web: **`</>`**.
2. Dale un apodo a la app (ej. `Web Clan`) y marca la casilla **"Configurar también Firebase Hosting"**.
3. Haz clic en **"Registrar app"**.
4. Verás un objeto `firebaseConfig` con valores como `apiKey`, `authDomain`, `projectId`, etc.
5. Abre el archivo `.env` en la raíz de tu proyecto y pega tus valores reales:
   ```env
   VITE_FIREBASE_API_KEY="AIzaSy..."
   VITE_FIREBASE_AUTH_DOMAIN="tu-proyecto.firebaseapp.com"
   VITE_FIREBASE_PROJECT_ID="tu-proyecto"
   VITE_FIREBASE_STORAGE_BUCKET="tu-proyecto.firebasestorage.app"
   VITE_FIREBASE_MESSAGING_SENDER_ID="123456789012"
   VITE_FIREBASE_APP_ID="1:123456789012:web:..."
   ```

---

### 3. Activar Firebase Authentication (Para el Admin)
1. En el menú lateral izquierdo de Firebase, ve a **Compilación > Authentication**.
2. Haz clic en **"Comenzar"**.
3. En la pestaña **"Método de acceso"** (Sign-in method), selecciona **Correo electrónico/Contraseña**.
4. Habilita la primera opción (**Habilitar**) y haz clic en **Guardar**.
5. Ve a la pestaña **"Users" (Usuarios)** y haz clic en **"Agregar usuario"**.
6. Ingresa tu correo de administrador y una contraseña segura.
   - *Este será el único usuario que podrá ingresar a `/admin`.*

---

### 4. Crear la Base de Datos Cloud Firestore
1. En el menú lateral de Firebase, ve a **Compilación > Firestore Database**.
2. Haz clic en **"Crear base de datos"**.
3. Elige la ubicación más cercana (por ejemplo `us-central1` o `southamerica-east1`).
4. Selecciona **"Iniciar en modo de producción"** y haz clic en **Habilitar**.
5. En la pestaña **Reglas** de Firestore, asegúrate de colocar las siguientes reglas (ya incluidas en el archivo `firestore.rules` del proyecto):
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       allow read: if true;
       allow write: if request.auth != null;
     }
   }
   ```
6. Haz clic en **Publicar**.

---

### 5. Sembrar los Primeros Datos
Una vez configurado tu archivo `.env`, inicia tu servidor (`npm run dev`), entra al **Panel Admin** (`#admin`), inicia sesión con el usuario que creaste en el paso 3 y haz clic en el botón superior **"Datos de Ejemplo"**. Esto guardará automáticamente en Firestore la configuración inicial del clan, los miembros de muestra y las semanas con honores.

---

## 🌐 Cómo Desplegar en Firebase Hosting

Para publicar tu página web en internet con dominio gratuito `.web.app` de Firebase:

1. Instala las herramientas de Firebase si no las tienes:
   ```bash
   npm install -g firebase-tools
   ```

2. Inicia sesión en tu cuenta de Google:
   ```bash
   firebase login
   ```

3. Vincula tu proyecto de Firebase:
   ```bash
   firebase use --add
   ```
   *(Selecciona tu proyecto en la lista y asígnale el alias `default`)*

4. Compila la aplicación para producción:
   ```bash
   npm run build
   ```

5. Despliega la web y las reglas de Firestore:
   ```bash
   firebase deploy
   ```

6. ¡Listo! La terminal te dará la URL pública (ejemplo: `https://tu-proyecto.web.app`) para que todos los miembros del clan y postulantes puedan ver la página.

---

## 🖼️ Personalizar el Logo del Clan
El escudo oficial se encuentra en:
```
public/assets/logo.png
```
Si deseas reemplazarlo con tu propio archivo de imagen:
1. Guarda tu logo con el nombre `logo.png` dentro de la carpeta `public/assets/`.
2. Actualiza también `public/favicon.png` para el icono del navegador si lo deseas.
3. El sitio web lo detectará automáticamente en el encabezado, hero y pie de página.
