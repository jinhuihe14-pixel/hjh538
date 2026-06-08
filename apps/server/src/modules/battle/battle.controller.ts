import { Controller, Get, Post, Body, UseGuards, Req, Param, Query } from '@nestjs/common';
import { BattleService } from './battle.service';
import { JwtAuthGuard } from '../user/guards/jwt-auth.guard';

@Controller('battle')
export class BattleController {
  constructor(private readonly battleService: BattleService) {}

  @Post('pve')
  @UseGuards(JwtAuthGuard)
  async startPvEBattle(@Req() req: any, @Body() body: { stageId: number }) {
    return this.battleService.startPvEBattle(req.user.userId, body.stageId);
  }

  @Post('pvp')
  @UseGuards(JwtAuthGuard)
  async startPvPBattle(@Req() req: any, @Body() body: { defenderId: string }) {
    return this.battleService.startPvPBattle(req.user.userId, body.defenderId);
  }

  @Get('report/:id')
  @UseGuards(JwtAuthGuard)
  async getReport(@Param('id') id: string) {
    return this.battleService.getReport(id);
  }

  @Get('list')
  @UseGuards(JwtAuthGuard)
  async getReportList(
    @Req() req: any,
    @Query('page') page = '1',
    @Query('pageSize') pageSize = '20',
  ) {
    return this.battleService.getReportList(
      req.user.userId,
      Number(page),
      Number(pageSize),
    );
  }
}
