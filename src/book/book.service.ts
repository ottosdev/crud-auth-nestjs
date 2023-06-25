import { PrismaService } from './../prisma_service/PrismaService';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BookService {
  constructor(private prisma: PrismaService) {}

  async create(user_id: string, createBookDto: CreateBookDto) {
    try {
      const bookExists = await this.prisma.book.findFirst({
        where: {
          bar_code: createBookDto.bar_code,
        },
      });

      if (bookExists) {
        throw new HttpException('Book already exists!', HttpStatus.BAD_REQUEST);
      }

      const book = await this.prisma.book.create({
        data: {
          ...createBookDto,
          userId: user_id,
        },
      });

      return book;
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

  async findUserBook(id: string) {
    try {
      const userExists = await this.prisma.user.findFirst({
        where: {
          id: id,
        },
      });

      if (!userExists) {
        throw new Error('User does not exists');
      }

      const books = this.prisma.book.findMany({
        where: {
          userId: id,
        },
      });
      return books;
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

  async update(id: string, updateBookDto: UpdateBookDto) {
    try {
      const bookExists = await this.prisma.book.findUnique({
        where: { id },
      });

      if (!bookExists) {
        throw new HttpException(
          'Book doest not exists',
          HttpStatus.BAD_REQUEST,
        );
      }

      const updatedUser = await this.prisma.book.update({
        data: updateBookDto,
        where: {
          id: id,
        },
      });
      return updatedUser;
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException({ message: error.message }, error.getStatus());
      }

      throw new HttpException(
        'Internal server error: contact suport',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string) {
    try {
      const book = await this.prisma.book.findUnique({
        where: {
          id,
        },
      });
      if (!book) {
        throw new HttpException('Book does not exists', HttpStatus.BAD_REQUEST);
      }

      const bookDeleted = await this.prisma.book.delete({
        where: { id },
      });

      return bookDeleted;
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
