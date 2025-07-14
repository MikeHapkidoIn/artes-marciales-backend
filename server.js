const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://mangelveragomez:DarioDanae1721@cluster0.0qm2ev9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGODB_URI)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Arte Marcial Schema
const arteMarcialSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  paisProcedencia: { type: String, required: true },
  edadOrigen: { type: String, required: true },
  tipo: { type: String, required: true },
  distanciasTrabajadas: [String],
  armas: [String],
  tipoContacto: { type: String, required: true },
  focus: { type: String, required: true },
  fortalezas: [String],
  debilidades: [String],
  demandasFisicas: { type: String, required: true },
  tecnicas: [String],
  filosofia: { type: String, required: true },
  historia: { type: String, required: true },
  imagenes: [String],
  videos: [String]
}, {
  timestamps: true
});

const ArteMarcial = mongoose.model('ArteMarcial', arteMarcialSchema);

// Routes
// Get all artes marciales
app.get('/api/artes-marciales', async (req, res) => {
  try {
    const { search, tipo, paisProcedencia, tipoContacto, demandasFisicas } = req.query;
    let query = {};

    // Apply filters
    if (search) {
      query.$or = [
        { nombre: { $regex: search, $options: 'i' } },
        { paisProcedencia: { $regex: search, $options: 'i' } },
        { focus: { $regex: search, $options: 'i' } }
      ];
    }
    if (tipo) query.tipo = tipo;
    if (paisProcedencia) query.paisProcedencia = paisProcedencia;
    if (tipoContacto) query.tipoContacto = tipoContacto;
    if (demandasFisicas) query.demandasFisicas = demandasFisicas;

    const artesMarciales = await ArteMarcial.find(query).sort({ nombre: 1 });
    
    res.json({
      success: true,
      count: artesMarciales.length,
      data: artesMarciales
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get single arte marcial
app.get('/api/artes-marciales/:id', async (req, res) => {
  try {
    const arteMarcial = await ArteMarcial.findById(req.params.id);
    if (!arteMarcial) {
      return res.status(404).json({ success: false, error: 'Arte marcial not found' });
    }
    res.json({ success: true, data: arteMarcial });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Compare artes marciales
app.post('/api/compare', async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || ids.length < 2) {
      return res.status(400).json({ success: false, error: 'Need at least 2 IDs to compare' });
    }

    const artesMarciales = await ArteMarcial.find({ _id: { $in: ids } });
    
    if (artesMarciales.length !== ids.length) {
      return res.status(404).json({ success: false, error: 'One or more artes marciales not found' });
    }

    res.json({ success: true, data: artesMarciales });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get filter options
app.get('/api/filters', async (req, res) => {
  try {
    const tipos = await ArteMarcial.distinct('tipo');
    const paises = await ArteMarcial.distinct('paisProcedencia');
    const tiposContacto = await ArteMarcial.distinct('tipoContacto');
    const demandasFisicas = await ArteMarcial.distinct('demandasFisicas');

    res.json({
      success: true,
      data: {
        tipos,
        paises,
        tiposContacto,
        demandasFisicas
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Seed route for production (TEMPORAL)
app.get('/seed', async (req, res) => {
  try {
    // Array completo de artes marciales
    const artesMarciales = [
      {
        "nombre": "Aikido",
        "paisProcedencia": "Japón",
        "edadOrigen": "1940s",
        "tipo": "Arte marcial moderno",
        "distanciasTrabajadas": ["Corta", "Media"],
        "armas": ["Bokken", "Jo", "Tanto"],
        "tipoContacto": "No-contacto",
        "focus": "Neutralización pacífica",
        "fortalezas": ["Uso de la fuerza del oponente", "Filosofía pacífica", "Técnicas circulares"],
        "debilidades": ["Menos efectivo contra resistencia", "Requiere mucha práctica"],
        "demandasFisicas": "Media",
        "tecnicas": ["Proyecciones circulares", "Inmovilizaciones", "Desarmes", "Respiración"],
        "filosofia": "Armonía y no-violencia",
        "historia": "El Aikido es un arte marcial japonés fundado por Morihei Ueshiba, conocido como O'Sensei, a principios del siglo XX. Se basa en las artes marciales tradicionales japonesas, como el Daito-ryu Aiki-jujutsu, y busca la armonía en lugar de la dominación o la destrucción.",
        "imagenes": [],
        "videos": []
      },
      {
        "nombre": "Boxeo",
        "paisProcedencia": "Inglaterra",
        "edadOrigen": "Siglo XVIII",
        "tipo": "Deporte de combate",
        "distanciasTrabajadas": ["Media", "Larga"],
        "armas": [],
        "tipoContacto": "Contacto completo",
        "focus": "Combate con puños",
        "fortalezas": ["Juego de pies", "Puñetazos precisos", "Condición física"],
        "debilidades": ["Solo manos", "Vulnerable a patadas"],
        "demandasFisicas": "Alta",
        "tecnicas": ["Jab", "Cross", "Ganchos", "Uppercuts", "Esquivas"],
        "filosofia": "Ciencia dulce y noble arte",
        "historia": "El boxeo tiene raíces antiguas, remontándose al Antiguo Egipto y Grecia, donde se practicaba como un deporte de combate.",
        "imagenes": [],
        "videos": []
      },
      {
        "nombre": "Brazilian Jiujitsu",
        "paisProcedencia": "Brasil",
        "edadOrigen": "1920s",
        "tipo": "Arte marcial moderna",
        "distanciasTrabajadas": ["Corta"],
        "armas": [],
        "tipoContacto": "Contacto completo",
        "focus": "Lucha en el suelo",
        "fortalezas": ["Dominancia en suelo", "Apalancamiento", "Técnica sobre fuerza"],
        "debilidades": ["Limitado de pie", "Requiere mucho tiempo"],
        "demandasFisicas": "Alta",
        "tecnicas": ["Guardias", "Sumisiones", "Transiciones", "Escapes"],
        "filosofia": "Técnica, timing y apalancamiento",
        "historia": "Desarrollado por la familia Gracie tras aprender jiu-jitsu japonés de Mitsuyo Maeda.",
        "imagenes": [],
        "videos": []
      },
      {
        "nombre": "Capoeira",
        "paisProcedencia": "Brasil",
        "edadOrigen": "Siglo XVI",
        "tipo": "Arte marcial cultural",
        "distanciasTrabajadas": ["Media", "Larga"],
        "armas": [],
        "tipoContacto": "No-contacto",
        "focus": "Arte, música y movimiento",
        "fortalezas": ["Creatividad", "Acrobacia", "Cultura rica"],
        "debilidades": ["Menos efectivo en combate real", "No es agresivo"],
        "demandasFisicas": "Alta",
        "tecnicas": ["Ginga", "Esquivas", "Patadas acrobáticas", "Movimientos de suelo"],
        "filosofia": "Libertad, resistencia y expresión cultural",
        "historia": "Desarrollada por esclavos africanos en Brasil, combina arte marcial, danza, música y acrobacia.",
        "imagenes": [],
        "videos": []
      },
      {
        "nombre": "Hapkido",
        "paisProcedencia": "Corea del Sur",
        "edadOrigen": "1950s",
        "tipo": "Arte marcial mixto",
        "distanciasTrabajadas": ["Corta", "Media", "Larga"],
        "armas": ["Bastón", "Espada", "Cuchillo"],
        "tipoContacto": "Contacto completo",
        "focus": "Defensa personal",
        "fortalezas": ["Técnicas de palanca", "Flexibilidad", "Control del oponente"],
        "debilidades": ["Requiere mucha práctica", "Complejo para principiantes"],
        "demandasFisicas": "Media-Alta",
        "tecnicas": ["Llaves articulares", "Proyecciones", "Patadas circulares", "Puntos de presión"],
        "filosofia": "Armonía de mente, cuerpo y espíritu",
        "historia": "Desarrollado por Choi Yong Sul quien aprendió Daito-ryu Aiki-jujutsu en Japón.",
        "imagenes": [],
        "videos": []
      },
      {
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
      },
      {
        "nombre": "Krav Maga",
        "paisProcedencia": "Israel",
        "edadOrigen": "1940s",
        "tipo": "Sistema de combate",
        "distanciasTrabajadas": ["Corta", "Media"],
        "armas": ["Defensa contra armas"],
        "tipoContacto": "Contacto completo",
        "focus": "Supervivencia y defensa personal",
        "fortalezas": ["Efectividad real", "Simplicidad", "Agresividad controlada"],
        "debilidades": ["No es deporte", "Puede ser violento"],
        "demandasFisicas": "Media-Alta",
        "tecnicas": ["Golpes directos", "Defensa contra armas", "Escapes", "Contraataques"],
        "filosofia": "Neutralizar la amenaza lo más rápido posible",
        "historia": "Desarrollado por Imi Lichtenfeld para las fuerzas de defensa israelíes.",
        "imagenes": [],
        "videos": []
      },
      {
        "nombre": "Muay Thai",
        "paisProcedencia": "Tailandia",
        "edadOrigen": "Siglo XVI",
        "tipo": "Arte marcial tradicional",
        "distanciasTrabajadas": ["Corta", "Media"],
        "armas": [],
        "tipoContacto": "Contacto completo",
        "focus": "Combate de pie",
        "fortalezas": ["Golpes con ocho extremidades", "Clinch", "Dureza"],
        "debilidades": ["Limitado en suelo", "Desgaste físico alto"],
        "demandasFisicas": "Muy alta",
        "tecnicas": ["Patadas con espinilla", "Rodillazos", "Codazos", "Clinch"],
        "filosofia": "Honor, respeto y tradición tailandesa",
        "historia": "Arte marcial tradicional tailandés conocido como 'El Arte de las Ocho Extremidades'.",
        "imagenes": [],
        "videos": []
      },
      {
        "nombre": "Judo",
        "paisProcedencia": "Japón",
        "edadOrigen": "1882",
        "tipo": "Arte marcial moderno",
        "distanciasTrabajadas": ["Corta"],
        "armas": [],
        "tipoContacto": "Contacto completo",
        "focus": "Proyecciones y lucha",
        "fortalezas": ["Proyecciones", "Deporte olímpico", "Técnica sobre fuerza"],
        "debilidades": ["Limitado de pie", "Pocas técnicas de golpeo"],
        "demandasFisicas": "Alta",
        "tecnicas": ["Proyecciones", "Inmovilizaciones", "Estrangulaciones", "Luxaciones"],
        "filosofia": "Camino suave, máxima eficiencia",
        "historia": "Creado por Jigoro Kano como evolución moderna del jiujutsu.",
        "imagenes": [],
        "videos": []
      },
      {
        "nombre": "Taekwondo",
        "paisProcedencia": "Corea del Sur",
        "edadOrigen": "1950s",
        "tipo": "Arte marcial moderno",
        "distanciasTrabajadas": ["Media", "Larga"],
        "armas": [],
        "tipoContacto": "Variable",
        "focus": "Patadas y deporte",
        "fortalezas": ["Patadas espectaculares", "Flexibilidad", "Deporte olímpico"],
        "debilidades": ["Limitado en corta distancia", "Menos técnicas de mano"],
        "demandasFisicas": "Alta",
        "tecnicas": ["Patadas altas", "Patadas saltando", "Puñetazos", "Poomsae"],
        "filosofia": "Cortesía, integridad, perseverancia",
        "historia": "Desarrollado en Corea del Sur en los años 1950s.",
        "imagenes": [],
        "videos": []
      }
    ];

    // Clear existing data
    await ArteMarcial.deleteMany({});
    console.log('Cleared existing data');

    // Insert new data
    const result = await ArteMarcial.insertMany(artesMarciales);
    console.log(`Inserted ${result.length} artes marciales`);

    res.json({
      success: true,
      message: `Database seeded successfully! Inserted ${result.length} artes marciales`,
      count: result.length
    });
  } catch (error) {
    console.error('Seeding error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});