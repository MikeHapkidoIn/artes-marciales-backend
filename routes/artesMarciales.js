// routes/artesMarciales.js
const express = require('express');
const router = express.Router();

// Importar el modelo (se pasará desde server.js)
let ArteMarcial;

// Función para iniciar el modelo
const initModel = (model) => {
  ArteMarcial = model;
};

// obtiene artes marciales con filtros
router.get('/', async (req, res) => {
  try {
    const { search, tipo, paisProcedencia, tipoContacto, demandasFisicas } = req.query;
    let query = {};

    // aplicar filtros
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

// obtiene un arte marcial
router.get('/:id', async (req, res) => {
  try {
    const arteMarcial = await ArteMarcial.findById(req.params.id);
    if (!arteMarcial) {
      return res.status(404).json({ success: false, error: 'Arte marcial not found' });
    }
    res.json({ success: true, data: arteMarcial });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, error: 'Invalid ID format' });
    }
    res.status(500).json({ success: false, error: error.message });
  }
});

// CREATE - agrega nuevo arte marcial
router.post('/', async (req, res) => {
  try {
    const {
      nombre,
      paisProcedencia,
      edadOrigen,
      tipo,
      distanciasTrabajadas,
      armas,
      tipoContacto,
      focus,
      fortalezas,
      debilidades,
      demandasFisicas,
      tecnicas,
      filosofia,
      historia,
      imagenes,
      videos
    } = req.body;

    // Validacion
    if (!nombre || !paisProcedencia || !edadOrigen || !tipo || !tipoContacto || !focus || !demandasFisicas || !filosofia || !historia) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: nombre, paisProcedencia, edadOrigen, tipo, tipoContacto, focus, demandasFisicas, filosofia, historia'
      });
    }

    // Check si el arte marcial existe
    const existingArte = await ArteMarcial.findOne({ nombre: { $regex: new RegExp(`^${nombre}$`, 'i') } });
    if (existingArte) {
      return res.status(400).json({
        success: false,
        error: 'Arte marcial with this name already exists'
      });
    }

    const newArteMarcial = new ArteMarcial({
      nombre,
      paisProcedencia,
      edadOrigen,
      tipo,
      distanciasTrabajadas: distanciasTrabajadas || [],
      armas: armas || [],
      tipoContacto,
      focus,
      fortalezas: fortalezas || [],
      debilidades: debilidades || [],
      demandasFisicas,
      tecnicas: tecnicas || [],
      filosofia,
      historia,
      imagenes: imagenes || [],
      videos: videos || []
    });

    const savedArteMarcial = await newArteMarcial.save();

    res.status(201).json({
      success: true,
      message: 'Arte marcial created successfully',
      data: savedArteMarcial
    });

  } catch (error) {
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: validationErrors
      });
    }
    
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// UPDATE 
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check si el arte marcial existe
    const existingArteMarcial = await ArteMarcial.findById(id);
    if (!existingArteMarcial) {
      return res.status(404).json({
        success: false,
        error: 'Arte marcial not found'
      });
    }

    
    if (updateData.nombre && updateData.nombre !== existingArteMarcial.nombre) {
      const duplicateArte = await ArteMarcial.findOne({
        nombre: { $regex: new RegExp(`^${updateData.nombre}$`, 'i') },
        _id: { $ne: id }
      });
      
      if (duplicateArte) {
        return res.status(400).json({
          success: false,
          error: 'Another arte marcial with this name already exists'
        });
      }
    }

    // Update arte marcial
    const updatedArteMarcial = await ArteMarcial.findByIdAndUpdate(
      id,
      { $set: updateData },
      { 
        new: true, 
        runValidators: true 
      }
    );

    res.json({
      success: true,
      message: 'Arte marcial updated successfully',
      data: updatedArteMarcial
    });

  } catch (error) {
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: validationErrors
      });
    }

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid ID format'
      });
    }

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// DELETE - Delete arte marcial
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deletedArteMarcial = await ArteMarcial.findByIdAndDelete(id);

    if (!deletedArteMarcial) {
      return res.status(404).json({
        success: false,
        error: 'Arte marcial not found'
      });
    }

    res.json({
      success: true,
      message: 'Arte marcial deleted successfully',
      data: deletedArteMarcial
    });

  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid ID format'
      });
    }

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = { router, initModel };