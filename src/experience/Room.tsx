import { useGLTF } from "@react-three/drei";
import InteractiveObject from "./InteractiveObject";
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
      {/* Interactive Objects */}
      <InteractiveObject
        position={[-3, 0.5, -3]}
        color="#667eea"
        objectData={{
          id: "project1",
          title: "Project One",
          content:
            "This is my first amazing project. Built with React and Three.js, it showcases interactive 3D experiences.",
        }}
      />
      <InteractiveObject
        position={[3, 0.5, -3]}
        color="#f093fb"
        objectData={{
          id: "project2",
          title: "Project Two",
          content:
            "A revolutionary web application that combines cutting-edge design with powerful functionality.",
        }}
      />
      <InteractiveObject
        position={[0, 0.5, -5]}
        color="#4facfe"
        objectData={{
          id: "about",
          title: "About Me",
          content:
            "I'm a passionate developer who loves creating immersive web experiences. Let's build something amazing together!",
        }}
      />
      {/* Collision Boxes - Define walls and boundaries */}
      {/* Set visible={true} to see collision boxes for debugging */}
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
      {/* Example: Collision boxes around interactive objects */}
      <CollisionBox
        id="object-project1"
        position={[-3, 0.5, -3]}
        size={[1, 1, 1]}
        visible={false}
      />
      <CollisionBox
        id="object-project2"
        position={[3, 0.5, -3]}
        size={[1, 1, 1]}
        visible={false}
      />
      <CollisionBox
        id="object-about"
        position={[0, 0.5, -5]}
        size={[1, 1, 1]}
        visible={false}
      />
    </group>
  );
}

// Preload the model for better performance
useGLTF.preload("/src/assets/vr_apartment_loft_interior__baked.glb");
