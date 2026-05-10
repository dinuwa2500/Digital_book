import React, { useEffect, useRef } from 'react';

interface AdsterraProps {
  id: string;
  format?: '728x90' | '160x600' | '300x250' | '468x60' | '320x50' | '160x300' | 'native';
  className?: string;
}

/**
 * Adsterra Ad Widget
 * Handles banner and native formats using standard iframe-based scripts
 */
const Adsterra: React.FC<AdsterraProps> = ({ id, format = '728x90', className = '' }) => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id || !adRef.current) return;

    adRef.current.innerHTML = '';

    const [width, height] = getDimensions(format);

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.innerHTML = `
      atOptions = {
        'key' : '${id}',
        'format' : 'iframe',
        'height' : ${height},
        'width' : ${width},
        'params' : {}
      };
    `;

    const invokeScript = document.createElement('script');
    invokeScript.type = 'text/javascript';
    invokeScript.src = `//www.highperformanceformat.com/${id}/invoke.js`;

    adRef.current.appendChild(script);
    adRef.current.appendChild(invokeScript);

    return () => {
      if (adRef.current) adRef.current.innerHTML = '';
    };
  }, [id, format]);

  return (
    <div className={`ad-container flex justify-center items-center overflow-hidden my-4 mx-auto ${className}`}>
      <div ref={adRef} />
    </div>
  );
};

function getDimensions(format: string): [number, number] {
  switch (format) {
    case '728x90': return [728, 90];
    case '160x600': return [160, 600];
    case '300x250': return [300, 250];
    case '468x60': return [468, 60];
    case '320x50': return [320, 50];
    case '160x300': return [160, 300];
    case 'native': return [0, 0]; // Native handled differently usually, but often works with iframe too
    default: return [728, 90];
  }
}

export default Adsterra;
