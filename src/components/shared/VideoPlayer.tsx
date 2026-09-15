"use client";

import { useEffect, useRef, useState } from "react";
import { resolveStorageUrl } from "@/lib/firebase/storage";

interface VideoPlayerProps {
  videoPath: string;
  startAtSeconds?: number;
  onProgress: (positionSeconds: number) => void;
  /** Fires once, when playback reaches ~95% — the real completion signal. */
  onNearComplete: () => void;
}

export function VideoPlayer({ videoPath, startAtSeconds = 0, onProgress, onNearComplete }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const firedComplete = useRef(false);

  useEffect(() => {
    let cancelled = false;
    firedComplete.current = false;
    setSrc(null);
    setError(null);

    resolveStorageUrl(videoPath)
      .then((url) => {
        if (!cancelled) setSrc(url);
      })
      .catch(() => {
        if (!cancelled) setError("This lesson's video could not be loaded.");
      });

    return () => {
      cancelled = true;
    };
  }, [videoPath]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !src) return;
    el.currentTime = startAtSeconds;
  }, [src, startAtSeconds]);

  function handleTimeUpdate() {
    const el = videoRef.current;
    if (!el || !el.duration) return;

    onProgress(el.currentTime);

    if (!firedComplete.current && el.currentTime / el.duration >= 0.95) {
      firedComplete.current = true;
      onNearComplete();
    }
  }

  if (error) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-2xl bg-charcoal text-sm text-ivory/60">
        {error}
      </div>
    );
  }

  if (!src) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-2xl bg-charcoal text-sm text-ivory/50">
        Loading video&hellip;
      </div>
    );
  }

  return (
    <video
      ref={videoRef}
      src={src}
      controls
      className="aspect-video w-full rounded-2xl bg-black"
      onTimeUpdate={handleTimeUpdate}
      onEnded={() => {
        if (!firedComplete.current) {
          firedComplete.current = true;
          onNearComplete();
        }
      }}
    >
      <track kind="captions" />
    </video>
  );
}
