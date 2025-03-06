'use client';

import React, { useEffect, useRef } from 'react';

import {
  AssetManagerPlugin,
  DiamondPlugin,
  TonemapPlugin,
  ViewerApp,
} from 'webgi';

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

      const diamondPlugin = await viewer.addPlugin(DiamondPlugin);

      // const diamondEnvMap = await viewer
      //   ?.getManager()
      //   ?.importer.importSinglePath<ITexture>(
      //     'https://demo-assets.pixotronics.com/pixo/hdr/gem_2.hdr'
      //   );
      // diamondPlugin.envMap = diamondEnvMap;

      // const dMat = await viewer
      //   .getManager()
      //   .importer.importSinglePath('http://localhost:3030/3d/material.dmat');

      // Find the mesh
      // const mesh = viewer.scene;

      // Prepare the meshes where the material needs to be applied.
      // viewer
      //   .getPlugin(DiamondPlugin)
      //   .prepareDiamondMesh(mesh, { cacheKey: 'd1', normalMapRes: 512 });

      // // Assign the material
      // mesh.setMaterial(dMat);

      diamondPlugin.envMapRotation = Math.PI / 2.0;

      viewer.renderer.refreshPipeline();

      // Load the assets at once.
      await Promise.all([
        viewer.scene.setEnvironment(
          await manager.importer!.importSingle({
            path: 'https://demo-assets.pixotronics.com/pixo/hdr/gem_2.hdr',
          })
        ),
        manager.addAsset({
          path: 'http://localhost:3030/3d/diamond-ring.glb',
        }),
      ]);
    };

    runViewer();
  }, []);

  return (
    <div className="h-screen flex items-center justify-center p-8">
      <canvas ref={canvasRef} className="w-full md:w-md aspect-square"></canvas>
    </div>
  );
};

export default ThreeViewer;
