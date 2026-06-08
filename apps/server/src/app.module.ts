import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from './config/config.module';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';
import { SharedModule } from './shared/shared.module';
import { UserModule } from './modules/user/user.module';
import { HeroModule } from './modules/hero/hero.module';
import { BattleModule } from './modules/battle/battle.module';
import { CityModule } from './modules/city/city.module';
import { ArenaModule } from './modules/arena/arena.module';
import { MailModule } from './modules/mail/mail.module';
import { EquipmentModule } from './modules/equipment/equipment.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule,
    PrismaModule,
    RedisModule,
    SharedModule,
    UserModule,
    HeroModule,
    BattleModule,
    CityModule,
    ArenaModule,
    MailModule,
    EquipmentModule,
  ],
})
export class AppModule {}
