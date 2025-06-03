import {Controller, Get, Req, UseGuards} from '@nestjs/common';
import { AppService } from './app.service';
import {JwtAuthGuard} from "./auth/jwt-auth.guard";
import {Request} from "express";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
  }

  @Get()
  getHello() {
    return this.appService.getHello();
  }

  @Get('/test')
  @UseGuards(JwtAuthGuard)
  test(@Req() req: Request) {
    console.log('User in request:', req.user);

    return {
      status: 'success',
      message: 'Authenticated request successful'
    };
    }
}
