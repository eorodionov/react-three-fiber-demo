import React, { useRef, useState } from 'react';
import './App.scss';

// Import canvas from react-tree-fiber
import { Canvas, useFrame } from "@react-three/fiber";

// Drei allows to create geometry faster
// import { Box } from '@react-three/drei';
import { OrbitControls, softShadows, MeshWobbleMaterial} from "@react-three/drei";

// importing spring animation, a is for animated
import {useSpring, a} from "@react-spring/three";
import { shadowMaterial } from 'three';

// Inject soft shadow shader
softShadows();

// 21:39 Cant use useFrame hook within the app component, create a separate function
// 28.18 use props and destructuring to create custom position for each mesh
const SpinningMesh = ({position, args, color, speed}) => {
  const mesh = useRef(null);
  useFrame(() => (mesh.current.rotation.x = mesh.current.rotation.y += 0.01));

  //add a function of expanding animation to the spinning mesh
  const [expand, setExpand] = useState(false);
  //set up props
  const props = useSpring({
    scale: expand ? [1.4, 1.4, 1.4] : [1, 1, 1]
  })

  return (
    <a.mesh 
      onClick={() => setExpand(!expand)}
      scale={props.scale}
      castShadow
      position={position} 
      ref={mesh}>
      <boxBufferGeometry attach='geometry' args={args}/>
      <MeshWobbleMaterial attach='material' color={color} speed={speed} factor={0.6}/>
    </a.mesh>
  )
}

function App() {  
  return (
    <>
      {/* This canvas only takes threejs elements */}
      <Canvas 
        shadows
        camera={{position: [-5, 2, 10], fov: 60}}>

        <ambientLight intensity={0.3} />

        <directionalLight
          castShadow
          position={[0, 10, 0]}
          intensity={1.5}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-bias={-0.0005}
          shadow-camera-near={0.01}
          shadow-camera-far={40}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={-10}
          shadow-camera-bottom={10}
        />
        
        <pointLight position={[-10, 0, -20]} intensity={0.5}/>

        <pointLight position={[0, -10, 0]} intensity={1.5}/>

        <group>
          <mesh 
            receiveShadow
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, -3, 0]}>
            <planeBufferGeometry attach='geometry' args={[100, 100]}/>
            <shadowMaterial attach='material' transparent opacity={0.4}/>
            {/* <meshPhongMaterial attach="material" color="#d1cebd" /> */}
          </mesh>

          <SpinningMesh position={[0, 1, 0]} args={[3, 2, 1]} color='lightblue' speed={2} />
          <SpinningMesh position={[-2, 1, -5]} color='pink' speed={6}/>
          <SpinningMesh position={[5, 1, -2]} color='pink' speed={6}/>  
        </group>


        

        <OrbitControls />

        <fog attach="fog" args={["#f1f4f8", 0, 40]} />
        <gridHelper position={[0, -3, 0]} args={[50,20]}/>
      </Canvas>
    </>
  );
}

export default App;
