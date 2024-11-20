// import React from 'react';
import * as THREE from 'three';
import React, { useRef, useCallback} from 'react';
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from '@react-three/drei';

interface MeshPageProps {
  currentVolume: {
    mic0: number;
    mic1: number;
    mic2: number;
    mic3: number;
    mic4: number;
    mic5: number;
  };
}

export const MeshPage: React.FC<MeshPageProps> = ({ currentVolume }) => {

  const curveRef = useRef<THREE.Line | null>(null);

  const zChanger = useCallback((z: number) => (z + 100) / 20, []);

    // mic0~mic5の位置を設定
  const positions = [
    new THREE.Vector3(0, 0, zChanger(currentVolume.mic0)), // mic0
    new THREE.Vector3(0, 1, zChanger(currentVolume.mic1)), // mic1
    new THREE.Vector3(0, 2, zChanger(currentVolume.mic2)), // mic2
    new THREE.Vector3(1, 0, zChanger(currentVolume.mic3)), // mic3
    new THREE.Vector3(1, 1, zChanger(currentVolume.mic4)), // mic4
    new THREE.Vector3(1, 2, zChanger(currentVolume.mic5)), // mic5
  ];

  const createMesh = (curve: THREE.Curve<THREE.Vector3>) => {
    const points = curve.getPoints(10).map(point => new THREE.Vector3(point.x, point.y, (point as THREE.Vector3).z || 0));
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
    return new THREE.Line(geometry, material);
  };

  const curveList = [];
  const meshList = [];

  for (let i = 0; i <= 20; i++) {
    const a = new THREE.Vector3(i/20, 0, positions[0].clone().lerp(positions[3], i/20).z);
    const b = new THREE.Vector3(i/20, 1, positions[1].clone().lerp(positions[4], i/20).z);
    const c = new THREE.Vector3(i/20, 2, positions[2].clone().lerp(positions[5], i/20).z);

    // const mesh = createMesh(new THREE.QuadraticBezierCurve3(a, b, c));
    const curve = new THREE.CatmullRomCurve3([a, b, c]);
    const mesh = createMesh(curve);
    curveList.push(curve);
    meshList.push(mesh);
  };
  const pointsOnCurve = curveList.map((curve) => curve.getPoints(40));

  for (let i = 0; i <= 40; i++) {
    const curveX = Array.from({ length: 21 }, (_, j) => pointsOnCurve[j][i]);
    const curve = new THREE.CatmullRomCurve3(curveX);
    const mesh = createMesh(curve);
    meshList.push(mesh);
  }

  // curveRef.current = mesh1;
  
  return (
    <Canvas style = {{backgroundColor:'black', width:'100%', height:'60vh'}} camera = {{position:[0,0,20]}}>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      {/* {curveRef.current && (
        <mesh>
          <line>
            <bufferGeometry
              attach="geometry"
              attributes-position={curveRef.current.geometry.attributes.position}
            />
            <lineBasicMaterial color= "#ff0000" />
          </line>
        </mesh>
      )} */}
      {meshList.map((mesh, index) => <primitive scale = {[10, 4, 2]} object = {mesh} key = {index}/>)}
      <OrbitControls />
    </Canvas>
  );
};