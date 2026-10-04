import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

interface MapLayoutInvalidationProps {
  theme: string;
}

const MapLayoutInvalidation = ({ theme }: MapLayoutInvalidationProps) => {
  const map = useMap();

  useEffect(() => {
    const invalidateVisibleMap = () => {
      const container = map.getContainer();
      if (container.clientWidth > 0 && container.clientHeight > 0) {
        map.invalidateSize({ pan: false });
      }
    };
    const resizeObserver = typeof ResizeObserver === 'undefined'
      ? null
      : new ResizeObserver(invalidateVisibleMap);

    resizeObserver?.observe(map.getContainer());
    window.addEventListener('resize', invalidateVisibleMap);

    const timeoutId = window.setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
      invalidateVisibleMap();
    }, 150);

    return () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener('resize', invalidateVisibleMap);
      resizeObserver?.disconnect();
    };
  }, [map, theme]);

  return null;
};

export default MapLayoutInvalidation;
