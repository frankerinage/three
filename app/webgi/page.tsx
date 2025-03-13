'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import Helpers from '../helpers';

const ThreeViewer = dynamic(() => import('./components/ThreeViewer'), {
  ssr: false,
});

const WebGI = () => {
  const { get3DUrl } = Helpers;

  return (
    <div>
      <ThreeViewer model={get3DUrl('baguette-tiger-ring.glb')} />
    </div>
  );
};

export default WebGI;
