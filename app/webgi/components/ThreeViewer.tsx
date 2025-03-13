/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import React, { useEffect, useRef } from 'react';

import {
  addBasePlugins,
  AssetManagerPlugin,
  DiamondPlugin,
  ViewerApp,
} from 'webgi';

interface ThreeViewerProps {
  model: string;
  env?: string;
}

const ThreeViewer: React.FC<ThreeViewerProps> = ({
  model,
  env = 'https://demo-assets.pixotronics.com/pixo/hdr/gem_2.hdr',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const runViewer = async () => {
      // create a viewer for the canvas
      const viewer = new ViewerApp({ canvas });

      viewer.renderer.renderScale = 2;
      viewer.renderer.refreshPasses();

      // add plugins
      const manager = await viewer.addPlugin(AssetManagerPlugin);
      await addBasePlugins(viewer);

      const diamondPlugin = await viewer.addPlugin(DiamondPlugin);

      diamondPlugin.envMapRotation = Math.PI / 2.0;

      viewer.renderer.refreshPipeline();

      // Load the assets at once.
      await Promise.all([
        viewer.scene.setEnvironment(
          await manager.importer!.importSingle({ path: env })
        ),
        manager.addAsset({ path: model }),
      ]);
    };

    runViewer();
  }, []);

  return (
    <div className="h-screen flex items-center justify-center p-8">
      <canvas
        ref={canvasRef}
        className="w-full md:w-2xl aspect-square"
      ></canvas>
    </div>
  );
};

export default ThreeViewer;
