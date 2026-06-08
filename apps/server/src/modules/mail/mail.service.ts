import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { MailType } from '@game/shared';
import dayjs from 'dayjs';

@Injectable()
export class MailService {
  constructor(private prisma: PrismaService) {}

  async getMailList(userId: string, page = 1, pageSize = 20) {
    const where = { userId: BigInt(userId) };

    const [total, mails] = await Promise.all([
      this.prisma.mail.count({ where }),
      this.prisma.mail.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    return {
      list: mails.map((m) => ({
        id: m.id.toString(),
        type: m.type,
        title: m.title,
        content: m.content,
        attachments: m.attachments,
        isRead: m.isRead,
        isClaimed: m.isClaimed,
        expiredAt: m.expiredAt,
        createdAt: m.createdAt,
      })),
      total,
      page,
      pageSize,
    };
  }

  async readMail(userId: string, mailId: string) {
    const mail = await this.prisma.mail.findFirst({
      where: { id: BigInt(mailId), userId: BigInt(userId) },
    });

    if (!mail) {
      throw new Error('邮件不存在');
    }

    if (!mail.isRead) {
      await this.prisma.mail.update({
        where: { id: BigInt(mailId) },
        data: { isRead: true },
      });
    }

    return { ...mail, id: mail.id.toString() };
  }

  async claimAttachments(userId: string, mailId: string) {
    const mail = await this.prisma.mail.findFirst({
      where: { id: BigInt(mailId), userId: BigInt(userId) },
    });

    if (!mail) {
      throw new Error('邮件不存在');
    }

    if (mail.isClaimed) {
      throw new Error('已领取过奖励');
    }

    const attachments = mail.attachments as any[];

    for (const item of attachments) {
      if (item.type === 'silver' || item.type === 'gold' || item.type === 'food') {
        await this.prisma.userResource.update({
          where: { userId: BigInt(userId) },
          data: {
            [item.type]: { increment: item.count },
          },
        });
      }
    }

    await this.prisma.mail.update({
      where: { id: BigInt(mailId) },
      data: { isClaimed: true, isRead: true },
    });

    return { success: true };
  }

  async sendMail(
    userId: string,
    type: MailType,
    title: string,
    content: string,
    attachments: any[] = [],
    expireDays = 30,
  ) {
    return this.prisma.mail.create({
      data: {
        userId: BigInt(userId),
        type,
        title,
        content,
        attachments,
        expiredAt: dayjs().add(expireDays, 'day').toDate(),
      },
    });
  }

  async getUnreadCount(userId: string) {
    return this.prisma.mail.count({
      where: {
        userId: BigInt(userId),
        isRead: false,
      },
    });
  }
}
