import { useEffect, useState } from 'react';
import { Button, Toast } from 'antd-mobile';
import { cityApi } from '../../services';
import { CityInfo } from '../../services/cityApi';
import { BUILDING_NAMES } from '@game/shared';

export default function City() {
  const [city, setCity] = useState<CityInfo | null>(null);
  const [collecting, setCollecting] = useState(false);
  const [upgrading, setUpgrading] = useState<string | null>(null);

  useEffect(() => {
    loadCity();
  }, []);

  const loadCity = async () => {
    try {
      const data = await cityApi.getCity();
      setCity(data);
    } catch (e) {
      // ignore
    }
  };

  const handleCollect = async () => {
    try {
      setCollecting(true);
      const res = await cityApi.collectResources();
      Toast.show({
        icon: 'success',
        content: `获得银币+${Math.floor(res.silver)}，粮食+${Math.floor(res.food)}`,
      });
      loadCity();
    } catch (e) {
      // ignore
    } finally {
      setCollecting(false);
    }
  };

  const handleUpgrade = async (buildingType: string) => {
    try {
      setUpgrading(buildingType);
      await cityApi.upgradeBuilding(buildingType);
      Toast.show({ icon: 'success', content: '升级开始' });
      loadCity();
    } catch (e: any) {
      // ignore
    } finally {
      setUpgrading(null);
    }
  };

  const buildingOrder = [
    'mainHall',
    'farm',
    'silverMine',
    'barracks',
    'trainingGround',
    'forge',
    'warehouse',
    'wall',
  ];

  const buildingIcons: Record<string, string> = {
    mainHall: '🏛️',
    farm: '🌾',
    silverMine: '💰',
    barracks: '⚔️',
    trainingGround: '🎯',
    forge: '🔨',
    warehouse: '📦',
    wall: '🏰',
  };

  return (
    <div className="space-y-3">
      <div className="text-gold font-bold text-lg">🏰 城池</div>

      {/* 资源产出 */}
      <div className="card">
        <div className="flex justify-between items-center mb-3">
          <div>
            <div className="font-bold text-gold">资源产出</div>
            <div className="text-xs text-gray mt-1">
              最多累计24小时产出
            </div>
          </div>
          <Button
            color="warning"
            size="small"
            loading={collecting}
            onClick={handleCollect}
          >
            收取
          </Button>
        </div>

        {city?.offlineProfit && (
          <div className="grid grid-cols-2 gap-3 text-center mb-3">
            <div className="bg-dark/50 rounded p-2">
              <div className="text-lg">🪙</div>
              <div className="text-sm text-gray">银币产出</div>
              <div className="text-gold font-bold">
                +{Math.floor(city.offlineProfit.silver).toLocaleString()}
              </div>
            </div>
            <div className="bg-dark/50 rounded p-2">
              <div className="text-lg">🌾</div>
              <div className="text-sm text-gray">粮食产出</div>
              <div className="text-gold font-bold">
                +{Math.floor(city.offlineProfit.food).toLocaleString()}
              </div>
            </div>
          </div>
        )}

        {city?.production && (
          <div className="text-xs text-gray text-center">
            产出速度: 银币 {city.production.silverPerSec}/秒 · 粮食{' '}
            {city.production.foodPerSec}/秒
          </div>
        )}
      </div>

      {/* 城池防御 */}
      <div className="card">
        <div className="flex justify-between items-center">
          <span className="font-bold text-gold">城防值</span>
          <span className="text-gold">
            {city?.wallDefense.toLocaleString()} /{' '}
            {city?.wallMaxDefense.toLocaleString()}
          </span>
        </div>
        <div className="progress-bar mt-2">
          <div
            className="progress-fill"
            style={{
              width: city
                ? `${(city.wallDefense / city.wallMaxDefense) * 100}%`
                : '0%',
            }}
          />
        </div>
      </div>

      {/* 建筑列表 */}
      <div className="card">
        <div className="card-title">建筑</div>
        <div className="grid grid-cols-2 gap-2">
          {buildingOrder.map((type) => {
            const building = city?.buildings[type];
            if (!building) return null;

            return (
              <div
                key={type}
                className="bg-dark/50 rounded-lg p-3 border border-gold/20"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{buildingIcons[type]}</span>
                  <div>
                    <div className="text-sm font-bold">
                      {BUILDING_NAMES[type]}
                    </div>
                    <div className="text-xs text-gold">
                      Lv.{building.level}
                    </div>
                  </div>
                </div>

                {building.isUpgrading ? (
                  <div className="text-xs text-yellow-400 text-center py-1">
                    升级中...
                  </div>
                ) : (
                  <Button
                    block
                    size="mini"
                    color="primary"
                    loading={upgrading === type}
                    onClick={() => handleUpgrade(type)}
                  >
                    升级
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
