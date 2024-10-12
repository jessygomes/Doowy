"use client";
import React, { CSSProperties, useEffect, useState } from "react";

interface RippleProps {
  mainCircleSize?: number;
  mainCircleOpacity?: number;
  numCircles?: number;
}

const Ripple = React.memo(function Ripple({
  mainCircleSize = 300,
  mainCircleOpacity = 0.24,
  numCircles = 10,
}: RippleProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize(); // Set initial value
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[white/5] [mask-image:linear-gradient(to_bottom,white,transparent)]">
      {Array.from({ length: numCircles }, (_, i) => {
        const size = mainCircleSize + i * 100;
        const mobileSize = size / 3; // Reduce size by half for mobile
        const finalSize = isMobile ? mobileSize : size;
        const opacity = mainCircleOpacity - i * 0.01;
        const animationDelay = `${i * 0.09}s`;
        const borderStyle = i === numCircles - 1 ? "dashed" : "solid";
        const borderOpacity = 5 + i * 5;

        return (
          <div
            key={i}
            className={`absolute animate-ripple rounded-lg bg-gradient-to-t from-[#ff4000] to-[#9000ff] dark:from-[#ff4000] dark:to-[#9000ff] shadow-xl border [--i:${i}] `}
            style={
              {
                width: `${finalSize}px`,
                height: `${finalSize}px`,
                opacity,
                animationDelay,
                borderStyle,
                borderWidth: "1px",
                borderColor: `hsl(var(--foreground), ${borderOpacity / 100})`,
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%) scale(1)",
                // Media query pour mobile
                "@media (max-width: 768px)": {
                  width: `${mobileSize}px`,
                  height: `${mobileSize}px`,
                },
              } as CSSProperties
            }
          />
        );
      })}
    </div>
  );
});

Ripple.displayName = "Ripple";

export default Ripple;
