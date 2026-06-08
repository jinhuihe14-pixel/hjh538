import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, PullToRefresh, Button, Toast } from 'antd-mobile';
import { heroApi } from '../../services';
import { HeroItem } from '../../services/heroApi';
import { RARITY_NAMES, PROFESSION_NAMES } from '@game/shared';

export default function Hero() {
  const navigate = useNavigate();
  const [heroes, setHeroes] = useState<HeroItem[]>([]);
  const [lineup, setLineup] = useState<HeroItem[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [editing, setEditing] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [heroList, lineupList] = await Promise.all([
        heroApi.getList(),
        heroApi.getLineup(),
      ]);
      setHeroes(heroList);
      setLineup(lineupList);
      setSelectedIds(lineupList.map((h) => h.id));
    } catch (e) {
      // ignore
    }
  };

  const filteredHeroes = heroes.filter((h) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'lineup') return h.pos > 0;
    return h.rarity === Number(activeTab);
  });

  const handleSelectHero = (heroId: string) => {
    if (!editing) {
      navigate(`/hero/${heroId}`);
      return;
    }

    setSelectedIds((prev) => {
      if (prev.includes(heroId)) {
        return prev.filter((id) => id !== heroId);
      }
      if (prev.length >= 6) {
        Toast.show({ icon: 'fail', content: '阵容最多6个武将' });
        return prev;
      }
      return [...prev, heroId];
    });
  };

  const handleSaveLineup = async () => {
    try {
      setLoading(true);
      await heroApi.setLineup(selectedIds);
      Toast.show({ icon: 'success', content: '阵容保存成功' });
      setEditing(false);
      loadData();
    } catch (e) {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { key: 'all', title: '全部' },
    { key: 'lineup', title: '上阵' },
    { key: '5', title: 'UR' },
    { key: '4', title: 'SSR' },
    { key: '3', title: 'SR' },
    { key: '2', title: 'R' },
  ];

  return (
    <div className="space-y-3">
      {/* 顶部操作 */}
      <div className="flex justify-between items-center">
        <span className="text-gold font-bold">武将列表</span>
        <span
          className="text-sm text-gold cursor-pointer"
          onClick={() => {
            setEditing(!editing);
            if (!editing) {
              setSelectedIds(lineup.map((h) => h.id));
            }
          }}
        >
          {editing ? '取消' : '编辑阵容'}
        </span>
      </div>

      {/* 标签页 */}
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        {tabs.map((tab) => (
          <Tabs.Tab title={tab.title} key={tab.key} />
        ))}
      </Tabs>

      {/* 阵容信息 */}
      {editing && (
        <div className="card">
          <div className="text-sm text-gray mb-2">
            已选择 {selectedIds.length}/6
          </div>
          <div className="flex gap-2 flex-wrap">
            {selectedIds.map((id) => {
              const hero = heroes.find((h) => h.id === id);
              return (
                <div
                  key={id}
                  className="w-12 h-14 rounded border border-gold/50 flex items-center justify-center bg-dark/50 text-2xl"
                >
                  ⚔️
                </div>
              );
            })}
            {Array(6 - selectedIds.length)
              .fill(0)
              .map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="w-12 h-14 rounded border border-gray/30 flex items-center justify-center bg-dark/30 text-gray"
                >
                  +
                </div>
              ))}
          </div>
          <Button
            block
            color="warning"
            size="small"
            className="mt-3"
            loading={loading}
            onClick={handleSaveLineup}
          >
            保存阵容
          </Button>
        </div>
      )}

      {/* 武将列表 */}
      <PullToRefresh onRefresh={loadData}>
        <div className="grid grid-cols-4 gap-2">
          {filteredHeroes.map((hero) => (
            <div
              key={hero.id}
              className={`hero-card rarity-${getRarityClass(hero.rarity)} ${
                selectedIds.includes(hero.id) && editing ? 'ring-2 ring-yellow-400' : ''
              }`}
              onClick={() => handleSelectHero(hero.id)}
            >
              <div className="hero-avatar">⚔️</div>
              <div className="hero-info">
                <div className="hero-name truncate">{hero.name}</div>
                <div className="hero-level">
                  Lv.{hero.level} ⭐{hero.star}
                </div>
              </div>
              {hero.pos > 0 && (
                <div className="absolute top-1 right-1 bg-gold text-dark text-xs px-1 rounded font-bold">
                  {hero.pos}
                </div>
              )}
            </div>
          ))}
        </div>
      </PullToRefresh>
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
