import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import { GAME_CONSTANTS } from '@game/shared';

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    nickname: string;
    avatar: string | null;
    level: number;
    vipLevel: number;
  };
}

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private redisService: RedisService,
    private jwtService: JwtService,
  ) {}

  async register(username: string, password: string, nickname?: string): Promise<LoginResponse> {
    const exists = await this.prisma.user.findUnique({ where: { username } });
    if (exists) {
      throw new BadRequestException('用户名已存在');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        nickname: nickname || username,
      },
    });

    await this.prisma.userResource.create({
      data: {
        userId: user.id,
        gold: 10000,
        silver: 50000,
        food: 20000,
        diamond: 100,
        stamina: 200,
      },
    });

    await this.prisma.userCity.create({
      data: {
        userId: user.id,
        mainHallLevel: 1,
        buildings: {
          farm: { level: 1, isUpgrading: false },
          silverMine: { level: 1, isUpgrading: false },
          barracks: { level: 1, isUpgrading: false },
          trainingGround: { level: 1, isUpgrading: false },
          forge: { level: 1, isUpgrading: false },
          warehouse: { level: 1, isUpgrading: false },
          wall: { level: 1, isUpgrading: false },
        },
        defenders: [],
      },
    });

    return this.createToken(user.id.toString(), user);
  }

  async login(username: string, password: string): Promise<LoginResponse> {
    const user = await this.prisma.user.findUnique({ where: { username } });
    if (!user) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    if (user.status !== 0) {
      throw new UnauthorizedException('账号已被封禁');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    return this.createToken(user.id.toString(), user);
  }

  async logout(token: string): Promise<void> {
    const sessionKey = `session:${token}`;
    await this.redisService.del(sessionKey);
  }

  async getUserInfo(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: BigInt(userId) },
      select: {
        id: true,
        username: true,
        nickname: true,
        avatar: true,
        level: true,
        exp: true,
        vipLevel: true,
        status: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('用户不存在');
    }

    const resources = await this.prisma.userResource.findUnique({
      where: { userId: BigInt(userId) },
    });

    return {
      ...user,
      id: user.id.toString(),
      resources,
    };
  }

  private async createToken(
    userId: string,
    user: { id: bigint; username: string; nickname: string; avatar: string | null; level: number; vipLevel: number },
  ): Promise<LoginResponse> {
    const token = uuidv4();
    const payload = { userId, username: user.username };
    const jwtToken = this.jwtService.sign(payload);

    const sessionKey = `session:${token}`;
    await this.redisService.set(
      sessionKey,
      JSON.stringify({
        userId,
        token: jwtToken,
        loginAt: Date.now(),
      }),
      GAME_CONSTANTS.SESSION_EXPIRE_DAYS * 24 * 60 * 60,
    );

    return {
      token,
      user: {
        id: user.id.toString(),
        username: user.username,
        nickname: user.nickname,
        avatar: user.avatar,
        level: user.level,
        vipLevel: user.vipLevel,
      },
    };
  }

  async validateToken(token: string): Promise<{ userId: string } | null> {
    const sessionKey = `session:${token}`;
    const sessionData = await this.redisService.get(sessionKey);
    if (!sessionData) {
      return null;
    }

    try {
      const session = JSON.parse(sessionData);
      return { userId: session.userId };
    } catch {
      return null;
    }
  }
}
