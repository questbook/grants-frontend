import { useState, useEffect } from 'react';

const useIntersection = (element: any, rootMargin: string) => {
  const [isVisible, setState] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setState(entry.isIntersecting);
    }, { rootMargin });

    // if (!(element.current && observer.observe(element.current))) return () => {};
    if (element.current) observer.observe(element.current);
    const refCopy = element.current;
    return () => observer.unobserve(refCopy);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return isVisible;
};

export default useIntersection;
