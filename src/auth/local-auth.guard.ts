import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  // You can override canActivate or handleRequest here if needed
  // For basic username/password, the default behavior is often sufficient.
  // Example: To initiate session after login (if using sessions)
  // async canActivate(context: ExecutionContext): Promise<boolean> {
  //   const result = (await super.canActivate(context)) as boolean;
  //   const request = context.switchToHttp().getRequest();
  //   await super.logIn(request); // This establishes a session
  //   return result;
  // }
} 