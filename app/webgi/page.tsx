'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const ThreeViewer = dynamic(() => import('./components/ThreeViewer'), {
  ssr: false,
});

const WebGI = () => {
  return (
    <div>
      <ThreeViewer />
    </div>
  );
};

export default WebGI;
