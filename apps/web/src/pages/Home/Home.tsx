import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Button } from 'antd-mobile';
import { heroApi, userApi } from '../../services';
import { useUserStore } from '../../stores/userStore';
import { UserInfoResponse } from '../../services/userApi';
import { HeroItem } from '../../services/heroApi';

export default function Home() {
  const navigate = useNavigate();
  const { userInfo } = useUserStore();
  const [userData, setUserData] = useState<UserInfoResponse | null>(null);
  const [lineup, setLineup] = useState<HeroItem[]>([]);
  const [power, setPower] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [user, lineupData, powerData] = await Promise.all([
        userApi.getInfo(),
        heroApi.getLineup(),
        heroApi.getPower(),
      ]);
      setUserData(user);
      setLineup(lineupData);
      setPower(powerData.power);
    } catch (e) {
      // ignore
    }
  };

  const menus = [
    { key: 'hero', title: '武将', icon: '👥', path: '/hero' },
    { key: 'battle', title: '征战', icon: '⚔️', path: '/battle' },
    { key: 'arena', title: '竞技场', icon: '🏆', path: '/arena' },
    { key: 'city', title: '城池', icon: '🏰', path: '/city' },
    { key: 'bag', title: '背包', icon: '🎒', path: '/bag' },
    { key: 'activity', title: '活动', icon: '🎉', path: '/activity' },
  ];

  return (
    <div className="space-y-4">
      {/* 玩家信息 */}
      <div className="card">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-700 flex items-center justify-center text-2xl">
            🎮
          </div>
          <div className="flex-1">
            <div className="font-bold text-gold text-lg">
              {userInfo?.nickname || '玩家'}
            </div>
            <div className="text-sm text-gray">
              Lv.{userInfo?.level || 1}
            </div>
            <div className="flex gap-3 mt-1 text-xs">
              <span className="text-yellow-400">⚡ 战力: {power.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {userData?.resources && (
          <div className="grid grid-cols-4 gap-2 mt-4 pt-3 border-t border-gold/20">
            <div className="text-center">
              <div className="text-xl">💰</div>
              <div className="text-xs text-gray">金币</div>
              <div className="text-sm text-gold font-bold">
                {userData.resources.gold.toLocaleString()}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xl">🪙</div>
              <div className="text-xs text-gray">银币</div>
              <div className="text-sm text-gold font-bold">
                {userData.resources.silver.toLocaleString()}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xl">🌾</div>
              <div className="text-xs text-gray">粮食</div>
              <div className="text-sm text-gold font-bold">
                {userData.resources.food.toLocaleString()}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xl">💎</div>
              <div className="text-xs text-gray">钻石</div>
              <div className="text-sm text-gold font-bold">
                {userData.resources.diamond}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 阵容展示 */}
      <div className="card">
        <div className="flex justify-between items-center mb-3">
          <span className="card-title mb-0">出战阵容</span>
          <span
            className="text-sm text-gold cursor-pointer"
            onClick={() => navigate('/hero')}
          >
            调整阵容 →
          </span>
        </div>
        <div className="flex gap-2 flex-wrap justify-center">
          {[1, 2, 3, 4, 5, 6].map((pos) => {
            const hero = lineup.find((h) => h.pos === pos);
            return (
              <div
                key={pos}
                className={`hero-card ${hero ? `rarity-${getRarityClass(hero.rarity)}` : ''}`}
              >
                {hero ? (
                  <>
                    <div className="hero-avatar">⚔️</div>
                    <div className="hero-info">
                      <div className="hero-name truncate">{hero.name}</div>
                      <div className="hero-level">Lv.{hero.level}</div>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 text-2xl">
                    +
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 功能入口 */}
      <div className="card">
        <div className="card-title">功能入口</div>
        <Grid columns={3} gap={12}>
          {menus.map((item) => (
            <Grid.Item key={item.key}>
              <div
                className="flex flex-col items-center justify-center py-3 rounded-lg bg-dark/50 cursor-pointer active:bg-dark/80"
                onClick={() => navigate(item.path)}
              >
                <div className="text-2xl mb-1">{item.icon}</div>
                <span className="text-xs text-gray">{item.title}</span>
              </div>
            </Grid.Item>
          ))}
        </Grid>
      </div>

      {/* 快捷按钮 */}
      <div className="flex gap-3">
        <Button block color="danger" onClick={() => navigate('/battle')}>
          ⚔️ 开始征战
        </Button>
        <Button block color="warning" onClick={() => navigate('/arena')}>
          🏆 竞技场
        </Button>
      </div>
    </div>
  );
}

function getRarityClass(rarity: number): string {
  const map: Record<number, string> = {
    1: 'N',
    2: 'R',
    3: 'SR',
    4: 'SSR',
    5: 'UR',
  };
  return map[rarity] || 'N';
}
