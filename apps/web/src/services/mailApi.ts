import request from './request';

export interface MailItem {
  id: string;
  type: number;
  title: string;
  content: string;
  attachments: any[];
  isRead: boolean;
  isClaimed: boolean;
  expiredAt: string;
  createdAt: string;
}

export const mailApi = {
  getList: (page = 1, pageSize = 20) => {
    return request.get<any, { list: MailItem[]; total: number; page: number; pageSize: number }>(
      '/mail/list',
      { params: { page, pageSize } },
    );
  },

  readMail: (id: string) => {
    return request.get<any, MailItem>(`/mail/${id}`);
  },

  claimAttachments: (id: string) => {
    return request.post(`/mail/${id}/claim`);
  },

  getUnreadCount: () => {
    return request.get<any, { count: number }>('/mail/unread/count');
  },
};
