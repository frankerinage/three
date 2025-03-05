'use client';

import React, { useEffect, useRef } from 'react';

import { AssetManagerPlugin, TonemapPlugin, ViewerApp } from 'webgi';

const ThreeViewer = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const runViewer = async () => {
      // create a viewer for the canvas
      const viewer = new ViewerApp({ canvas });

      // add plugins
      const manager = await viewer.addPlugin(AssetManagerPlugin);
      await viewer.addPlugin(TonemapPlugin);

      viewer.renderer.refreshPipeline();

      // Load the assets at once.
      await Promise.all([
        viewer.scene.setEnvironment(
          await manager.importer!.importSingle({
            path: 'https://demo-assets.pixotronics.com/pixo/hdr/p360-01.hdr',
          })
        ),
        manager.addAsset({
          path: 'https://demo-assets.pixotronics.com/pixo/gltf/cube.glb',
        }),
      ]);
    };

    runViewer();
  }, []);

  return (
    <div className="h-screen flex items-center justify-center">
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};

export default ThreeViewer;
