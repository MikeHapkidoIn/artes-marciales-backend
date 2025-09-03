const mongoose = require('mongoose');

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

module.exports = mongoose.model('ArteMarcial', arteMarcialSchema);