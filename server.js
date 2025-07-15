const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

// Conexion mongodb
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://mangelveragomez:DarioDanae1721@cluster0.0qm2ev9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGODB_URI)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));



const ArteMarcial = mongoose.model('ArteMarcial', arteMarcialSchema);

// Routes
// Get all artes marciales
app.get('/api/artes-marciales', async (req, res) => {
  try {
    const { search, tipo, paisProcedencia, tipoContacto, demandasFisicas } = req.query;
    let query = {};

    // Aplicar filtros
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

// Opciones de filtros
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


app.get('/seed', async (req, res) => {
  try {
    // objeto con las artes marciales
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
        "historia": "El boxeo tiene raíces antiguas, remontándose al Antiguo Egipto y Grecia, donde se practicaba como un deporte de combate. En la antigua Grecia, se incorporó a los Juegos Olímpicos en el 688 a.C. Tras un declive, resurgió en Inglaterra en el siglo XVIII como \"prizefighting\", combates a puño limpio con apuestas. Las reglas de Queensberry, que introdujeron los guantes y asaltos regulados, se formalizaron en 1867, dando forma al boxeo moderno.",
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
        "historia": "Orígenes Japoneses: El Jiu-Jitsu, cuyo significado es \"arte suave\", se desarrolló en Japón durante el periodo feudal, utilizado por los samuráis para combate cuerpo a cuerpo, especialmente cuando estaban desarmados. Llegada a Brasil: Mitsuyo Maeda, un experto judoka, emigró a Brasil y enseñó sus conocimientos a la familia Gracie, quienes vieron el potencial de estas técnicas. Adaptación y Desarrollo: Carlos y Helio Gracie, con la ayuda de sus hermanos, transformaron el Jiu-Jitsu japonés, enfatizando técnicas de suelo y adaptándolas a sus propias características físicas, creando así el BJJ.",
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
        "filosofia": "Principales aspectos de la filosofía de la capoeira: Libertad: La capoeira surgió como una forma de escapar de la opresión y la esclavitud, y este espíritu de libertad sigue siendo fundamental en su práctica. Resistencia: La capoeira fue una herramienta de resistencia contra la opresión y la esclavitud, y esta idea de resistencia se mantiene presente en la práctica actual. Cultura: La capoeira es una manifestación cultural que preserva las tradiciones y la historia de los afrobrasileños. Espiritualidad: La capoeira incorpora elementos de diversas creencias africanas, como el candomblé, que influyen en la concepción de la energía y el espíritu. Expresión corporal: La capoeira es una forma de expresión a través del cuerpo, donde el movimiento, la música y la danza se combinan para crear una experiencia única. Disciplina y respeto: La capoeira fomenta la disciplina, el respeto mutuo y la valoración personal, contribuyendo al desarrollo integral del individuo.",
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
        "fortalezas": ["Técnicas de palanca", "Flexibilidad", "Control del oponente", "Luxaciones", "Combate en suelo", "Golpes de mano", "Multiples patadas"],
        "debilidades": ["Requiere mucha práctica", "Complejo para principiantes"],
        "demandasFisicas": "Media-Alta",
        "tecnicas": ["Llaves articulares", "Proyecciones", "Patadas circulares", "Puntos de presión"],
        "filosofia": "Armonía de mente, cuerpo y espíritu",
        "historia": "El hapkido es un arte marcial coreano que se centra en la defensa personal, destacando por sus técnicas de luxaciones, proyecciones y movimientos circulares. Su origen se remonta a Choi Yong Sul, quien regresó a Corea después de vivir en Japón y aprendió el Daito-ryu Aiki-jujutsu con Sokaku Takeda. Choi Yong Sul adaptó y combinó este estilo con técnicas de artes marciales coreanas, creando el Yu Kwon Sool, que más tarde se conocería como hapkido.",
        "imagenes": [],
        "videos": ["https://www.youtube.com/watch?v=jz5aIBE5NCw"]
      },
      {
        "nombre": "Iaido",
        "paisProcedencia": "Japón",
        "edadOrigen": "Siglo XVI",
        "tipo": "Arte de desenvainar la espada",
        "distanciasTrabajadas": ["Media", "Larga"],
        "armas": ["Katana"],
        "tipoContacto": "No-contacto",
        "focus": "Perfección técnica y mental",
        "fortalezas": ["Precisión extrema", "Control mental", "Elegancia"],
        "debilidades": ["No aplicable sin espada", "Muy especializado"],
        "demandasFisicas": "Media",
        "tecnicas": ["Desenvainar", "Cortar", "Limpiar", "Envainar"],
        "filosofia": "Perfección a través de la repetición",
        "historia": "El Iaido, un arte marcial japonés, se centra en el manejo de la katana, específicamente en las técnicas de desenvainado rápido y corte, así como en la posterior guarda de la espada. Sus orígenes se remontan a los samuráis del Japón feudal, quienes desarrollaron estas habilidades para la defensa personal y el combate. Con el tiempo, el Iaido evolucionó de ser una técnica de combate a un arte que busca el desarrollo personal, enfatizando la armonía entre cuerpo, mente y espíritu.",
        "imagenes": [],
        "videos": []
      },
      {
        "nombre": "Jeet Kune Do",
        "paisProcedencia": "Estados Unidos",
        "edadOrigen": "1960s",
        "tipo": "Filosofía de combate",
        "distanciasTrabajadas": ["Todas"],
        "armas": ["Variable"],
        "tipoContacto": "Variable",
        "focus": "Adaptabilidad total",
        "fortalezas": ["Flexibilidad", "Economía de movimiento", "Interceptación"],
        "debilidades": ["No estandarizado", "Requiere experiencia previa"],
        "demandasFisicas": "Variable",
        "tecnicas": ["Interceptación", "Trapping", "Combinaciones", "Adaptación"],
        "filosofia": "Sin limitaciones, absorber lo útil",
        "historia": "Filosofía de combate creada por Bruce Lee que rechaza las formas rígidas. Enfatiza la adaptabilidad, eficiencia y la absorción de técnicas útiles de cualquier arte marcial, siendo más una filosofía que un estilo fijo.",
        "imagenes": [],
        "videos": []
      },
      {
        "nombre": "Jiujutsu",
        "paisProcedencia": "Japón",
        "edadOrigen": "Período Muromachi",
        "tipo": "Arte marcial tradicional",
        "distanciasTrabajadas": ["Corta"],
        "armas": ["Armas pequeñas"],
        "tipoContacto": "Contacto completo",
        "focus": "Lucha cuerpo a cuerpo",
        "fortalezas": ["Técnicas de agarre", "Versatilidad", "Historia"],
        "debilidades": ["Menos sistematizado", "Variaciones múltiples"],
        "demandasFisicas": "Media-Alta",
        "tecnicas": ["Proyecciones", "Estrangulaciones", "Luxaciones", "Golpes"],
        "filosofia": "Arte suave que vence a la fuerza",
        "historia": "El Jujutsu, como arte marcial y sistema de combate, tiene raíces antiguas en Japón. Se desarrolló como un método de combate cuerpo a cuerpo que priorizaba el uso de la fuerza y técnicas de sumisión en lugar de armas, adaptándose a diversas situaciones en el campo de batalla y evolucionando a través de diferentes escuelas o estilos (ryu).",
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
        "nombre": "Kali",
        "paisProcedencia": "Filipinas",
        "edadOrigen": "Precolonial",
        "tipo": "Arte marcial tradicional",
        "distanciasTrabajadas": ["Corta", "Media", "Larga"],
        "armas": ["Bastones", "Cuchillos", "Espadas"],
        "tipoContacto": "Semi-contacto",
        "focus": "Combinado",
        "fortalezas": ["Versatilidad con armas", "Coordinación ambidiestra", "Realismo"],
        "debilidades": ["Complejo", "Dependiente de armas"],
        "demandasFisicas": "Media-Alta",
        "tecnicas": ["Sinawali", "Desarmes", "Trapping", "Flujo continuo"],
        "filosofia": "Adaptabilidad y fluidez",
        "historia": "El Kali tiene sus orígenes en las Filipinas, donde los indígenas lo desarrollaron como método de defensa personal, a menudo en respuesta a la invasión española. Originalmente, se practicaba con palos que simulaban armas blancas como cuchillos y espadas. El Kali se transmitió de generación en generación, adaptándose a las circunstancias y necesidades de la época.",
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
        "nombre": "Kendo",
        "paisProcedencia": "Japón",
        "edadOrigen": "Siglo XVIII",
        "tipo": "Arte marcial con espada",
        "distanciasTrabajadas": ["Media", "Larga"],
        "armas": ["Shinai", "Bokken"],
        "tipoContacto": "Contacto completo",
        "focus": "Esgrima japonesa",
        "fortalezas": ["Precisión", "Velocidad", "Disciplina mental"],
        "debilidades": ["Solo con espada", "Requiere equipo especial"],
        "demandasFisicas": "Media-Alta",
        "tecnicas": ["Cortes", "Estocadas", "Pasos", "Gritos (kiai)"],
        "filosofia": "Más allá de las técnicas de combate, el kendo enfatiza valores como el respeto, la cortesía, la autodisciplina y la superación personal. Busca formar individuos íntegros a través de un entrenamiento riguroso.",
        "historia": "El kendo, \"el camino de la espada\", es un arte marcial japonés moderno que evolucionó a partir del kenjutsu, la esgrima tradicional de los samuráis. Surgió a finales del siglo XIX, durante la era Meiji, cuando Japón se modernizaba rápidamente y los valores tradicionales estaban cambiando.",
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
        "nombre": "Kuk Sool Won",
        "paisProcedencia": "Corea del Sur",
        "edadOrigen": "1958",
        "tipo": "Arte marcial tradicional coreano",
        "distanciasTrabajadas": ["Corta", "Media", "Larga"],
        "armas": ["Espada", "Bastón", "Abanico", "Cuchillo"],
        "tipoContacto": "Semi-contacto",
        "focus": "Arte marcial completo",
        "fortalezas": ["Técnicas diversas", "Armas tradicionales", "Acrobacia"],
        "debilidades": ["Muy extenso", "Requiere años de estudio"],
        "demandasFisicas": "Alta",
        "tecnicas": ["Técnicas de mano", "Patadas", "Llaves", "Armas tradicionales"],
        "filosofia": "Preservación de artes marciales coreanas tradicionales",
        "historia": "Fundado por In Hyuk Suh en 1958, Kuk Sool Won es un sistema completo que preserva las artes marciales tradicionales coreanas.",
        "imagenes": [],
        "videos": []
      },
      {
        "nombre": "Kung Fu",
        "paisProcedencia": "China",
        "edadOrigen": "Siglo V",
        "tipo": "Arte marcial tradicional",
        "distanciasTrabajadas": ["Corta", "Media", "Larga"],
        "armas": ["Bastón", "Espada", "Lanza", "Nunchaku"],
        "tipoContacto": "Variable",
        "focus": "Desarrollo integral",
        "fortalezas": ["Diversidad de estilos", "Filosofía profunda", "Flexibilidad"],
        "debilidades": ["Muy amplio", "Puede ser impractical"],
        "demandasFisicas": "Media-Alta",
        "tecnicas": ["Formas animales", "Técnicas internas", "Armas tradicionales", "Meditación"],
        "filosofia": "Armonía entre cielo, tierra y humanidad",
        "historia": "Con más de 1500 años de historia, el Kung Fu abarca cientos de estilos diferentes.",
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
        "historia": "Arte marcial tradicional tailandés conocido como 'El Arte de las Ocho Extremidades', desarrollado por guerreros siameses.",
        "imagenes": [],
        "videos": []
      },
      {
        "nombre": "Pencak Silat",
        "paisProcedencia": "Indonesia",
        "edadOrigen": "Siglo XII",
        "tipo": "Arte marcial tradicional",
        "distanciasTrabajadas": ["Corta", "Media"],
        "armas": ["Keris", "Cuchillos", "Bastón"],
        "tipoContacto": "Variable",
        "focus": "Defensa personal integral",
        "fortalezas": ["Versatilidad", "Técnicas de cuchillo", "Movimientos fluidos"],
        "debilidades": ["Complejo", "Muchas variaciones"],
        "demandasFisicas": "Media-Alta",
        "tecnicas": ["Golpes angulares", "Barridos", "Palancas", "Armas blancas"],
        "filosofia": "Armonía espiritual y física",
        "historia": "Arte marcial del archipiélago indonesio con cientos de estilos regionales.",
        "imagenes": [],
        "videos": []
      },
      {
        "nombre": "Sambo",
        "paisProcedencia": "Rusia",
        "edadOrigen": "1920s",
        "tipo": "Arte marcial soviético",
        "distanciasTrabajadas": ["Corta", "Media"],
        "armas": [],
        "tipoContacto": "Contacto completo",
        "focus": "Lucha y defensa personal",
        "fortalezas": ["Proyecciones", "Lucha en el suelo", "Efectividad"],
        "debilidades": ["Menos énfasis en golpes", "No muy conocido"],
        "demandasFisicas": "Alta",
        "tecnicas": ["Proyecciones", "Sumisiones", "Técnicas de pierna", "Defensa personal"],
        "filosofia": "Autodefensa sin armas",
        "historia": "Desarrollado en la URSS en los años 1920, combinando judo, wrestling nativo y otras técnicas de lucha.",
        "imagenes": [],
        "videos": []
      },
      {
        "nombre": "Sanda",
        "paisProcedencia": "China",
        "edadOrigen": "1960s",
        "tipo": "Arte marcial moderna china",
        "distanciasTrabajadas": ["Corta", "Media", "Larga"],
        "armas": [],
        "tipoContacto": "Contacto completo",
        "focus": "Combate deportivo",
        "fortalezas": ["Combinación de técnicas", "Versatilidad", "Competición"],
        "debilidades": ["Menos tradicional", "Orientado al deporte"],
        "demandasFisicas": "Alta",
        "tecnicas": ["Puñetazos", "Patadas", "Proyecciones", "Barridos"],
        "filosofia": "Combate efectivo moderno",
        "historia": "Desarrollado en China en los años 1960 como la versión deportiva del kung fu.",
        "imagenes": [],
        "videos": []
      },
      {
        "nombre": "Sumo",
        "paisProcedencia": "Japón",
        "edadOrigen": "Siglo VIII",
        "tipo": "Lucha tradicional",
        "distanciasTrabajadas": ["Corta"],
        "armas": [],
        "tipoContacto": "Contacto completo",
        "focus": "Lucha de agarre",
        "fortalezas": ["Fuerza", "Equilibrio", "Técnica de agarre"],
        "debilidades": ["Limitado fuera del ring", "Requiere peso corporal"],
        "demandasFisicas": "Alta",
        "tecnicas": ["Empujes", "Levantamientos", "Barridos", "Proyecciones"],
        "filosofia": "Pureza, disciplina y ritual sintoísta",
        "historia": "Originado como ritual religioso sintoísta, el Sumo es uno de los deportes más antiguos de Japón.",
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
        "historia": "Desarrollado en Corea del Sur en los años 1950s, combinando artes marciales coreanas tradicionales con influencias del karate.",
        "imagenes": [],
        "videos": []
      },
      {
        "nombre": "Tai Chi",
        "paisProcedencia": "China",
        "edadOrigen": "Siglo XVII",
        "tipo": "Arte marcial interno",
        "distanciasTrabajadas": ["Corta", "Media"],
        "armas": ["Espada", "Abanico", "Lanza"],
        "tipoContacto": "No-contacto",
        "focus": "Salud y meditación",
        "fortalezas": ["Salud", "Relajación", "Longevidad"],
        "debilidades": ["Menos efectivo en combate", "Requiere años de práctica"],
        "demandasFisicas": "Baja",
        "tecnicas": ["Movimientos lentos", "Respiración", "Meditación", "Empuje de manos"],
        "filosofia": "Equilibrio del yin y yang",
        "historia": "Arte marcial interno chino que enfatiza la meditación en movimiento y el desarrollo de la energía interna (qi).",
        "imagenes": [],
        "videos": []
      },
      {
        "nombre": "Wing Chun",
        "paisProcedencia": "China",
        "edadOrigen": "Siglo XVIII",
        "tipo": "Arte marcial tradicional",
        "distanciasTrabajadas": ["Corta"],
        "armas": ["Bastones", "Cuchillos mariposa"],
        "tipoContacto": "Contacto completo",
        "focus": "Combate en corta distancia",
        "fortalezas": ["Economía de movimiento", "Velocidad", "Teoría de la línea central"],
        "debilidades": ["Limitado en larga distancia", "Menos patadas"],
        "demandasFisicas": "Media",
        "tecnicas": ["Golpes rectos", "Trapping", "Chi Sao", "Defensa simultánea"],
        "filosofia": "Simplicidad y eficiencia",
        "historia": "Desarrollado en el sur de China, popularizado por Ip Man y famoso por ser el estilo que practicó Bruce Lee.",
        "imagenes": [],
        "videos": []
      }
    ];

    //borrar datos
    await ArteMarcial.deleteMany({});
    console.log('Cleared existing data');

    
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


app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});