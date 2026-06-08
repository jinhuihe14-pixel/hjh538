import { useNavigate } from 'react-router-dom';
import { Button, List, Dialog, Toast } from 'antd-mobile';
import { useUserStore } from '../../stores/userStore';
import { userApi } from '../../services';
import { useEffect, useState } from 'react';
import { UserInfoResponse } from '../../services/userApi';

export default function UserPage() {
  const navigate = useNavigate();
  const { userInfo, clearAuth } = useUserStore();
  const [userData, setUserData] = useState<UserInfoResponse | null>(null);

  useEffect(() => {
    loadUserInfo();
  }, []);

  const loadUserInfo = async () => {
    try {
      const data = await userApi.getInfo();
      setUserData(data);
    } catch (e) {
      // ignore
    }
  };

  const handleLogout = () => {
    Dialog.show({
      title: '确认退出',
      content: '确定要退出登录吗？',
      confirmText: '退出',
      cancelText: '取消',
      onConfirm: async () => {
        try {
          await userApi.logout();
        } catch (e) {
          // ignore
        }
        clearAuth();
        Toast.show({ icon: 'success', content: '已退出登录' });
        navigate('/login');
      },
    });
  };

  const menuItems = [
    { key: 'mail', title: '邮件', icon: '📧', badge: 3 },
    { key: 'settings', title: '设置', icon: '⚙️' },
    { key: 'feedback', title: '意见反馈', icon: '💬' },
    { key: 'about', title: '关于', icon: 'ℹ️' },
  ];

  return (
    <div className="space-y-4">
      {/* 用户信息卡片 */}
      <div className="card">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-700 flex items-center justify-center text-3xl">
            🎮
          </div>
          <div className="flex-1">
            <div className="text-xl font-bold text-gold">
              {userInfo?.nickname || '玩家'}
            </div>
            <div className="text-sm text-gray">ID: {userInfo?.id || '-'}</div>
            <div className="flex gap-3 mt-1 text-sm">
              <span className="text-yellow-400">
                Lv.{userInfo?.level || 1}
              </span>
              <span className="text-purple-400">
                VIP {userInfo?.vipLevel || 0}
              </span>
            </div>
          </div>
        </div>

        {userData?.resources && (
          <div className="grid grid-cols-5 gap-2 mt-4 pt-3 border-t border-gold/20 text-center">
            <div>
              <div className="text-lg">💰</div>
              <div className="text-xs text-gray">金币</div>
              <div className="text-sm text-gold font-bold truncate">
                {userData.resources.gold.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-lg">🪙</div>
              <div className="text-xs text-gray">银币</div>
              <div className="text-sm text-gold font-bold truncate">
                {userData.resources.silver.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-lg">🌾</div>
              <div className="text-xs text-gray">粮食</div>
              <div className="text-sm text-gold font-bold truncate">
                {userData.resources.food.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-lg">💎</div>
              <div className="text-xs text-gray">钻石</div>
              <div className="text-sm text-gold font-bold">
                {userData.resources.diamond}
              </div>
            </div>
            <div>
              <div className="text-lg">⚡</div>
              <div className="text-xs text-gray">体力</div>
              <div className="text-sm text-gold font-bold">
                {userData.resources.stamina}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 功能菜单 */}
      <div className="card p-0 overflow-hidden">
        {menuItems.map((item, index) => (
          <div
            key={item.key}
            className={`flex items-center justify-between p-4 ${
              index < menuItems.length - 1 ? 'border-b border-gold/10' : ''
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{item.icon}</span>
              <span>{item.title}</span>
            </div>
            <div className="flex items-center gap-2">
              {item.badge && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
              <span className="text-gray">›</span>
            </div>
          </div>
        ))}
      </div>

      {/* 退出登录 */}
      <Button block color="danger" onClick={handleLogout}>
        退出登录
      </Button>

      {/* 版本信息 */}
      <div className="text-center text-xs text-gray">
        版本 v0.1.0 · Demo
      </div>
    </div>
  );
}
