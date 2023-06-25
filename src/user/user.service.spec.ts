import { PrismaService } from './../prisma_service/PrismaService';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';

const userList: User[] = [
  {
    id: '1',
    email: 'maria@gmail.com',
    name: 'maria',
    password: '12345678.gfdA',
    profileImage: null,
  },
  {
    id: '2',
    email: 'otto@gmail.com',
    name: 'otto',
    password: '12345f',
    profileImage: null,
  },
  {
    id: '3',
    email: 'otto@gmail.com',
    name: 'otto',
    password: '12345f',
    profileImage: null,
  },
];

describe('UserService', () => {
  let userService: UserService;
  let prismaService: PrismaService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findMany: jest.fn().mockReturnValue(userList),
              create: jest.fn().mockReturnValue(userList[0]),
              findUnique: jest.fn().mockReturnValue(null),
            },
          },
        },
      ],
    }).compile();
    userService = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should be defined', () => {
    expect(userService).toBeDefined();
    expect(prismaService).toBeDefined();
  });

  describe('findAll', () => {
    it(`should return an array of users`, async () => {
      const response = await userService.findAll();
      expect(response).toEqual(userList);
    });
  });

  describe('create', () => {
    it(`should return a created user`, async () => {
      const response = await userService.create(userList[0]);

      expect(response.password).toEqual(userList[0].password);

      expect(response).toEqual(userList[0]);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: userList[0].email },
      });
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: userList[0],
      });
    });
  });
});
