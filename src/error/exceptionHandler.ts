import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomException extends HttpException {
  constructor(mensagem: string, statusCode: HttpStatus) {
    super(mensagem, statusCode);
  }
}
