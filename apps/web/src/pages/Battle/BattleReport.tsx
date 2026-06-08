import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { NavBar, Button } from 'antd-mobile';
import { battleApi } from '../../services';
import type { BattleReport } from '@game/shared';

export default function BattleReportPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [report, setReport] = useState<BattleReport | null>(null);
  const [currentRound, setCurrentRound] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (id) {
      loadReport();
    }
  }, [id]);

  const loadReport = async () => {
    try {
      const data = await battleApi.getReport(id!);
      setReport(data);
    } catch (e) {
      // ignore
    }
  };

  const playBattle = () => {
    if (!report) return;
    setIsPlaying(true);
    setCurrentRound(0);

    let round = 0;
    const timer = setInterval(() => {
      round++;
      setCurrentRound(round);
      if (round >= report.totalRounds) {
        clearInterval(timer);
        setIsPlaying(false);
      }
    }, 1000);
  };

  if (!report) {
    return <div className="text-center py-8 text-gray">加载中...</div>;
  }

  const rounds = report.rounds;
  const currentRoundData = rounds[currentRound] || rounds[0];

  return (
    <div className="min-h-full flex flex-col">
      <NavBar
        onBack={() => navigate(-1)}
        back={null}
        right={
          <span className="text-gold" onClick={() => navigate(-1)}>
            返回
          </span>
        }
      >
        战斗回放
      </NavBar>

      <div className="flex-1 p-3 space-y-3 overflow-auto">
        {/* 战斗结果 */}
        <div className="card text-center">
          <div className="text-2xl font-bold mb-2">
            {report.winner === 1 ? (
              <span className="text-gold">🎉 胜利！</span>
            ) : (
              <span className="text-red">💀 失败</span>
            )}
          </div>
          <div className="flex justify-around text-sm">
            <div>
              <div className="text-gray">攻方战力</div>
              <div className="text-gold font-bold">
                {report.attackerPower.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-gray">回合数</div>
              <div className="text-gold font-bold">{report.totalRounds}</div>
            </div>
            <div>
              <div className="text-gray">守方战力</div>
              <div className="text-gold font-bold">
                {report.defenderPower.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* 战斗场景 */}
        <div className="card">
          <div className="card-title">
            第 {currentRound + 1} 回合 / 共 {report.totalRounds} 回合
          </div>

          <div className="flex justify-between items-center py-4">
            {/* 攻方 */}
            <div className="space-y-2">
              {report.attackerLineup.slice(0, 3).map((unit) => (
                <div
                  key={unit.id}
                  className="w-16 h-20 rounded border-2 border-blue-500/50 bg-blue-900/30 flex flex-col items-center justify-center"
                >
                  <span className="text-xl">⚔️</span>
                  <div className="text-xs text-gray truncate w-full text-center">
                    {unit.id.slice(0, 4)}
                  </div>
                  <div className="w-12 h-1 bg-gray-700 rounded mt-1">
                    <div
                      className="h-full bg-green-500 rounded"
                      style={{ width: `${(unit.hp / unit.maxHp) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* VS */}
            <div className="text-2xl font-bold text-gold">VS</div>

            {/* 守方 */}
            <div className="space-y-2">
              {report.defenderLineup.slice(0, 3).map((unit) => (
                <div
                  key={unit.id}
                  className="w-16 h-20 rounded border-2 border-red-500/50 bg-red-900/30 flex flex-col items-center justify-center"
                >
                  <span className="text-xl">👹</span>
                  <div className="text-xs text-gray truncate w-full text-center">
                    {unit.id.slice(0, 4)}
                  </div>
                  <div className="w-12 h-1 bg-gray-700 rounded mt-1">
                    <div
                      className="h-full bg-green-500 rounded"
                      style={{ width: `${(unit.hp / unit.maxHp) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 回合信息 */}
        {currentRoundData && (
          <div className="card">
            <div className="card-title">回合详情</div>
            <div className="space-y-2 max-h-48 overflow-auto">
              {currentRoundData.actions.map((action, idx) => (
                <div key={idx} className="text-sm bg-dark/50 rounded p-2">
                  <div className="text-gold">
                    {action.actorSide === 1 ? '[我方]' : '[敌方]'}
                    使用 {action.skillName}
                  </div>
                  {action.targets.map((target, tIdx) => (
                    <div key={tIdx} className="text-xs text-gray ml-4 mt-1">
                      → {target.targetId}:{' '}
                      {target.damage ? `-${target.damage} 伤害` : ''}
                      {target.isCrit && ' 💥暴击'}
                      {target.isDodge && ' 闪避'}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 控制按钮 */}
      <div className="p-3 border-t border-gold/20 bg-dark/80">
        <div className="flex gap-3">
          <Button
            block
            onClick={() => setCurrentRound(Math.max(0, currentRound - 1))}
            disabled={currentRound <= 0}
          >
            上一回合
          </Button>
          <Button block color="warning" onClick={playBattle} disabled={isPlaying}>
            {isPlaying ? '播放中...' : '播放'}
          </Button>
          <Button
            block
            onClick={() =>
              setCurrentRound(
                Math.min(rounds.length - 1, currentRound + 1),
              )
            }
            disabled={currentRound >= rounds.length - 1}
          >
            下一回合
          </Button>
        </div>
      </div>
    </div>
  );
}
