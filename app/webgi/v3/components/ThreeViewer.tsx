'use client';

import React, { useEffect, useRef } from 'react';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import {
  addBasePlugins,
  DiamondPlugin,
  LoadingScreenPlugin,
  ViewerApp,
} from 'webgi';
import Helpers from '../../../helpers';

interface ThreeViewerProps {
  model: string;
}

const ThreeViewer: React.FC<ThreeViewerProps> = ({ model }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { get3DUrl, getAssetUrl } = Helpers;

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const runViewer = async () => {
      console.log('Initializing viewer...');
      // create a viewer for the canvas
      const viewer = new ViewerApp({ canvas });

      viewer.renderer.renderScale = 2;
      viewer.renderer.refreshPasses();

      // Change this value to scale the configurator
      const rootScaleFactor = 1;
      viewer.scene.modelRoot.scale.set(
        rootScaleFactor,
        rootScaleFactor,
        rootScaleFactor
      );

      // Add all the plugins at once
      await addBasePlugins(viewer, { importPopup: false, enableDrop: false });
      await viewer.getOrAddPlugin(DiamondPlugin);

      viewer.renderer.refreshPipeline();

      viewer.enabled = false;

      const loading = await viewer.getOrAddPlugin(LoadingScreenPlugin);
      loading.minimizeOnSceneObjectLoad = true;
      loading.showFileNames = false;
      loading.logoImage = getAssetUrl('/logo.png');
      loading.showProcessStates = false;

      loading.loadingTextHeader = 'Loading..';
      loading.showFileNames = false;
      loading.backgroundOpacity = 0.5;
      loading.background = '#ffffff';
      loading.textColor = '#222222';

      // Loads a 3d model, without any auto scaling, and centering. This is important, since shanks and heads are prepared in a way, so that the relative positions are correct.
      async function loadModel(url: string) {
        const model = await viewer.load(url, {
          autoScale: false,
          autoCenter: false,
        });
        return model;
      }

      await loadModel(model);
      // Load scene settings
      await viewer.load(get3DUrl('configuration.vjson'));

      // Finally enable the viewer
      viewer.enabled = true;
      viewer.fitToView();

      // Ensure controls are active
      const camera = viewer.scene.activeCamera;
      const controls = camera?.getControls() as OrbitControls;

      if (controls) {
        controls.enabled = true; // Enable controls explicitly
        controls.enableZoom = true; // Enable zoom

        // Set initial distance
        controls.minDistance = window.innerWidth < window.innerHeight ? 9 : 7;
        controls.maxDistance = window.innerWidth < window.innerHeight ? 30 : 30;

        // Handle camera distance on resize or update
        const handleCameraUpdate = () => {
          if (window.innerWidth < window.innerHeight) {
            controls.minDistance = 9;
            controls.maxDistance = 30;
          } else {
            controls.minDistance = 7;
            controls.maxDistance = 30;
          }
          viewer.setDirty(); // Refresh the viewer
        };

        camera.addEventListener('update', handleCameraUpdate);

        // Clean up event listener
        return () => {
          camera.removeEventListener('update', handleCameraUpdate);
        };
      }
    };

    runViewer();
  }, []);

  return (
    <div className="h-screen flex items-center flex-col gap-8 justify-center p-8">
      <canvas
        ref={canvasRef}
        className="w-full md:w-2xl aspect-square border border-gray-100"
      ></canvas>
    </div>
  );
};

export default ThreeViewer;
