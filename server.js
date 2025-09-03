const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const ArteMarcial = require('./models/ArteMarcial');
const { router: artesMarcialesRouter, initModel } = require('./routes/artesMarciales');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Inicializar modelo en rutas
initModel(ArteMarcial);
app.use('/api/artes-marciales', artesMarcialesRouter);

// Comparar artes marciales
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

// Filtros
app.get('/api/filters', async (req, res) => {
  try {
    const tipos = await ArteMarcial.distinct('tipo');
    const paises = await ArteMarcial.distinct('paisProcedencia');
    const tiposContacto = await ArteMarcial.distinct('tipoContacto');
    const demandasFisicas = await ArteMarcial.distinct('demandasFisicas');

    res.json({
      success: true,
      data: { tipos, paises, tiposContacto, demandasFisicas }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Añadir nuevo arte marcial con imágenes y videos por enlaces
app.post('/api/artes-marciales', async (req, res) => {
  try {
    const { nombre, paisProcedencia, edadOrigen, tipo, distanciasTrabajadas,
            armas, tipoContacto, focus, fortalezas, debilidades, demandasFisicas,
            tecnicas, filosofia, historia, imagenes = [], videos = [] } = req.body;

    const nuevoArte = new ArteMarcial({
      nombre, paisProcedencia, edadOrigen, tipo, distanciasTrabajadas,
      armas, tipoContacto, focus, fortalezas, debilidades, demandasFisicas,
      tecnicas, filosofia, historia, imagenes, videos
    });

    const guardado = await nuevoArte.save();
    res.status(201).json({ success: true, data: guardado });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});