import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Request,
  Res,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import path = require('path');
import { v4 as uuidv4 } from 'uuid';
import { of } from 'rxjs';
import { User } from '@prisma/client';
import { join } from 'path/posix';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

const storage = {
  storage: diskStorage({
    destination: './uploads/profileImages',
    filename: (req, file, cb) => {
      const filename: string =
        path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
      const extendion: string = path.parse(file.originalname).ext;
      console.log(extendion);
      cb(null, `${filename}${extendion}`);
    },
  }),
};

@ApiTags('users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      return this.userService.create(createUserDto);
    } catch (error) {
      if (error instanceof HttpException) {
        return { message: error.message, code: error.getStatus() };
      }
      throw new HttpException(
        'Internal Server error: contact suporte',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    try {
      return this.userService.findOne(id);
    } catch (error) {
      if (error instanceof HttpException) {
        return { message: error.message, code: error.getStatus() };
      }
      throw new HttpException(
        'Internal Server error: contact suporte',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      const user = this.userService.update(id, updateUserDto);

      return user;
    } catch (error) {
      if (error instanceof HttpException) {
        return { message: error.message, code: error.getStatus() };
      }
      throw new HttpException(
        'Internal Server error: contact suporte',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', storage))
  uploadFile(@UploadedFile() file, @Request() req) {
    const user: User = req.user.user;
    return this.userService.updateAvatar(user.id, file.filename);
    // return of({ imagePath: file.path });
  }

  @Get('profile-image/:imagename')
  @UseGuards(JwtAuthGuard)
  async findProfileByUser(@Param('imagename') imagename, @Res() res) {
    return of(
      res.sendFile(join(process.cwd(), 'uploads/profileImages/' + imagename)),
    );
  }
}
