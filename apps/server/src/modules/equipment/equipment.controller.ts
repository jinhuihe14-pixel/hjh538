import { Controller, Get, Post, Body, Param, UseGuards, Req, Query } from '@nestjs/common';
import { EquipmentService } from './equipment.service';
import { JwtAuthGuard } from '../user/guards/jwt-auth.guard';

@Controller('equipment')
export class EquipmentController {
  constructor(private readonly equipmentService: EquipmentService) {}

  @Get('list')
  @UseGuards(JwtAuthGuard)
  async getEquipmentList(
    @Req() req: any,
    @Query('page') page = '1',
    @Query('pageSize') pageSize = '20',
  ) {
    return this.equipmentService.getEquipmentList(
      req.user.userId,
      Number(page),
      Number(pageSize),
    );
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getEquipmentDetail(@Req() req: any, @Param('id') id: string) {
    return this.equipmentService.getEquipmentDetail(req.user.userId, id);
  }

  @Post(':id/equip')
  @UseGuards(JwtAuthGuard)
  async equipOnHero(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: { heroId: string },
  ) {
    return this.equipmentService.equipOnHero(req.user.userId, id, body.heroId);
  }

  @Post(':id/unequip')
  @UseGuards(JwtAuthGuard)
  async unequipFromHero(@Req() req: any, @Param('id') id: string) {
    return this.equipmentService.unequipFromHero(req.user.userId, id);
  }
}
