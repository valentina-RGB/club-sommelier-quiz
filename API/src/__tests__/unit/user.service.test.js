const UserService = require('../../modules/users/user.service');

describe('UserService', () => {
  let mockRepository;
  let userService;

  beforeEach(() => {
    // mock del repositorio
    mockRepository = {
      findAll: jest.fn()
    };

    // servicio usando el mock
    userService = new UserService(mockRepository);
  });

  it('debe retornar todos los usuarios', async () => {
    // Datos de prueba
    const fakeUsers = [
      { id: 1, email: 'test1@example.com' },
      { id: 2, email: 'test2@example.com' }
    ];

    // simulamos que el repositorio retorna esos usuarios
    mockRepository.findAll.mockResolvedValue(fakeUsers);

    const result = await userService.getAllUsers();

    expect(mockRepository.findAll).toHaveBeenCalled();
    expect(result).toEqual(fakeUsers);
  });
});
