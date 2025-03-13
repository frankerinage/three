'use client';

import React, { useEffect, useRef, useState } from 'react';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import {
  addBasePlugins,
  DiamondPlugin,
  GroundPlugin,
  LoadingScreenPlugin,
  ViewerApp,
} from 'webgi';
import MetalButtons from './MetalButtons';
import ModelButtons from './ModelButtons';
import Helpers from '../../../helpers';

interface ThreeViewerProps {
  model: string;
}

const ThreeViewer: React.FC<ThreeViewerProps> = ({ model }) => {
  const [currentColor, setCurrentColor] = useState('#aa947e');
  const modelRef = useRef<{ modelObject: THREE.Object3D } | null>(null);
  const [currentModel, setCurrentModel] = useState(model);
  const viewerRef = useRef<ViewerApp | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { get3DUrl, getAssetUrl } = Helpers;

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const runViewer = async () => {
      // create a viewer for the canvas
      const viewer = new ViewerApp({ canvas });

      viewer.renderer.renderScale = 2;
      viewer.renderer.refreshPasses();

      viewerRef.current = viewer;

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

      const myModel = await loadModel(currentModel);
      modelRef.current = myModel;

      // Load scene settings
      await viewer.load(get3DUrl('configuration.vjson'));

      await bakeShadows(viewer);

      // Finally enable the viewer
      await viewer.fitToView();
      viewer.enabled = true;

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

  useEffect(() => {
    if (modelRef.current) {
      modelRef.current.modelObject.traverse((object: THREE.Object3D) => {
        if ((object as THREE.Mesh).isMesh) {
          const material = (object as THREE.Mesh).material as THREE.Material & {
            name: string;
            color: { set: (color: string) => void };
          };

          if (material.name === 'Metal 01') {
            material.color.set(currentColor);
            console.log('Material color changed to', currentColor);
            if (viewerRef.current) {
              console.log('Setting viewer dirty');
              viewerRef.current.setDirty();
            }
          }
        }
      });
    }
  }, [currentColor]);

  return (
    <div className="h-screen flex items-center flex-col gap-8 justify-center p-8">
      <ModelButtons setCurrentModel={setCurrentModel} />
      <MetalButtons setCurrentColor={setCurrentColor} />

      <canvas
        ref={canvasRef}
        className="w-full md:w-2xl aspect-square border border-gray-100"
      ></canvas>
    </div>
  );
};

export default ThreeViewer;

export async function bakeShadows(viewer: ViewerApp) {
  const ground = viewer.getPluginByType<GroundPlugin>('Ground');
  if (ground && ground.visible) {
    if (ground.shadowBaker)
      ground.shadowBaker.maxFrameNumber = Math.min(
        ground.shadowBaker.maxFrameNumber,
        100
      );
    ground.autoBakeShadows = false;
    const promise = new Promise<void>((res) => {
      if (!ground.shadowBaker || !ground.bakedShadows) res();
      else ground.shadowBaker.addEventListener('shadowBaked', () => res());
      viewer?.setDirty();
    });
    ground.bakeShadows();
    await promise;
  }
}
