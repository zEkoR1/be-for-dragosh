import {Controller, Get, Req, UseGuards} from '@nestjs/common';
import { AppService } from './app.service';
import {JwtAuthGuard} from "./auth/guards/jwt-auth.guard";
import {Request} from "express";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
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
