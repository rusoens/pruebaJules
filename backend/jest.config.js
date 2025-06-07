module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./jest.setup.js'], // Para setup de BD en memoria
  // coveragePathIgnorePatterns: ['/node_modules/'], // Opcional
};
