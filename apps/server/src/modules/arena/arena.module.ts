import { Module } from '@nestjs/common';
import { ArenaController } from './arena.controller';
import { ArenaService } from './arena.service';
import { BattleModule } from '../battle/battle.module';
import { HeroModule } from '../hero/hero.module';

@Module({
  imports: [BattleModule, HeroModule],
  controllers: [ArenaController],
  providers: [ArenaService],
  exports: [ArenaService],
})
export class ArenaModule {}
