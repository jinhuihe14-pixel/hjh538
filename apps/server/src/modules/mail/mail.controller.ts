import { Controller, Get, Post, Param, UseGuards, Req, Query } from '@nestjs/common';
import { MailService } from './mail.service';
import { JwtAuthGuard } from '../user/guards/jwt-auth.guard';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Get('list')
  @UseGuards(JwtAuthGuard)
  async getMailList(
    @Req() req: any,
    @Query('page') page = '1',
    @Query('pageSize') pageSize = '20',
  ) {
    return this.mailService.getMailList(
      req.user.userId,
      Number(page),
      Number(pageSize),
    );
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async readMail(@Req() req: any, @Param('id') id: string) {
    return this.mailService.readMail(req.user.userId, id);
  }

  @Post(':id/claim')
  @UseGuards(JwtAuthGuard)
  async claimAttachments(@Req() req: any, @Param('id') id: string) {
    return this.mailService.claimAttachments(req.user.userId, id);
  }

  @Get('unread/count')
  @UseGuards(JwtAuthGuard)
  async getUnreadCount(@Req() req: any) {
    const count = await this.mailService.getUnreadCount(req.user.userId);
    return { count };
  }
}
