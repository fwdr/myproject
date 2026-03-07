import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import type { TunnelType } from '../config/levels/level1';
import { BRICK_W, BRICK_H, MORTAR, GAP_HEIGHT, GAP_WIDTH } from '../lib/gameConstants';

type BrickStyle = { backgroundColor: string; borderColor: string };

type BrickWallProps = {
  width: number;
  innerWidth?: number;
  innerHeight: number;
  tunnel?: TunnelType;
  brickStyle?: BrickStyle;
};

export function BrickWall({
  width,
  innerHeight,
  tunnel = 'none',
  brickStyle = { backgroundColor: '#800000', borderColor: '#FF0000' },
}: BrickWallProps) {
  const topN = Math.ceil(width / BRICK_W) + 2;
  const sideHeight = innerHeight;
  const sideN = Math.ceil(sideHeight / BRICK_H);
  const hasSideGaps = tunnel === 'horizontal';
  const hasTopBottomGaps = tunnel === 'vertical';

  const gapCenterY = sideHeight / 2;
  const gapTop = gapCenterY - GAP_HEIGHT / 2;
  const bricksAboveGap = Math.floor(gapTop / BRICK_H);
  const bricksBelowGap = Math.max(0, sideN - bricksAboveGap - Math.ceil(GAP_HEIGHT / BRICK_H));

  const brickHoriz = (key: string, offset?: number) => (
    <View
      key={key}
      style={[
        styles.brickHorizontal,
        brickStyle,
        offset !== undefined && { marginLeft: offset },
      ]}
    />
  );

  const brickVert = (key: string) => (
    <View key={key} style={[styles.brick, brickStyle]} />
  );

  const renderSideColumn = (prefix: string) => (
    <View style={[styles.brickStripColInner, { height: sideHeight }]}>
      {hasSideGaps ? (
        <>
          {Array.from({ length: bricksAboveGap }).map((_, i) =>
            brickVert(`${prefix}-above-${i}`)
          )}
          <View style={styles.gapSpacer} />
          {Array.from({ length: bricksBelowGap }).map((_, i) =>
            brickVert(`${prefix}-below-${i}`)
          )}
        </>
      ) : (
        Array.from({ length: sideN }).map((_, i) => brickVert(`${prefix}-${i}`))
      )}
    </View>
  );

  const renderTopBottomStrip = (prefix: string) => {
    if (!hasTopBottomGaps) {
      return Array.from({ length: topN }).map((_, i) =>
        brickHoriz(`${prefix}-${i}`, i % 2 === (prefix === 't' ? 1 : 0) ? BRICK_W / 2 : 0)
      );
    }
    const bricksPerSide = Math.floor((width - GAP_WIDTH) / 2 / BRICK_W);
    const leftBricks = Array.from({ length: bricksPerSide }).map((_, i) =>
      brickHoriz(`${prefix}-l-${i}`, i % 2 === (prefix === 't' ? 1 : 0) ? BRICK_W / 2 : 0)
    );
    const rightBricks = Array.from({ length: bricksPerSide }).map((_, i) =>
      brickHoriz(`${prefix}-r-${i}`, i % 2 === (prefix === 't' ? 1 : 0) ? BRICK_W / 2 : 0)
    );
    return [
      ...leftBricks,
      <View key={`${prefix}-gap`} style={styles.gapSpacerHorizontal} />,
      ...rightBricks,
    ];
  };

  return (
    <>
      <View style={[styles.brickStrip, styles.brickTop, { width }, hasTopBottomGaps && styles.brickStripCentered]}>
        {renderTopBottomStrip('t')}
      </View>
      <View style={[styles.brickStrip, styles.brickBottom, { width }, hasTopBottomGaps && styles.brickStripCentered]}>
        {renderTopBottomStrip('b')}
      </View>
      <View style={[styles.brickStripCol, styles.brickLeft]}>
        {renderSideColumn('l')}
      </View>
      <View style={[styles.brickStripCol, styles.brickRight]}>
        {renderSideColumn('r')}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  brick: {
    width: BRICK_W - MORTAR,
    height: BRICK_H - MORTAR,
    marginRight: MORTAR,
    marginBottom: MORTAR,
    borderWidth: 1,
  },
  brickHorizontal: {
    width: BRICK_W - MORTAR,
    height: BRICK_H - MORTAR,
    marginRight: MORTAR,
    borderWidth: 1,
  },
  brickStrip: {
    position: 'absolute',
    left: 0,
    height: BRICK_H,
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  brickStripCentered: {
    justifyContent: 'center',
  },
  brickStripCol: {
    position: 'absolute',
    top: BRICK_H,
    flexDirection: 'column',
  },
  brickStripColInner: {
    flexDirection: 'column',
  },
  gapSpacer: {
    height: GAP_HEIGHT,
    width: BRICK_W - MORTAR,
  },
  gapSpacerHorizontal: {
    width: GAP_WIDTH,
    height: BRICK_H - MORTAR,
  },
  brickTop: { top: 0 },
  brickBottom: { bottom: 0 },
  brickLeft: { left: 0 },
  brickRight: { right: 0 },
});
