// user.controller.ts
import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterDto } from './dto/request.dto';
import { User } from './user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() data: RegisterDto): Promise<User> {
    return await this.userService.createUser(data);
  }
  @Get('/get-user-by-id')
  async getUserById(@Query('id') id: number): Promise<any> {
    const user = await this.userService.getUserById(id);

    return { statusCode: 200, message: 'SUCCESS', user };
  }
}
