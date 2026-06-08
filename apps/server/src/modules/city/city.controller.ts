import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { CityService } from './city.service';
import { JwtAuthGuard } from '../user/guards/jwt-auth.guard';

@Controller('city')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getCity(@Req() req: any) {
    return this.cityService.getCity(req.user.userId);
  }

  @Post('collect')
  @UseGuards(JwtAuthGuard)
  async collectResources(@Req() req: any) {
    return this.cityService.collectResources(req.user.userId);
  }

  @Post('upgrade')
  @UseGuards(JwtAuthGuard)
  async upgradeBuilding(
    @Req() req: any,
    @Body() body: { buildingType: string },
  ) {
    return this.cityService.upgradeBuilding(req.user.userId, body.buildingType);
  }
}
