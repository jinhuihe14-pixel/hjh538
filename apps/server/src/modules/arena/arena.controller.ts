import { Controller, Get, Post, UseGuards, Req, Query } from '@nestjs/common';
import { ArenaService } from './arena.service';
import { JwtAuthGuard } from '../user/guards/jwt-auth.guard';

@Controller('arena')
export class ArenaController {
  constructor(private readonly arenaService: ArenaService) {}

  @Get('season')
  @UseGuards(JwtAuthGuard)
  async getCurrentSeason() {
    return this.arenaService.getCurrentSeason();
  }

  @Get('rank/info')
  @UseGuards(JwtAuthGuard)
  async getRankInfo(@Req() req: any, @Query('seasonId') seasonId: string) {
    return this.arenaService.getRankInfo(req.user.userId, Number(seasonId));
  }

  @Get('rank/list')
  @UseGuards(JwtAuthGuard)
  async getRankList(
    @Query('seasonId') seasonId: string,
    @Query('page') page = '1',
    @Query('pageSize') pageSize = '20',
  ) {
    return this.arenaService.getRankList(
      Number(seasonId),
      Number(page),
      Number(pageSize),
    );
  }

  @Post('battle')
  @UseGuards(JwtAuthGuard)
  async startBattle(@Req() req: any) {
    return this.arenaService.startBattle(req.user.userId);
  }
}
