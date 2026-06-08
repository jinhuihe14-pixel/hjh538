import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Tabs, Toast } from 'antd-mobile';
import { arenaApi } from '../../services';
import { RankInfo, RankItem, SeasonInfo } from '../../services/arenaApi';
import { TIER_NAMES, TIER_ICONS } from '@game/shared';

export default function Arena() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('rank');
  const [season, setSeason] = useState<SeasonInfo | null>(null);
  const [myRank, setMyRank] = useState<RankInfo | null>(null);
  const [rankList, setRankList] = useState<RankItem[]>([]);
  const [battling, setBattling] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const seasonData = await arenaApi.getCurrentSeason();
      setSeason(seasonData);

      if (seasonData) {
        const [myRankData, rankListData] = await Promise.all([
          arenaApi.getRankInfo(seasonData.id),
          arenaApi.getRankList(seasonData.id, 1, 20),
        ]);
        setMyRank(myRankData);
        setRankList(rankListData.list);
      }
    } catch (e) {
      // ignore
    }
  };

  const handleStartBattle = async () => {
    try {
      setBattling(true);
      await arenaApi.startBattle();
      Toast.show({ icon: 'success', content: '战斗完成' });
      loadData();
    } catch (e) {
      // ignore
    } finally {
      setBattling(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="text-gold font-bold text-lg">🏆 排位赛</div>

      {/* 赛季信息 */}
      <div className="card">
        <div className="flex justify-between items-center">
          <div>
            <div className="font-bold text-gold">{season?.name || 'S1赛季'}</div>
            <div className="text-xs text-gray mt-1">
              进行中 · 剩余 21 天
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl">
              {TIER_ICONS[myRank?.tier || 1]}
            </div>
            <div className="text-sm text-gold">
              {TIER_NAMES[myRank?.tier || 1]}
            </div>
          </div>
        </div>

        {myRank && (
          <div className="grid grid-cols-4 gap-2 mt-4 pt-3 border-t border-gold/20 text-center">
            <div>
              <div className="text-xs text-gray">积分</div>
              <div className="text-gold font-bold">{myRank.score}</div>
            </div>
            <div>
              <div className="text-xs text-gray">排名</div>
              <div className="text-gold font-bold">#{myRank.rank}</div>
            </div>
            <div>
              <div className="text-xs text-gray">胜场</div>
              <div className="text-green-400 font-bold">{myRank.wins}</div>
            </div>
            <div>
              <div className="text-xs text-gray">负场</div>
              <div className="text-red-400 font-bold">{myRank.losses}</div>
            </div>
          </div>
        )}
      </div>

      {/* 战斗按钮 */}
      <Button
        block
        color="danger"
        size="large"
        loading={battling}
        onClick={handleStartBattle}
      >
        ⚔️ 开始排位
      </Button>

      {/* 标签页 */}
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <Tabs.Tab title="排行榜" key="rank" />
        <Tabs.Tab title="奖励" key="reward" />
        <Tabs.Tab title="规则" key="rule" />
      </Tabs>

      {/* 排行榜 */}
      {activeTab === 'rank' && (
        <div className="card">
          <div className="card-title">全服排行榜</div>
          <div className="space-y-2">
            {rankList.length === 0 ? (
              <div className="text-center py-6 text-gray">暂无数据</div>
            ) : (
              rankList.slice(0, 10).map((item, index) => (
                <div
                  key={item.userId}
                  className="flex items-center gap-3 bg-dark/50 rounded p-2"
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      index === 0
                        ? 'bg-yellow-500 text-dark'
                        : index === 1
                        ? 'bg-gray-400 text-dark'
                        : index === 2
                        ? 'bg-orange-700 text-white'
                        : 'bg-gray-700 text-gray-300'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-700 flex items-center justify-center">
                    👤
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold truncate">
                      {item.nickname}
                    </div>
                    <div className="text-xs text-gray">
                      {TIER_ICONS[item.tier]} {TIER_NAMES[item.tier]}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-gold font-bold text-sm">
                      {item.score}
                    </div>
                    <div className="text-xs text-gray">积分</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 奖励预览 */}
      {activeTab === 'reward' && (
        <div className="card">
          <div className="card-title">赛季奖励</div>
          <div className="space-y-2">
            {[
              { tier: '王者', reward: '钻石*5000 + 专属头像框' },
              { tier: '大师', reward: '钻石*3000 + 高级召唤券*10' },
              { tier: '钻石', reward: '钻石*2000 + 高级召唤券*5' },
              { tier: '铂金', reward: '钻石*1000 + 高级召唤券*3' },
              { tier: '黄金', reward: '钻石*500 + 银币*100000' },
            ].map((item) => (
              <div
                key={item.tier}
                className="flex justify-between items-center bg-dark/50 rounded p-2"
              >
                <span className="text-gold">{item.tier}</span>
                <span className="text-sm text-gray">{item.reward}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 规则说明 */}
      {activeTab === 'rule' && (
        <div className="card">
          <div className="card-title">排位规则</div>
          <div className="space-y-2 text-sm text-gray">
            <p>1. 排位赛采用ELO积分制，根据双方实力计算积分变化</p>
            <p>2. 胜利获得积分，失败扣除积分，连胜有额外加成</p>
            <p>3. 共7个大段位：青铜、白银、黄金、铂金、钻石、大师、王者</p>
            <p>4. 赛季结束时根据最终段位发放奖励</p>
            <p>5. 新赛季开始时，段位会进行软重置</p>
          </div>
        </div>
      )}
    </div>
  );
}
