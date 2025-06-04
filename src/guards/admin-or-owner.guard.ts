import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';

/**
 * Guard that allows:
 *  - Administrators (user.isAdmin === true) to perform any action.
 *  - Regular users (user.isAdmin === false) to act only on their own resource.
 *
 * Assumes that:
 *  - A JwtAuthGuard (or equivalent) has already populated `request.user`
 *    with `{ userId: string, isAdmin: boolean, … }`.
 *  - The route has a path parameter named `id` corresponding to the target user's numeric ID.
 *
 * Usage:
 *  @UseGuards(JwtAuthGuard, AdminOrOwnerGuard)
 *  @Patch(':id')
 *  async updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto) { … }
 *
 * @throws {ForbiddenException} if:
 *   - request.user is missing (unauthenticated),
 *   - request.user.isAdmin is false but `request.user.userId` ≠ route param `id`.
 */
@Injectable()
export class AdminOrOwnerGuard implements CanActivate {
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        const user = request.user as { userId: string; isAdmin: boolean };

        if (!user) {
            throw new ForbiddenException('User not authenticated');
        }

        // Admins can do anything
        if (user.isAdmin) {
            return true;
        }

        // Non‐admins can only act on their own profile
        const targetId = parseInt(request.params.id, 10);
        if (isNaN(targetId)) {
            throw new ForbiddenException('Invalid target user ID');
        }

        if (user.userId !== request.params.id) {
            throw new ForbiddenException('You can only modify your own profile');
        }

        return true;
    }
}
