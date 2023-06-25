import { Module } from '@nestjs/common';
import { BookModule } from './book/book.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { UserService } from './user/user.service';

@Module({
  imports: [BookModule, UserModule, AuthModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
