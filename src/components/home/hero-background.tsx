"use client";

import dynamic from "next/dynamic";
import { Component, type ReactNode, type RefObject } from "react";

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

export function HeroBackground({ images, scrollRef }: Props) {
  return (
    <WebglBoundary>
      <HeroScene images={images} scrollRef={scrollRef} />
    </WebglBoundary>
  );
}
