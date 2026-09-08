import React, { useRef, useState, useCallback } from "react";
import { Trash2, Heart, Plus } from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────────────
const MAX_SWIPE_LEFT = 80;   // px — reveals delete
const MAX_SWIPE_RIGHT = 160; // px — reveals watchlist + buy
const REVEAL_THRESHOLD = 40; // px — minimum offset to trigger action on release

// ─── Types ────────────────────────────────────────────────────────────────────
interface SwipeableListItemProps {
  children: React.ReactNode;
  onDelete?: () => void;
  onWatchlist?: () => void;
  onBuy?: () => void;
  isWatchlisted?: boolean;
  className?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────
const SwipeableListItem: React.FC<SwipeableListItemProps> = ({
  children,
  onDelete,
  onWatchlist,
  onBuy,
  isWatchlisted = false,
  className = "",
}) => {
  const [offset, setOffset] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Unified pointer tracking (touch + mouse)
  const startXRef = useRef<number | null>(null);
  const currentOffsetRef = useRef(0); // live offset without re-render lag
  const isDragging = useRef(false);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const clampOffset = (raw: number): number => {
    if (raw < 0) return Math.max(raw, -MAX_SWIPE_LEFT);
    return Math.min(raw, MAX_SWIPE_RIGHT);
  };

  const snapBack = useCallback(() => {
    setIsAnimating(true);
    setOffset(0);
    currentOffsetRef.current = 0;
  }, []);

  const triggerAndSnap = useCallback(
    (action?: () => void) => {
      action?.();
      snapBack();
    },
    [snapBack]
  );

  // ── Pointer Down ──────────────────────────────────────────────────────────
  const handlePointerDown = useCallback((clientX: number) => {
    startXRef.current = clientX;
    setIsAnimating(false); // disable spring while dragging
  }, []);

  // ── Pointer Move ──────────────────────────────────────────────────────────
  const handlePointerMove = useCallback((clientX: number) => {
    if (startXRef.current === null) return;
    const delta = clientX - startXRef.current;
    const clamped = clampOffset(delta);
    currentOffsetRef.current = clamped;
    setOffset(clamped);
  }, []);

  // ── Pointer Up ────────────────────────────────────────────────────────────
  const handlePointerUp = useCallback(() => {
    if (startXRef.current === null) return;
    startXRef.current = null;

    const current = currentOffsetRef.current;

    if (current < -REVEAL_THRESHOLD) {
      // Swiped left past threshold → delete
      triggerAndSnap(onDelete);
    } else if (current > REVEAL_THRESHOLD) {
      // Swiped right past threshold:
      // offset crosses halfway of right zone → buy; otherwise watchlist
      if (current >= MAX_SWIPE_RIGHT / 2) {
        triggerAndSnap(onBuy);
      } else {
        triggerAndSnap(onWatchlist);
      }
    } else {
      // Below threshold → just snap back
      snapBack();
    }
  }, [onDelete, onWatchlist, onBuy, triggerAndSnap, snapBack]);

  // ── Touch handlers ────────────────────────────────────────────────────────
  const onTouchStart = (e: React.TouchEvent) =>
    handlePointerDown(e.touches[0].clientX);
  const onTouchMove = (e: React.TouchEvent) =>
    handlePointerMove(e.touches[0].clientX);
  const onTouchEnd = () => handlePointerUp();

  // ── Mouse handlers (desktop testing) ─────────────────────────────────────
  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    handlePointerDown(e.clientX);
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    handlePointerMove(e.clientX);
  };
  const onMouseUp = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    handlePointerUp();
  };
  const onMouseLeave = () => {
    if (isDragging.current) {
      isDragging.current = false;
      handlePointerUp();
    }
  };

  // ── Derived visibility ────────────────────────────────────────────────────
  const showDelete = offset < 0;
  const showRight = offset > 0;
  const deleteOpacity = Math.min(Math.abs(offset) / MAX_SWIPE_LEFT, 1);
  const rightOpacity = Math.min(offset / MAX_SWIPE_RIGHT, 1);

  // ── Transition (spring snap-back only when animating) ─────────────────────
  const transition = isAnimating
    ? "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)"
    : "none";

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div
      className={`relative overflow-hidden select-none ${className}`}
      onTransitionEnd={() => setIsAnimating(false)}
    >
      {/* ── Left action panel: DELETE ──────────────────────────────────── */}
      {showDelete && (
        <div
          className="absolute inset-y-0 right-0 flex items-center justify-end bg-red-600 px-5"
          style={{
            width: `${MAX_SWIPE_LEFT}px`,
            opacity: deleteOpacity,
          }}
          aria-hidden="true"
        >
          <button
            onClick={() => triggerAndSnap(onDelete)}
            className="flex flex-col items-center gap-0.5 text-white"
            tabIndex={-1}
          >
            <Trash2 size={20} strokeWidth={2} />
            <span className="text-[10px] font-semibold leading-none">
              Delete
            </span>
          </button>
        </div>
      )}

      {/* ── Right action panel: WATCHLIST + BUY ───────────────────────── */}
      {showRight && (
        <div
          className="absolute inset-y-0 left-0 flex items-center justify-start"
          style={{
            width: `${MAX_SWIPE_RIGHT}px`,
            opacity: rightOpacity,
          }}
          aria-hidden="true"
        >
          {/* Watchlist (emerald) — left half */}
          <button
            onClick={() => triggerAndSnap(onWatchlist)}
            className="flex flex-col items-center justify-center gap-0.5 h-full w-1/2 text-white"
            style={{
              backgroundColor: isWatchlisted ? "#059669" : "#10b981",
            }}
            tabIndex={-1}
          >
            <Heart
              size={20}
              strokeWidth={2}
              fill={isWatchlisted ? "currentColor" : "none"}
            />
            <span className="text-[10px] font-semibold leading-none">
              {isWatchlisted ? "Saved" : "Watch"}
            </span>
          </button>

          {/* Buy (amber) — right half */}
          <button
            onClick={() => triggerAndSnap(onBuy)}
            className="flex flex-col items-center justify-center gap-0.5 h-full w-1/2 bg-amber-500 text-white"
            tabIndex={-1}
          >
            <Plus size={20} strokeWidth={2.5} />
            <span className="text-[10px] font-semibold leading-none">Buy</span>
          </button>
        </div>
      )}

      {/* ── Main content (draggable layer) ────────────────────────────── */}
      <div
        className="relative z-10 bg-white dark:bg-gray-900 touch-pan-y"
        style={{
          transform: `translateX(${offset}px)`,
          transition,
          willChange: "transform",
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
      >
        {children}
      </div>
    </div>
  );
};

export default SwipeableListItem;
