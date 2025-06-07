const request = require('supertest');
const app = require('../../app'); // Usar app.js refactorizado
const User = require('../../models/User');
const mongoose = require('mongoose');

describe('Auth Endpoints', () => {
  // jest.setup.js maneja la conexión y desconexión de la BD en memoria

  beforeEach(async () => {
    await User.deleteMany({}); // Limpiar usuarios antes de cada test
  });

  describe('POST /api/auth/register', () => {
    it('debería registrar un nuevo usuario y devolver un token', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'New User',
          email: 'newuser@example.com',
          password: 'password123',
          role: 'client',
        });
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('name', 'New User');
      expect(res.body.user).toHaveProperty('email', 'newuser@example.com');

      // Verificar que el usuario se guardó en la BD
      const userInDb = await User.findOne({ email: 'newuser@example.com' });
      expect(userInDb).not.toBeNull();
    });

    it('debería fallar si el email ya existe', async () => {
      // Crear un usuario primero
      await User.create({ name: 'Existing User', email: 'existing@example.com', password: 'password1' });

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Another User',
          email: 'existing@example.com', // Email duplicado
          password: 'password2',
        });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('success', false);
      // El mensaje de error puede variar dependiendo de cómo se maneje el error de duplicado (Mongoose o controlador)
      // expect(res.body.error).toContain('E11000 duplicate key error'); // This depends on error handling
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Crear un usuario para pruebas de login
      const user = new User({ name: 'Login User', email: 'login@example.com', password: 'loginpassword' });
      await user.save(); // El hook pre-save hasheará la contraseña
    });

    it('debería loguear un usuario existente y devolver un token', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: 'loginpassword',
        });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('email', 'login@example.com');
    });

    it('debería fallar con credenciales incorrectas (password)', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: 'wrongpassword',
        });
      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body.error).toBe('Credenciales inválidas');
    });

     it('debería fallar con credenciales incorrectas (email no existe)', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'somepassword',
        });
      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body.error).toBe('Credenciales inválidas');
    });
  });
});
