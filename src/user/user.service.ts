import { PrismaService } from './../prisma_service/PrismaService';
import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

export const roundsOfHashing = 10;

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const userExists = await this.prisma.user.findUnique({
      where: {
        email: createUserDto.email,
      },
    });

    if (userExists) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      roundsOfHashing,
    );

    createUserDto.password = hashedPassword;

    const user = await this.prisma.user.create({
      data: createUserDto,
    });
    console.log(user.password);
    return user;
  }

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: string) {
    const userExists = await this.prisma.user.findFirst({
      where: {
        id,
      },
    });
    if (!userExists) {
      throw new NotFoundException('User does not exists!');
    }
    return userExists;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const userExists = await this.prisma.user.findFirst({
      where: {
        email: updateUserDto.email,
      },
    });

    if (!userExists) {
      throw new NotFoundException('User does not exists');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });

    return updatedUser;
  }

  async updateAvatar(id: string, fileName: string) {
    try {
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: {
          profileImage: fileName,
        },
      });

      return {
        profileImage: updatedUser.profileImage,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException({ message: error.message }, error.getStatus());
      }
      throw new HttpException(
        'Internal Server error: contact suporte',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
