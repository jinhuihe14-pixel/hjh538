import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { NavBar, Button } from 'antd-mobile';
import { heroApi } from '../../services';
import { HeroDetail } from '../../services/heroApi';
import { RARITY_NAMES, PROFESSION_NAMES, CAMP_NAMES } from '@game/shared';

export default function HeroDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [hero, setHero] = useState<HeroDetail | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      loadHero();
    }
  }, [id]);

  const loadHero = async () => {
    try {
      setLoading(true);
      const data = await heroApi.getDetail(id!);
      setHero(data);
    } catch (e) {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  if (!hero) {
    return <div className="text-center py-8 text-gray">加载中...</div>;
  }

  const rarityClass = `rarity-${getRarityClass(hero.rarity)}`;

  const attrList = [
    { key: 'hp', label: '生命', icon: '❤️' },
    { key: 'attack', label: '攻击', icon: '⚔️' },
    { key: 'defense', label: '防御', icon: '🛡️' },
    { key: 'speed', label: '速度', icon: '💨' },
    { key: 'critRate', label: '暴击率', icon: '💥' },
    { key: 'critDamage', label: '暴击伤害', icon: '🔥' },
  ];

  return (
    <div className="min-h-full">
      <NavBar
        onBack={() => navigate(-1)}
        back={null}
        right={
          <span className="text-gold" onClick={() => navigate(-1)}>
            返回
          </span>
        }
      >
        武将详情
      </NavBar>

      <div className="p-3 space-y-4">
        {/* 武将头像 */}
        <div className="card text-center">
          <div
            className={`w-24 h-28 mx-auto rounded-lg flex items-center justify-center text-5xl mb-3 ${rarityClass} border-2`}
            style={{ background: 'linear-gradient(180deg, rgba(100,100,150,0.3) 0%, rgba(50,50,100,0.3) 100%)' }}
          >
            ⚔️
          </div>
          <h2 className="text-xl font-bold text-gold mb-1">{hero.name}</h2>
          <div className="flex justify-center gap-3 text-sm">
            <span className={`${rarityClass} font-bold`}>
              {RARITY_NAMES[hero.rarity]}
            </span>
            <span className="text-gray">
              {PROFESSION_NAMES[hero.profession]}
            </span>
            <span className="text-gray">
              {CAMP_NAMES[hero.camp]}
            </span>
          </div>
          <div className="flex justify-center gap-4 mt-2 text-sm">
            <span className="text-gold">Lv.{hero.level}</span>
            <span className="text-yellow-400">⭐ {hero.star}星</span>
            <span className="text-blue-400">突破+{hero.quality}</span>
          </div>
        </div>

        {/* 属性面板 */}
        <div className="card">
          <div className="card-title">武将属性</div>
          <div className="grid grid-cols-2 gap-2">
            {attrList.map((item) => (
              <div
                key={item.key}
                className="flex items-center gap-2 bg-dark/50 rounded p-2"
              >
                <span className="text-lg">{item.icon}</span>
                <div>
                  <div className="text-xs text-gray">{item.label}</div>
                  <div className="text-sm font-bold text-gold">
                    {formatAttr(item.key, hero.attrs[item.key] || 0)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 技能面板 */}
        <div className="card">
          <div className="card-title">技能</div>
          <div className="space-y-2">
            <div className="bg-dark/50 rounded p-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-gold">普通攻击</span>
                <span className="text-xs text-gray">普攻</span>
              </div>
              <p className="text-xs text-gray mt-1">
                对单个敌人造成100%攻击力的物理伤害
              </p>
            </div>
            <div className="bg-dark/50 rounded p-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-blue-400">烈焰斩</span>
                <span className="text-xs text-gray">CD: 3回合</span>
              </div>
              <p className="text-xs text-gray mt-1">
                对单个敌人造成250%攻击力的物理伤害
              </p>
            </div>
          </div>
        </div>

        {/* 武将描述 */}
        <div className="card">
          <div className="card-title">武将简介</div>
          <p className="text-sm text-gray leading-relaxed">
            {hero.description}
          </p>
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-3">
          <Button block color="primary" onClick={() => navigate(-1)}>
            返回
          </Button>
          <Button block color="warning">
            强化
          </Button>
        </div>
      </div>
    </div>
  );
}

function getRarityClass(rarity: number): string {
  const map: Record<number, string> = {
    1: 'rarity-N',
    2: 'rarity-R',
    3: 'rarity-SR',
    4: 'rarity-SSR',
    5: 'rarity-UR',
  };
  return map[rarity] || 'rarity-N';
}

function formatAttr(key: string, value: number): string {
  const percentAttrs = [
    'critRate',
    'critDamage',
    'hitRate',
    'dodgeRate',
    'effectHit',
    'effectResist',
    'damageAdd',
    'damageReduce',
  ];
  if (percentAttrs.includes(key)) {
    return `${(value * 100).toFixed(1)}%`;
  }
  return Math.floor(value).toLocaleString();
}
