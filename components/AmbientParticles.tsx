import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';

export type ParticleStyleId =
  | 'stars'
  | 'dust'
  | 'bubbles'
  | 'sparks'
  | 'embers'
  | 'snow'
  | 'void'
  | 'nebula';

type ParticleDef = {
  count: number;
  sizeMin: number;
  sizeMax: number;
  colors: string[];
  speedMin: number;
  speedMax: number;
  opacityMin: number;
  opacityMax: number;
  shape: 'circle' | 'square' | 'dot';
  movement?: 'float' | 'driftDown' | 'driftUp';
};

const PARTICLE_STYLES: Record<ParticleStyleId, ParticleDef> = {
  stars: {
    count: 35,
    sizeMin: 1,
    sizeMax: 2,
    colors: ['#FFFFFF', '#E0E0FF', '#C0C0FF'],
    speedMin: 0.1,
    speedMax: 0.4,
    opacityMin: 0.3,
    opacityMax: 0.9,
    shape: 'circle',
  },
  dust: {
    count: 40,
    sizeMin: 1,
    sizeMax: 3,
    colors: ['#888888', '#AAAAAA', '#999999'],
    speedMin: 0.05,
    speedMax: 0.2,
    opacityMin: 0.15,
    opacityMax: 0.4,
    shape: 'dot',
  },
  bubbles: {
    movement: 'driftUp',
    count: 20,
    sizeMin: 4,
    sizeMax: 10,
    colors: ['#40E0E0', '#00CED1', '#87CEEB'],
    speedMin: 0.1,
    speedMax: 0.3,
    opacityMin: 0.1,
    opacityMax: 0.25,
    shape: 'circle',
  },
  sparks: {
    movement: 'float',
    count: 30,
    sizeMin: 1,
    sizeMax: 2,
    colors: ['#FFFF00', '#FFD700', '#FFFACD', '#FFFFFF'],
    speedMin: 0.2,
    speedMax: 0.6,
    opacityMin: 0.4,
    opacityMax: 0.95,
    shape: 'dot',
  },
  embers: {
    count: 28,
    sizeMin: 2,
    sizeMax: 5,
    colors: ['#FF4500', '#FF6347', '#FFA07A', '#FFD700'],
    speedMin: 0.08,
    speedMax: 0.25,
    opacityMin: 0.25,
    opacityMax: 0.6,
    shape: 'circle',
  },
  snow: {
    count: 25,
    sizeMin: 2,
    sizeMax: 4,
    colors: ['#FFFFFF', '#F0F8FF', '#E6E6FA'],
    speedMin: 0.15,
    speedMax: 0.4,
    opacityMin: 0.3,
    opacityMax: 0.8,
    shape: 'circle',
    movement: 'driftDown',
  },
  void: {
    count: 45,
    sizeMin: 0.5,
    sizeMax: 1.5,
    colors: ['#1a1a3e', '#2d2d5a', '#4a4a8a'],
    speedMin: 0.02,
    speedMax: 0.15,
    opacityMin: 0.2,
    opacityMax: 0.5,
    shape: 'dot',
  },
  nebula: {
    count: 22,
    sizeMin: 6,
    sizeMax: 14,
    colors: ['#9400D3', '#8A2BE2', '#4B0082', '#EE82EE'],
    speedMin: 0.03,
    speedMax: 0.12,
    opacityMin: 0.08,
    opacityMax: 0.22,
    shape: 'circle',
  },
};

const STYLE_ORDER: ParticleStyleId[] = [
  'stars',
  'dust',
  'bubbles',
  'sparks',
  'embers',
  'snow',
  'void',
  'nebula',
];

export function getParticleStyleForLevel(levelNumber: number): ParticleStyleId {
  return STYLE_ORDER[(levelNumber - 1) % STYLE_ORDER.length];
}

type Particle = {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  opacity: number;
  shape: 'circle' | 'square' | 'dot';
};

function createParticles(
  def: ParticleDef,
  width: number,
  height: number
): Particle[] {
  const particles: Particle[] = [];
  const movement = def.movement ?? 'float';
  for (let i = 0; i < def.count; i++) {
    const size =
      def.sizeMin + Math.random() * (def.sizeMax - def.sizeMin);
    const speed =
      def.speedMin + Math.random() * (def.speedMax - def.speedMin);
    let vx: number, vy: number;
    if (movement === 'driftDown') {
      vx = (Math.random() - 0.5) * speed * 0.5;
      vy = speed;
    } else if (movement === 'driftUp') {
      vx = (Math.random() - 0.5) * speed * 0.3;
      vy = -speed;
    } else {
      const angle = Math.random() * Math.PI * 2;
      vx = Math.cos(angle) * speed;
      vy = Math.sin(angle) * speed;
    }
    particles.push({
      id: i,
      x: Math.random() * width,
      y: Math.random() * height,
      vx,
      vy,
      size,
      color: def.colors[Math.floor(Math.random() * def.colors.length)],
      opacity:
        def.opacityMin + Math.random() * (def.opacityMax - def.opacityMin),
      shape: def.shape,
    });
  }
  return particles;
}

type AmbientParticlesProps = {
  styleId: ParticleStyleId;
  width: number;
  height: number;
};

export function AmbientParticles({ styleId, width, height }: AmbientParticlesProps) {
  const def = PARTICLE_STYLES[styleId];
  const [particles, setParticles] = useState<Particle[]>(() =>
    createParticles(def, width, height)
  );

  useEffect(() => {
    setParticles(createParticles(def, width, height));
  }, [styleId, width, height]);

  useEffect(() => {
    const interval = setInterval(() => {
      setParticles((prev) =>
        prev.map((p) => {
          const x = p.x + p.vx;
          const y = p.y + p.vy;
          if (x < -5) x = width + 5;
          if (x > width + 5) x = -5;
          if (y < -5) y = height + 5;
          if (y > height + 5) y = -5;
          return { ...p, x, y };
        })
      );
    }, 80);
    return () => clearInterval(interval);
  }, [width, height, styleId]);

  if (width <= 0 || height <= 0) return null;

  return (
    <View
      style={[StyleSheet.absoluteFill, styles.container]}
      pointerEvents="none"
    >
      {particles.map((p) => (
        <View
          key={p.id}
          style={[
            styles.particle,
            {
              left: p.x - p.size / 2,
              top: p.y - p.size / 2,
              width: p.size,
              height: p.size,
              borderRadius: p.shape === 'circle' ? p.size / 2 : 0,
              backgroundColor: p.color,
              opacity: p.opacity,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  particle: {
    position: 'absolute',
  },
});
