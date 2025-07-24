🥋 Backend API - Artes Marciales
Una API REST completa para gestionar información sobre diferentes artes marciales del mundo. Este backend proporciona endpoints para consultar, filtrar, comparar y administrar una base de datos de artes marciales con información detallada sobre cada disciplina.
📋 Tabla de Contenidos

Características
Tecnologías
Instalación
Configuración
Uso
Endpoints
Estructura de Datos
Ejemplos de Uso
Scripts Disponibles
Contribuir

✨ Características

CRUD completo para artes marciales
Filtros avanzados por tipo, país, contacto y demandas físicas
Búsqueda por nombre, país y enfoque
Comparación entre múltiples artes marciales
Seeding automático de la base de datos con 24 artes marciales
Validaciones robustas de datos
API RESTful bien estructurada
Manejo de errores centralizado

🛠 Tecnologías

Node.js - Runtime de JavaScript
Express.js - Framework web
MongoDB - Base de datos NoSQL
Mongoose - ODM para MongoDB
CORS - Manejo de políticas de origen cruzado
dotenv - Gestión de variables de entorno

🚀 Instalación

Clona el repositorio

bashgit clone <url-del-repositorio>
cd backend-artes-marciales

Instala las dependencias

bashnpm install

Configura las variables de entorno

bashcp .env.example .env
⚙️ Configuración
Crea un archivo .env en la raíz del proyecto con las siguientes variables:
env# Puerto del servidor
PORT=5000

# URI de conexión a MongoDB
MONGODB_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/artes-marciales?retryWrites=true&w=majority
🎯 Uso
Desarrollo
bashnpm start
Inicializar base de datos
Para poblar la base de datos con 24 artes marciales predefinidas:
bashnode seed.js
O accede a: GET /seed
El servidor estará disponible en http://localhost:5000
📡 Endpoints
Artes Marciales
MétodoEndpointDescripciónGET/api/artes-marcialesObtener todas las artes marcialesGET/api/artes-marciales/:idObtener un arte marcial específicoPOST/api/artes-marcialesCrear nuevo arte marcialPUT/api/artes-marciales/:idActualizar arte marcialDELETE/api/artes-marciales/:idEliminar arte marcial
Filtros y Utilidades
MétodoEndpointDescripciónGET/api/filtersObtener opciones de filtros disponiblesPOST/api/compareComparar múltiples artes marcialesGET/seedInicializar base de datosGET/healthEstado del servidor
Parámetros de Consulta
Para /api/artes-marciales:

search - Buscar por nombre, país o enfoque
tipo - Filtrar por tipo de arte marcial
paisProcedencia - Filtrar por país de origen
tipoContacto - Filtrar por tipo de contacto
demandasFisicas - Filtrar por nivel de demanda física

Ejemplo:
GET /api/artes-marciales?search=japon&tipoContacto=Contacto completo&demandasFisicas=Alta
📊 Estructura de Datos
Schema de Arte Marcial
javascript{
  "_id": "ObjectId",
  "nombre": "String (required)",
  "paisProcedencia": "String (required)", 
  "edadOrigen": "String (required)",
  "tipo": "String (required)",
  "distanciasTrabajadas": ["String"],
  "armas": ["String"],
  "tipoContacto": "String (required)",
  "focus": "String (required)",
  "fortalezas": ["String"],
  "debilidades": ["String"],
  "demandasFisicas": "String (required)",
  "tecnicas": ["String"],
  "filosofia": "String (required)",
  "historia": "String (required)",
  "imagenes": ["String"],
  "videos": ["String"],
  "createdAt": "Date",
  "updatedAt": "Date"
}
Ejemplo de Arte Marcial
json{
  "nombre": "Karate",
  "paisProcedencia": "Japón/Okinawa",
  "edadOrigen": "Siglo XVII",
  "tipo": "Arte marcial tradicional",
  "distanciasTrabajadas": ["Media", "Larga"],
  "armas": ["Kobudo (armas tradicionales)"],
  "tipoContacto": "Variable",
  "focus": "Técnicas lineales y defensa personal",
  "fortalezas": ["Golpes lineales potentes", "Disciplina", "Katas"],
  "debilidades": ["Limitado en suelo", "Rígido en algunos estilos"],
  "demandasFisicas": "Media-Alta",
  "tecnicas": ["Puñetazos directos", "Patadas", "Bloqueos", "Katas"],
  "filosofia": "Perfeccionamiento del carácter",
  "historia": "Originado en Okinawa combinando técnicas chinas con métodos locales.",
  "imagenes": [],
  "videos": []
}
🔧 Ejemplos de Uso
Obtener todas las artes marciales
javascriptfetch('http://localhost:5000/api/artes-marciales')
  .then(response => response.json())
  .then(data => console.log(data));
Buscar artes marciales japonesas
javascriptfetch('http://localhost:5000/api/artes-marciales?search=japon')
  .then(response => response.json())
  .then(data => console.log(data));
Crear nueva arte marcial
javascriptfetch('http://localhost:5000/api/artes-marciales', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    nombre: "Nueva Arte Marcial",
    paisProcedencia: "País",
    edadOrigen: "Siglo XX",
    tipo: "Arte marcial moderno",
    tipoContacto: "Contacto completo",
    focus: "Defensa personal",
    demandasFisicas: "Media",
    filosofia: "Filosofía del arte",
    historia: "Historia del arte marcial..."
  })
})
.then(response => response.json())
.then(data => console.log(data));
Comparar artes marciales
javascriptfetch('http://localhost:5000/api/compare', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    ids: ["id1", "id2", "id3"]
  })
})
.then(response => response.json())
.then(data => console.log(data));
📜 Scripts Disponibles
bash# Iniciar servidor
npm start

# Poblar base de datos
node seed.js
🎨 Respuestas de la API
Respuesta Exitosa
json{
  "success": true,
  "count": 24,
  "data": [...]
}
Respuesta de Error
json{
  "success": false,
  "error": "Mensaje de error descriptivo"
}
🗂 Estructura del Proyecto
proyecto/
├── routes/
│   └── artesMarciales.js    # Rutas modulares
├── seed.js                  # Script de inicialización
├── server.js               # Servidor principal
├── package.json
├── .env.example
└── README.md
🤝 Contribuir

Fork el proyecto
Crea una rama para tu feature (git checkout -b feature/AmazingFeature)
Commit tus cambios (git commit -m 'Add some AmazingFeature')
Push a la rama (git push origin feature/AmazingFeature)
Abre un Pull Request

📝 Notas

La base de datos incluye 23 artes marciales predefinidas
Todas las respuestas incluyen un campo success para fácil manejo de errores
Los filtros son case-insensitive
La API maneja validaciones robustas para todos los campos requeridos

🌟 Artes Marciales Incluidas
El sistema incluye información detallada sobre:

Asiáticas: Aikido, Karate, Judo, Kung Fu, Taekwondo, Muay Thai, Wing Chun, Tai Chi, etc.
Occidentales: Boxeo, Krav Maga, Sambo
Híbridas: Brazilian Jiu-Jitsu, Jeet Kune Do, MMA concepts
Tradicionales: Capoeira, Pencak Silat, Kali, Sumo