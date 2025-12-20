import { useGLTF } from "@react-three/drei";
import TrophyCup from "./TrophyCup";
import PC from "./PC";
import PictureFrame from "./PictureFrame";
import Board from "./Board";
import CollisionBox from "../components/CollisionBox";

export default function Room() {
  // Load your 3D room model
  const { scene } = useGLTF(
    "/src/assets/vr_apartment_loft_interior__baked.glb"
  );

  return (
    <group>
      <ambientLight intensity={2} color="#ffffff" />
      <directionalLight position={[5, 8, 5]} intensity={1} color="#ffffff" />
      <directionalLight
        position={[-5, 8, -5]}
        intensity={1.5}
        color="#ffffff"
      />
      <pointLight position={[0.1, 2.2, 0]} intensity={1} distance={2000} />{" "}
      <pointLight position={[0, 2.7, 0.8]} intensity={1} distance={2000} />{" "}
      {/* Your custom 3D room model */}
      <primitive object={scene} scale={1} position={[0, 0, 0]} />
      {/* North wall */}
      <CollisionBox
        id="wall-north"
        position={[0, 1.5, -5.4]}
        size={[20, 3, 0.5]}
        visible={false}
      />
      {/* South wall */}
      <CollisionBox
        id="wall-south"
        position={[0, 1.5, 3]}
        size={[20, 3, 0.5]}
        visible={false}
      />
      {/* East wall */}
      <CollisionBox
        id="wall-east"
        position={[5.5, 1.5, 0]}
        size={[0.5, 3, 20]}
        visible={false}
      />
      {/* West wall */}
      <CollisionBox
        id="wall-west"
        position={[-3.3, 1.5, 0]}
        size={[0.5, 3, 20]}
        visible={false}
      />
      {/* Objects */}
      <CollisionBox
        id="pc-table"
        position={[2.3, 1, -4.4]}
        size={[3, 2, 0.4]}
        visible={false}
      />
      <CollisionBox
        id="pc-chair"
        position={[1.5, 1, -3.1]}
        size={[0.6, 2, 0.3]}
        visible={false}
      />
      <CollisionBox
        id="plant"
        position={[4.8, 1, -4.6]}
        size={[0.3, 2, 0.3]}
        visible={false}
      />
      <CollisionBox
        id="certificate-table"
        position={[4.8, 1, 0.5]}
        size={[0.6, 2, 2]}
        visible={false}
      />
      <CollisionBox
        id="shelf"
        position={[3.8, 1, 2.7]}
        size={[1.3, 2, 0.2]}
        visible={false}
      />
      <CollisionBox
        id="sofa"
        position={[-0.2, 1, 0.5]}
        size={[1, 2, 1]}
        visible={false}
      />
      <CollisionBox
        id="coffee-table"
        position={[0.3, 1, 1.7]}
        size={[0.2, 2, 0.2]}
        visible={false}
      />
      <CollisionBox
        id="white-board"
        position={[-1.45, 1, -2.75]}
        size={[2.3, 2, 0.2]}
        rotation={[0, 1.1, 0]}
        visible={false}
      />
      {/* Trophy Cup - Triggers Split Mode */}
      <TrophyCup
        position={[5.04, 1.21, 0.44]}
        scale={0.15}
        cameraTarget={{
          // Camera will move to this position (at eye level, looking into the room)
          position: [2, 1.7, -0.5],
          // Camera will look at this point in the room
          lookAt: [70, 15, -20],
        }}
      />
      {/* PC - Triggers Projects Split Mode */}
      <PC
        position={[2.2, 1.15, -4.5]}
        scale={1}
        rotation={[0, 0, 0]}
        interactionRange={3}
        cameraTarget={{
          position: [2, 1.7, -2.5],
          lookAt: [0, 1, -6],
        }}
      />
      {/* Picture Frame - Triggers About Split Mode */}
      <PictureFrame
        position={[0.3, 0.7, 1.8]}
        scale={0.5}
        rotation={[0, 5.5, 0]}
        interactionRange={2.5}
        cameraTarget={{
          position: [1.6, 1.7, 1.5],
          lookAt: [0.3, 0.5, 2.8],
        }}
      />
      {/* Board - Triggers Technical Split Mode */}
      <Board
        position={[-1.4, 1.1, -2.7]}
        scale={0.8}
        rotation={[0, 1.15, 0]}
        interactionRange={3}
        cameraTarget={{
          position: [0, 1.7, -1.5],
          lookAt: [-2.5, 2, -1.7],
        }}
      />
    </group>
  );
}

// Preload the model for better performance
useGLTF.preload("/src/assets/vr_apartment_loft_interior__baked.glb");
