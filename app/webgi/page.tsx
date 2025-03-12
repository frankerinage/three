'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { get3DUrl } from '../helpers';

const ThreeViewer = dynamic(() => import('./components/ThreeViewer'), {
  ssr: false,
});

const WebGI = () => {
  return (
    <div>
      <ThreeViewer model={get3DUrl('baguette-tiger-ring.glb')} />
    </div>
  );
};

export default WebGI;
