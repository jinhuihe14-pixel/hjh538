import { Controller, Get, Post, Body, UseGuards, Req, Param } from '@nestjs/common';
import { HeroService } from './hero.service';
import { JwtAuthGuard } from '../user/guards/jwt-auth.guard';

@Controller('hero')
export class HeroController {
  constructor(private readonly heroService: HeroService) {}

  @Get('list')
  @UseGuards(JwtAuthGuard)
  async getHeroList(@Req() req: any) {
    return this.heroService.getHeroList(req.user.userId);
  }

  @Get('detail/:id')
  @UseGuards(JwtAuthGuard)
  async getHeroDetail(@Req() req: any, @Param('id') id: string) {
    return this.heroService.getHeroDetail(req.user.userId, id);
  }

  @Get('lineup')
  @UseGuards(JwtAuthGuard)
  async getLineup(@Req() req: any) {
    return this.heroService.getLineup(req.user.userId);
  }

  @Post('lineup')
  @UseGuards(JwtAuthGuard)
  async setLineup(@Req() req: any, @Body() body: { heroIds: string[] }) {
    return this.heroService.setLineup(req.user.userId, body.heroIds);
  }

  @Get('power')
  @UseGuards(JwtAuthGuard)
  async getPower(@Req() req: any) {
    const power = await this.heroService.calcTotalPower(req.user.userId);
    return { power };
  }
}
