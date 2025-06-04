import {
    CanActivate,
    ExecutionContext,
    Injectable,
    ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        console.log(user)
        if (!user) {
            throw new ForbiddenException();
        }

        if (!user.isAdmin) {
            throw new ForbiddenException();
        }

        return true;
    }
}
