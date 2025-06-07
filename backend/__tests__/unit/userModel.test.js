const mongoose = require('mongoose');
const User = require('../../models/User'); // Ajustar ruta según sea necesario

describe('User Model', () => {
  // No necesitamos conectar/desconectar aquí si jest.setup.js lo maneja globalmente

  beforeEach(async () => {
    // Limpiar la colección de usuarios antes de cada test
    await User.deleteMany({});
  });

  it('debería hashear la contraseña antes de guardar', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'client',
    };
    const user = new User(userData);
    await user.save();

    expect(user.password).not.toBe('password123');
    // Verificar que la contraseña hasheada es más larga (esto es una suposición básica)
    // expect(user.password.length).toBeGreaterThan(userData.password.length);

    // Para una prueba más robusta, necesitaríamos comparar con bcrypt, pero eso es parte de matchPassword
  });

  it('matchPassword debería retornar true para contraseña correcta', async () => {
    const rawPassword = 'password123';
    const user = new User({
      name: 'Test User Compare',
      email: 'testcompare@example.com',
      password: rawPassword,
    });
    await user.save(); // Guardar para que el hook pre-save hashee la contraseña

    const isMatch = await user.matchPassword(rawPassword);
    expect(isMatch).toBe(true);
  });

  it('matchPassword debería retornar false para contraseña incorrecta', async () => {
    const user = new User({
      name: 'Test User Compare Fail',
      email: 'testcomparefail@example.com',
      password: 'password123',
    });
    await user.save();

    const isMatch = await user.matchPassword('wrongpassword');
    expect(isMatch).toBe(false);
  });

  it('debería fallar si falta el email', async () => {
    const user = new User({ name: 'Test', password: 'password' });
    let err;
    try {
      await user.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.email).toBeDefined();
  });
});
