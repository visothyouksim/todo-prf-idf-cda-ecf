const Todo = require('../src/models/Todo');
const todoController = require('../src/controllers/todoController');

jest.mock('../src/models/Todo');

describe('Todo Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('a. getAllTodos: Devrait renvoyer tous les todos triés par date de création décroissante', async () => {
    const req = {};
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    const todos = [
      { text: 'First todo', createdAt: new Date('2023-01-01') },
      { text: 'Second todo', createdAt: new Date('2023-01-02') },
    ];

    Todo.find.mockImplementation(() => ({
      sort: jest.fn().mockResolvedValue(todos),
    }));

    await todoController.getAllTodos(req, res);

    expect(Todo.find).toHaveBeenCalledWith();
    expect(res.json).toHaveBeenCalledWith(todos.sort((a, b) => b.createdAt - a.createdAt));
  });

  it('b. createTodo: Devrait créer un nouveau todo avec le texte fourni et renvoyer un statut 201', async () => {
    const req = { body: { text: 'New Todo' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const newTodo = { text: 'New Todo', completed: false };

    Todo.prototype.save = jest.fn().mockResolvedValue(newTodo);

    await todoController.createTodo(req, res);

    expect(Todo.prototype.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(newTodo);
  });

  it("c. updateTodo: Devrait mettre à jour le statut 'completed' d'un todo existant", async () => {
    const req = {
      params: { id: '1' },
      body: { completed: true },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const existingTodo = { _id: '1', text: 'Existing Todo', completed: false, save: jest.fn().mockResolvedValue({ _id: '1', text: 'Existing Todo', completed: true }) };

    Todo.findById.mockResolvedValue(existingTodo);

    await todoController.updateTodo(req, res);

    expect(Todo.findById).toHaveBeenCalledWith('1');
    expect(existingTodo.completed).toBe(true);
    expect(existingTodo.save).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      _id: '1',
      text: 'Existing Todo',
      completed: true,
    }));
  });

  it('d. deleteTodo: Devrait supprimer un todo existant et renvoyer un message de confirmation', async () => {
    const req = { params: { id: '1' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const existingTodo = { _id: '1', text: 'Existing Todo', remove: jest.fn() };

    Todo.findById.mockResolvedValue(existingTodo);

    await todoController.deleteTodo(req, res);

    expect(Todo.findById).toHaveBeenCalledWith('1');
    expect(existingTodo.remove).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ message: 'Todo removed' });
  });
});
