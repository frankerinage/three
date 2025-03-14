'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import Helpers from '../../helpers';

const ThreeViewer = dynamic(() => import('./components/ThreeViewer'), {
  ssr: false,
});

const WebGIV3 = () => {
  const { get3DUrl } = Helpers;

  return (
    <div>
      <ThreeViewer model={get3DUrl('/trillion-sapphire.glb')} />
    </div>
  );
};

export default WebGIV3;
