const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://mangelveragomez:DarioDanae1721@cluster0.0qm2ev9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
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

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});