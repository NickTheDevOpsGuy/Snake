import { useEffect, useState } from "react";

/** Reserve extra bottom space on mobile for D-pad + safe area. */
function getControlsReserve(): number {
  const isMobile =
    window.innerWidth < 768 ||
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    );
  return isMobile ? 220 : 180;
}

export function useGameScale(gameWidth: number, gameHeight: number) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const update = () => {
      const padding = 24;
      const controlsHeight = getControlsReserve();
      const maxW = window.innerWidth - padding * 2;
      const maxH = window.innerHeight - controlsHeight - padding * 2;
      const scaleW = maxW / gameWidth;
      const scaleH = maxH / gameHeight;
      setScale(Math.min(1, scaleW, scaleH));
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [gameWidth, gameHeight]);

  return scale;
}
