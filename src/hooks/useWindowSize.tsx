import { useEffect, useState } from 'react';

interface Size {
  width: number;
  height: number;
}
const useWindowSize = () => {
  const [size, setSize] = useState<Size>();
  function handleSize() {
    setSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }
  useEffect(() => {
    handleSize();
    window.addEventListener('resize', handleSize);

    return () => window.removeEventListener('resize', handleSize);
  }, []);

  return size as Size;
};
export default useWindowSize;
