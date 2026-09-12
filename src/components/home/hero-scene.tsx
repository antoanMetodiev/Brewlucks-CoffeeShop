"use client";

import { Canvas, useFrame, useLoader, useThree, type RootState } from "@react-three/fiber";
import { Suspense, useLayoutEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";

// Same-origin proxy Next.js's own <Image> already uses — guarantees no CORS issues loading
// these textures from TheMealDB/TheCocktailDB's CDN, unlike fetching the raw remote URL.
function proxiedImageUrl(src: string, width: number) {
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=75`;
}

// Deterministic pseudo-random in [0, 1), seeded by index — stable across renders, no Math.random.
function hash(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

const photoVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Rounded-rect SDF mask over the sampled photo — WebGL has no native border-radius, so the
// corners are cut with alpha discard instead.
const photoFragmentShader = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uMap;
  uniform float uRadius;
  void main() {
    vec2 p = vUv - 0.5;
    vec2 b = vec2(0.5 - uRadius);
    vec2 q = abs(p) - b;
    float dist = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - uRadius;
    float alpha = smoothstep(0.0, -0.008, dist);
    vec3 color = texture2D(uMap, vUv).rgb;
    gl_FragColor = vec4(color, alpha);
  }
`;

// A blurred rounded-rect rendered slightly behind and offset from each photo — a "box-shadow"
// standing in for the CSS property that doesn't exist in WebGL.
const shadowFragmentShader = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uRadius;
  void main() {
    vec2 p = vUv - 0.5;
    vec2 b = vec2(0.5 - uRadius);
    vec2 q = abs(p) - b;
    float dist = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - uRadius;
    float alpha = smoothstep(0.16, -0.06, dist) * 0.5;
    gl_FragColor = vec4(0.0, 0.0, 0.0, alpha);
  }
`;

type FoodPlaneConfig = {
  url: string;
  rx: number; // normalized [-0.5, 0.5] position, scaled by the live viewport each frame
  ry: number;
  z: number;
  rotationSpeed: number;
  floatSpeed: number;
  floatOffset: number;
  scale: number;
};

function FoodPlane({ url, rx, ry, z, rotationSpeed, floatSpeed, floatOffset, scale }: FoodPlaneConfig) {
  const texture = useLoader(THREE.TextureLoader, url);
  const group = useRef<THREE.Group>(null);

  // No mipmaps: these are flat, roughly-constant-size quads, so the visual gain is marginal —
  // skipping the mip chain meaningfully cuts per-texture GPU memory, which matters with up to
  // ~48 textures live at once on weaker mobile GPUs (a real cause of dropped/black WebGL contexts).
  useLayoutEffect(() => {
    // Mutating a loaded texture's sampling settings is the standard three.js/R3F pattern (not a
    // React value) — safe here since each plane's URL (and thus cache entry) is unique.
    /* eslint-disable react-hooks/immutability */
    texture.generateMipmaps = false;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.needsUpdate = true;
    /* eslint-enable react-hooks/immutability */
  }, [texture]);
  const photoUniforms = useMemo(() => ({ uMap: { value: texture }, uRadius: { value: 0.16 } }), [texture]);
  const shadowUniforms = useMemo(() => ({ uRadius: { value: 0.16 } }), []);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    const { width, height } = state.viewport;
    group.current.position.x = rx * width + Math.cos(t * floatSpeed * 0.7 + floatOffset) * 0.2;
    group.current.position.y = ry * height + Math.sin(t * floatSpeed + floatOffset) * 0.3;
    group.current.position.z = z;
    group.current.rotation.z = Math.sin(t * rotationSpeed + floatOffset) * 0.12;
  });

  return (
    <group ref={group} scale={scale}>
      <mesh position={[0.05, -0.06, -0.02]}>
        <planeGeometry args={[1.15, 1.15]} />
        <shaderMaterial
          vertexShader={photoVertexShader}
          fragmentShader={shadowFragmentShader}
          uniforms={shadowUniforms}
          transparent
          depthWrite={false}
        />
      </mesh>
      <mesh>
        <planeGeometry args={[1.15, 1.15]} />
        <shaderMaterial
          vertexShader={photoVertexShader}
          fragmentShader={photoFragmentShader}
          uniforms={photoUniforms}
          transparent
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function Field({
  images,
  scrollRef,
  textureWidth,
}: {
  images: string[];
  scrollRef: RefObject<number>;
  textureWidth: number;
}) {
  const group = useRef<THREE.Group>(null);

  const items = useMemo<FoodPlaneConfig[]>(
    () =>
      images.map((src, index) => ({
        url: proxiedImageUrl(src, textureWidth),
        rx: hash(index * 3.1 + 1) - 0.5,
        ry: hash(index * 5.7 + 2) - 0.5,
        z: -0.5 - hash(index * 7.3 + 3) * 3.5,
        rotationSpeed: 0.12 + hash(index * 2.3 + 4) * 0.18,
        floatSpeed: 0.18 + hash(index * 4.1 + 5) * 0.22,
        floatOffset: hash(index * 6.6 + 6) * 10,
        scale: 0.5 + hash(index * 8.2 + 7) * 0.5,
      })),
    [images, textureWidth],
  );

  useFrame((state) => {
    if (!group.current) return;
    const progress = scrollRef.current ?? 0;
    group.current.rotation.y = state.clock.elapsedTime * 0.02 + progress * 0.5;
    group.current.position.z = progress * 1.4;
    group.current.position.y = -progress * 0.5;
  });

  return (
    <group ref={group}>
      {items.map((item, index) => (
        // Each plane gets its OWN Suspense boundary. A single shared boundary around the whole
        // field means one slow/re-fetching texture (a cold cache after navigating back to the
        // homepage, a flaky mobile connection) suspends every plane at once — the entire
        // background goes blank (just the dark clear color) until ALL of them finish loading.
        // Per-plane boundaries mean a slow one just holds up itself; everything else already
        // loaded keeps rendering, so the field never disappears wholesale.
        <Suspense key={index} fallback={null}>
          <FoodPlane {...item} />
        </Suspense>
      ))}
    </group>
  );
}

function ResponsiveField({ images, scrollRef }: { images: string[]; scrollRef: RefObject<number> }) {
  // Fewer, closer, lower-res planes on narrow/portrait viewports keep it legible and light on
  // mobile GPUs (less overall texture memory pressure — see the mipmap note in FoodPlane).
  const { width, height } = useThree((state) => state.size);
  const isCompact = width > 0 && width < 768;
  const isPortrait = height > width;

  const visible = useMemo(() => {
    const count = isCompact ? Math.min(images.length, 22) : images.length;
    if (count >= images.length) return images;
    const step = images.length / count;
    return Array.from({ length: count }, (_, i) => images[Math.floor(i * step)]);
  }, [images, isCompact]);

  return (
    <>
      <fog attach="fog" args={["#100c0a", 2.5, isPortrait ? 6 : 8]} />
      <Field images={visible} scrollRef={scrollRef} textureWidth={isCompact ? 256 : 384} />
    </>
  );
}

type Props = {
  images: string[];
  scrollRef: RefObject<number>;
  onCreated?: (state: RootState) => void;
};

export function HeroScene({ images, scrollRef, onCreated }: Props) {
  return (
    <div className="absolute inset-0">
      <Canvas
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: false, powerPreference: "low-power" }}
        camera={{ position: [0, 0, 5], fov: 50 }}
        onCreated={onCreated}
      >
        <color attach="background" args={["#100c0a"]} />
        <ResponsiveField images={images} scrollRef={scrollRef} />
      </Canvas>
    </div>
  );
}
