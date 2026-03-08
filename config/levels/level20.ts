import type { LevelConfig } from './level1';

export const LEVEL_20: LevelConfig = {
  id: 'level20',
  tunnel: 'vertical',
  staticObstacles: [
    { x: 0.25, y: 0.3 },
    { x: 0.75, y: 0.3 },
    { x: 0.5, y: 0.5 },
    { x: 0.25, y: 0.7 },
    { x: 0.75, y: 0.7 },
  ],
  powerups: {
    type: 'dual',
    spawnChance: 0.04,
    spawnIntervalMs: 2000,
    durationMs: 10000,
  },
  spawnOrigin: 'grouped',
  waveTimeoutMs: 8000,
  waves: [
    [{ enemyType: 'type9', count: 2 }, { enemyType: 'type6', count: 2 }],
    [{ enemyType: 'type9', count: 2 }, { enemyType: 'type7', count: 2 }],
    [{ enemyType: 'type9', count: 1 }, { enemyType: 'type8', count: 3 }, { enemyType: 'type4', count: 4 }],
    [{ enemyType: 'type6', count: 2 }, { enemyType: 'type9', count: 1 }, { enemyType: 'type5', count: 2 }],
    [{ enemyType: 'type9', count: 2 }, { enemyType: 'type10', count: 3 }],
    [{ enemyType: 'type9', count: 2 }, { enemyType: 'type6', count: 1 }, { enemyType: 'type7', count: 1 }],
  ],
};
