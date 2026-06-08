import { useState } from 'react';
import { Tabs } from 'antd-mobile';

export default function Bag() {
  const [activeTab, setActiveTab] = useState('equipment');

  return (
    <div className="space-y-3">
      <div className="text-gold font-bold text-lg">🎒 背包</div>

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <Tabs.Tab title="装备" key="equipment" />
        <Tabs.Tab title="道具" key="item" />
        <Tabs.Tab title="材料" key="material" />
      </Tabs>

      {activeTab === 'equipment' && (
        <div className="card">
          <div className="card-title">装备列表</div>
          <div className="grid grid-cols-4 gap-2">
            {Array(12)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="aspect-[3/4] rounded border-2 border-blue-500/50 bg-dark/50 flex flex-col items-center justify-center"
                >
                  <span className="text-2xl">⚔️</span>
                  <div className="text-xs text-gray mt-1">武器</div>
                  <div className="text-xs text-gold">Lv.{i + 1}</div>
                </div>
              ))}
          </div>
        </div>
      )}

      {activeTab === 'item' && (
        <div className="card">
          <div className="card-title">道具</div>
          <div className="grid grid-cols-4 gap-2">
            {[
              { icon: '🎁', name: '召唤券', count: 10 },
              { icon: '💎', name: '强化石', count: 99 },
              { icon: '📜', name: '经验书', count: 50 },
              { icon: '🏆', name: '竞技场券', count: 5 },
            ].map((item, i) => (
              <div
                key={i}
                className="aspect-square rounded border border-gold/30 bg-dark/50 flex flex-col items-center justify-center relative"
              >
                <span className="text-2xl">{item.icon}</span>
                <div className="text-xs text-gray mt-1">{item.name}</div>
                <div className="absolute bottom-1 right-1 text-xs text-gold font-bold">
                  {item.count}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'material' && (
        <div className="text-center py-8 text-gray">
          暂无材料
        </div>
      )}
    </div>
  );
}
