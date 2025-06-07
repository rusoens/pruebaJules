const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri, {
    // useNewUrlParser: true, // Deprecated
    // useUnifiedTopology: true, // Deprecated
  });
  // console.log(`MongoDB Memory Server started at ${mongoUri}`);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
  // console.log('MongoDB Memory Server stopped.');
});

// Limpiar todas las colecciones después de cada test (opcional, depende de la estrategia)
// afterEach(async () => {
//   const collections = mongoose.connection.collections;
//   for (const key in collections) {
//     const collection = collections[key];
//     await collection.deleteMany({});
//   }
// });
