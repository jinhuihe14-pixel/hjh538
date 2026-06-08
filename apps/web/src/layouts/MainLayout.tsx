import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useUserStore } from '../stores/userStore';
import { NavBar, Badge } from 'antd-mobile';
import {
  AppOutline,
  UserOutline,
  CalendarOutline,
  PictureOutline,
  SetOutline,
} from 'antd-mobile-icons';
import { mailApi } from '../services/mailApi';

const tabs = [
  {
    key: '/',
    title: '主城',
    icon: <AppOutline />,
  },
  {
    key: '/hero',
    title: '武将',
    icon: <UserOutline />,
  },
  {
    key: '/battle',
    title: '征战',
    icon: <CalendarOutline />,
  },
  {
    key: '/city',
    title: '城池',
    icon: <PictureOutline />,
  },
  {
    key: '/user',
    title: '我的',
    icon: <SetOutline />,
  },
];

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useUserStore();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  useEffect(() => {
    if (token) {
      loadUnreadCount();
    }
  }, [token]);

  const loadUnreadCount = async () => {
    try {
      const res = await mailApi.getUnreadCount();
      setUnreadCount(res.count);
    } catch (e) {
      // ignore
    }
  };

  const showTabBar = !location.pathname.startsWith('/hero/') &&
    !location.pathname.startsWith('/battle/');

  return (
    <div className="app-container">
      {showTabBar && (
        <div className="game-header">
          <div className="flex items-center gap-2">
            <span className="text-gold font-bold">三国策略OL</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="resource-bar">
              <span className="resource-icon">💎</span>
              <span className="resource-value">100</span>
            </div>
          </div>
        </div>
      )}

      <div className={`game-content ${showTabBar ? 'pb-16' : ''}`}>
        <Outlet />
      </div>

      {showTabBar && (
        <div className="game-footer">
          {tabs.map((item) => (
            <div
              key={item.key}
              className={`tab-item ${location.pathname === item.key ? 'active' : ''}`}
              onClick={() => navigate(item.key)}
            >
              <span className="icon">
                {item.key === '/user' && unreadCount > 0 ? (
                  <Badge content={unreadCount}>
                    {item.icon}
                  </Badge>
                ) : (
                  item.icon
                )}
              </span>
              <span>{item.title}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
