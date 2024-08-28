const mongoose = require('mongoose');
const Todo = require('../src/models/Todo');

beforeAll(async () => {
  // Connexion à la base de données de test
  await mongoose.connect('mongodb://localhost:27017/todo_test', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  // Nettoyage de la base de données après les tests
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});

describe('Todo Model Test', () => {
  it('a. Devrait créer un Todo valide avec tous les champs requis', async () => {
    const todoData = { text: 'Test Todo' };
    const todo = new Todo(todoData);
    const savedTodo = await todo.save();

    expect(savedTodo).toHaveProperty('_id');
    expect(savedTodo).toHaveProperty('text', 'Test Todo');
    expect(savedTodo).toHaveProperty('completed', false);
    expect(savedTodo).toHaveProperty('createdAt');
    expect(savedTodo.createdAt).toBeInstanceOf(Date);
  });

  it("b. Devrait lever une erreur si le champ 'text' est manquant", async () => {
    const todoData = {};

    try {
      const todo = new Todo(todoData);
      await todo.save();
    } catch (error) {
      expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(error.errors.text).toHaveProperty('message', 'Path `text` is required.');
    }
  });

  it("c. Devrait définir 'completed' par défaut à false", async () => {
    const todoData = { text: 'Test Todo without completed' };
    const todo = new Todo(todoData);
    const savedTodo = await todo.save();

    expect(savedTodo).toHaveProperty('completed', false);
    expect(savedTodo.completed).toBe(false);
  });

  it("d. Devrait définir 'createdAt' automatiquement à la date actuelle lors de la création", async () => {
    const todoData = { text: 'Test Todo with date' };
    const todo = new Todo(todoData);
    const savedTodo = await todo.save();

    expect(savedTodo).toHaveProperty('createdAt');
    expect(savedTodo.createdAt).toBeInstanceOf(Date);
    
    const currentDate = new Date();
    expect(savedTodo.createdAt.getFullYear()).toBe(currentDate.getFullYear());
    expect(savedTodo.createdAt.getMonth()).toBe(currentDate.getMonth());
    expect(savedTodo.createdAt.getDate()).toBe(currentDate.getDate());
  });
});
