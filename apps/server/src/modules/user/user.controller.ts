import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RegisterDto, LoginDto } from './dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.userService.register(dto.username, dto.password, dto.nickname);
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.userService.login(dto.username, dto.password);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: any) {
    const token = req.headers.authorization?.replace('Bearer ', '') || '';
    return this.userService.logout(token);
  }

  @Get('info')
  @UseGuards(JwtAuthGuard)
  async getInfo(@Req() req: any) {
    return this.userService.getUserInfo(req.user.userId);
  }
}
