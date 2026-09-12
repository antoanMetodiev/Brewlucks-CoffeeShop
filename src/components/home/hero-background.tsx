"use client";

import dynamic from "next/dynamic";
import { Component, useCallback, useRef, useState, type ReactNode, type RefObject } from "react";
import type { RootState } from "@react-three/fiber";

const HeroScene = dynamic(() => import("./hero-scene").then((mod) => mod.HeroScene), {
  ssr: false,
  loading: () => <FallbackBackground />,
});

function FallbackBackground() {
  return <div className="absolute inset-0 bg-gradient-to-br from-surface via-bg to-bg" />;
}

// WebGL context creation (or a texture load) can throw on ancient/locked-down browsers — fall
// back to a plain gradient rather than crash the hero section.
class WebglBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) return <FallbackBackground />;
    return this.props.children;
  }
}

type Props = {
  images: string[];
  scrollRef: RefObject<number>;
};

const GIVE_UP_AFTER_MS = 6000;

// Mobile GPUs can drop the WebGL context outright under memory/thermal pressure (lots of live
// textures, backgrounding the tab, etc.) — without handling it, the canvas just goes solid black
// and stays that way forever, which is exactly the "photos vanish" bug this guards against.
// `contextlost` must call preventDefault() or the browser won't allow the context back at all.
// Once it's restored we throw away and fully rebuild the scene (a fresh `key`) rather than trust
// partial in-place recovery of our custom shader materials. If it never restores, give up after a
// few seconds and show the plain gradient instead of staying stuck on black.
export function HeroBackground({ images, scrollRef }: Props) {
  const [sceneKey, setSceneKey] = useState(0);
  const [lost, setLost] = useState(false);
  const [gaveUp, setGaveUp] = useState(false);
  const giveUpTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleCreated = useCallback((state: RootState) => {
    const canvas = state.gl.domElement;

    const onLost = (event: Event) => {
      event.preventDefault();
      setLost(true);
      giveUpTimer.current = setTimeout(() => setGaveUp(true), GIVE_UP_AFTER_MS);
    };

    const onRestored = () => {
      if (giveUpTimer.current) {
        clearTimeout(giveUpTimer.current);
        giveUpTimer.current = null;
      }
      setLost(false);
      setSceneKey((key) => key + 1);
    };

    canvas.addEventListener("webglcontextlost", onLost, false);
    canvas.addEventListener("webglcontextrestored", onRestored, false);
  }, []);

  if (gaveUp) return <FallbackBackground />;

  return (
    <WebglBoundary key={sceneKey}>
      {lost && <FallbackBackground />}
      <HeroScene images={images} scrollRef={scrollRef} onCreated={handleCreated} />
    </WebglBoundary>
  );
}
