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

  // const curveRef = useRef<THREE.Line | null>(null);

  const sumVolume = Object.values(currentVolume).reduce((acc, cur) => acc + cur, 0) / 600;
  
  const positions = [
    new THREE.Vector3(-1, -1, currentVolume.mic0/100 - sumVolume), // mic0
    new THREE.Vector3(-1, 0, currentVolume.mic1/100 - sumVolume), // mic1
    new THREE.Vector3(-1, 1, currentVolume.mic2/100 - sumVolume), // mic2
    new THREE.Vector3(1, -1, currentVolume.mic3/100 - sumVolume), // mic3
    new THREE.Vector3(1, 0, currentVolume.mic4/100 - sumVolume), // mic4
    new THREE.Vector3(1, 1, currentVolume.mic5/100 - sumVolume), // mic5
  ];

  const createMesh = (curve: THREE.Curve<THREE.Vector3>) => {
    const points = curve.getPoints(10).map(point => new THREE.Vector3(point.x, point.y, (point as THREE.Vector3).z || 0));
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
    return new THREE.Line(geometry, material);
  };

  const curveList = [];
  const meshList = [];

  const stepNumber = 20;
  const stepNumberY = 40;
  for (let i = 0; i <= stepNumber; i++) {
    const a = new THREE.Vector3(2*i/stepNumber -1, -1, positions[0].clone().lerp(positions[3], i/stepNumber).z);
    const b = new THREE.Vector3(2*i/stepNumber -1, 0, positions[1].clone().lerp(positions[4], i/stepNumber).z);
    const c = new THREE.Vector3(2*i/stepNumber -1, 1, positions[2].clone().lerp(positions[5], i/stepNumber).z);

    // const mesh = createMesh(new THREE.QuadraticBezierCurve3(a, b, c));
    const curve = new THREE.CatmullRomCurve3([a, b, c]);
    const mesh = createMesh(curve);
    curveList.push(curve);
    meshList.push(mesh);
  };
  const pointsOnCurve = curveList.map((curve) => curve.getPoints(stepNumberY));

  for (let i = 0; i <= stepNumberY; i++) {
    const curveX = Array.from({ length: stepNumber + 1 }, (_, j) => pointsOnCurve[j][i]);
    const curve = new THREE.CatmullRomCurve3(curveX);
    const mesh = createMesh(curve);
    meshList.push(mesh);
  }

  // curveRef.current = mesh1;
  
  return (
    <Canvas style = {{backgroundColor:'black',
                      width:'100%',
                      height:'60vh',
                      // cursor:'none'
                      }}
            camera = {{position:[0,0,10]}}>
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
      {meshList.map((mesh, index) => <primitive scale = {[4, 3, 0.5]} object = {mesh} key = {index}/>)}
      <OrbitControls />
    </Canvas>
  );
};