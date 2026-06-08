import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Tabs, Toast, Dialog } from 'antd-mobile';
import { battleApi } from '../../services';
import type { BattleReport } from '@game/shared';

export default function Battle() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('pve');
  const [battleReport, setBattleReport] = useState<BattleReport | null>(null);
  const [battling, setBattling] = useState(false);
  const [currentStage, setCurrentStage] = useState(1);

  const stages = [
    { id: 1, name: '黄巾之乱', difficulty: 1, reward: '1000银币' },
    { id: 2, name: '虎牢关', difficulty: 2, reward: '2000银币' },
    { id: 3, name: '官渡之战', difficulty: 3, reward: '3000银币' },
    { id: 4, name: '赤壁之战', difficulty: 4, reward: '5000银币' },
    { id: 5, name: '夷陵之战', difficulty: 5, reward: '8000银币' },
  ];

  const handleStartPvE = async (stageId: number) => {
    try {
      setBattling(true);
      const report = await battleApi.startPvE(stageId);
      setBattleReport(report);
      Dialog.show({
        title: report.winner === 1 ? '胜利！' : '失败...',
        content: `战斗回合数: ${report.totalRounds}\n攻方战力: ${report.attackerPower}\n守方战力: ${report.defenderPower}`,
        confirmText: '查看战报',
        cancelText: '关闭',
        onConfirm: () => {
          navigate(`/battle/report/${report.id}`);
        },
      });
    } catch (e) {
      // ignore
    } finally {
      setBattling(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="text-gold font-bold text-lg">⚔️ 征战</div>

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <Tabs.Tab title="PVE副本" key="pve" />
        <Tabs.Tab title="战报" key="report" />
      </Tabs>

      {activeTab === 'pve' && (
        <div className="space-y-3">
          <div className="card">
            <div className="card-title">当前进度: 第 {currentStage} 关</div>
            <div className="text-sm text-gray">
              通关可获得大量资源奖励
            </div>
          </div>

          <div className="space-y-2">
            {stages.map((stage) => (
              <div
                key={stage.id}
                className="card flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-gold">
                    第{stage.id}关 - {stage.name}
                  </div>
                  <div className="text-sm text-gray mt-1">
                    难度: {'⭐'.repeat(stage.difficulty)}
                  </div>
                  <div className="text-xs text-yellow-400 mt-1">
                    奖励: {stage.reward}
                  </div>
                </div>
                <Button
                  color="warning"
                  size="small"
                  loading={battling}
                  disabled={stage.id > currentStage}
                  onClick={() => handleStartPvE(stage.id)}
                >
                  {stage.id > currentStage ? '未解锁' : '挑战'}
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'report' && (
        <div className="text-center py-8">
          <div className="text-gray mb-4">暂无战报</div>
          <Button color="warning" size="small" onClick={() => setActiveTab('pve')}>
            去战斗
          </Button>
        </div>
      )}
    </div>
  );
}
