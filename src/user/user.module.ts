import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from '../prisma/prisma.module';
import {AdminGuard} from "../guards/isAdminGuard";
import {AdminOrOwnerGuard} from "../guards/admin-or-owner.guard";

@Module({
  imports: [
    PrismaModule,
  ],
  controllers: [UserController],
  providers: [UserService, AdminGuard, AdminOrOwnerGuard],
  exports: [UserService],
})
export class UserModule {}
