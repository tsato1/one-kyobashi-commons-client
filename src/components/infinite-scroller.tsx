"use client";

type Direction = "left" | "right";

type InfiniteScrollerProps = {
  items: React.ReactNode[];
  clones?: number;         // how many extra copies to append (default 1)
  gap?: string;            // e.g. "30px"
  duration?: string;       // e.g. "20s"
  direction?: Direction;   // "left" or "right"
  pauseOnHover?: boolean;
  className?: string;      // optional wrapper class
};

/**
 * Infinite horizontal scroller (Next.js + Tailwind)
 * - no tailwind.config.js required
 * - uses CSS variables + <style jsx> for keyframes
 */
export const InfiniteScroller = ({
  items,
  clones = 1,
  gap = "30px",
  duration = "20s",
  direction = "left",
  pauseOnHover = false,
  className = "",
}: InfiniteScrollerProps) => {
  const cloneLength = clones + 1;

  return (
    <div className={`overflow-hidden w-full ${className}`}>
      <div
        className={[
          // width: max-content and perf hints
          "w-[max-content] will-change-transform",
          // apply animation and optional pause-on-hover
          pauseOnHover ? "hover:[animation-play-state:paused]" : "",
        ].join(" ")}
        style={
          {
            // CSS variables used inside keyframes
            ["--_clone-length" as string]: String(cloneLength),
            ["--_gap" as string]: gap,
            ["--_duration" as string]: duration,
            // choose LTR/RTL animation
            animation:
              direction === "left"
                ? "infiniteScrollRTL var(--_duration) linear infinite"
                : "infiniteScrollLTR var(--_duration) linear infinite",
          } as React.CSSProperties
        }
      >
        <ul
          role="list"
          className="flex flex-nowrap gap-x-[var(--_gap)]"
        >
          {Array.from({ length: cloneLength }).map((_, copyIdx) =>
            items.map((node, i) => (
              <li
                role="listitem"
                key={`${copyIdx}-${i}`}
                aria-hidden={copyIdx > 0 ? true : undefined}
                className="grid place-content-center shrink-0 min-w-[22vw] aspect-square text-white text-[1.375rem] font-bold"
              >
                {node}
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Keyframes (scoped). No tailwind.config.js needed. */}
      <style jsx>{`
        @keyframes infiniteScrollRTL {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(
              calc(
                -1 * (100% / var(--_clone-length)) -
                  var(--_gap) / var(--_clone-length)
              )
            );
          }
        }
        @keyframes infiniteScrollLTR {
          0% {
            transform: translateX(
              calc(
                -1 * (100% / var(--_clone-length)) -
                  var(--_gap) / var(--_clone-length)
              )
            );
          }
          100% {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
