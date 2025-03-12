'use client';

import React, { useEffect, useRef, useState } from 'react';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { addBasePlugins, DiamondPlugin, GroundPlugin, ViewerApp } from 'webgi';
import MetalButtons from './MetalButtons';
import { get3DUrl } from '../../../helpers';

interface ThreeViewerProps {
  model: string;
}

const ThreeViewer: React.FC<ThreeViewerProps> = ({ model }) => {
  const [currentColor, setCurrentColor] = useState('#aa947e');
  const modelRef = useRef<{ modelObject: THREE.Object3D } | null>(null);
  const viewerRef = useRef<ViewerApp | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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

      // this wont rebake the shadows whenever the model changes.
      const ground = viewer.getPlugin(GroundPlugin);
      if (ground) ground.autoBakeShadows = false;

      viewer.enabled = false;

      // Loads a 3d model, without any auto scaling, and centering. This is important, since shanks and heads are prepared in a way, so that the relative positions are correct.
      async function loadModel(url: string) {
        const model = await viewer.load(url, {
          autoScale: false,
          autoCenter: false,
        });
        return model;
      }

      const myModel = await loadModel(model);
      modelRef.current = myModel;

      // Load scene settings
      await viewer.load(get3DUrl('configuration.vjson'));

      // Finally enable the viewer
      viewer.enabled = true;
      viewer.fitToView();

      // manually bake the shadows once.
      if (ground) ground.bakeShadows(); // required only if autoBakeShadows is false

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
      <MetalButtons setCurrentColor={setCurrentColor} />

      <canvas
        ref={canvasRef}
        className="w-full md:w-2xl aspect-square"
      ></canvas>
    </div>
  );
};

export default ThreeViewer;
