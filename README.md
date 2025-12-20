# 3D Portfolio with React Three Fiber

An immersive portfolio experience that combines traditional website navigation with first-person 3D exploration.

## Features

- **Website Mode**: Traditional scrollable portfolio interface
- **FPS Mode**: First-person navigation using WASD + mouse controls
- **Interactive Objects**: Click or press 'E' to view project details
- **Smooth Transitions**: GSAP-powered animations between modes
- **State Management**: Zustand for clean state handling

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** - Build tool
- **Three.js** - 3D rendering
- **React Three Fiber** - React renderer for Three.js
- **React Three Drei** - Useful helpers for R3F
- **GSAP** - Animation library
- **Zustand** - State management

## Getting Started

### Development

Start the dev server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build

```bash
npm run build
```

## How to Use

### Website Mode (Default)

- Scroll through the portfolio content
- Click "Enter My Room" button to switch to 3D mode

### FPS Mode

- **WASD** or **Arrow Keys**: Move around
- **Mouse**: Look around
- **Left Click** or **E Key**: Interact with objects when looking at them
- **ESC**: Exit to website mode

### Viewing Objects

- In FPS mode, look at a colored cube or click on it
- The object will highlight when you hover over it
- Press **E** or **Left Click** to view project details
- Click "Back to Room" or press **ESC** to return

## Project Structure

```
src/
├── components/
│   ├── Scene.tsx           # R3F Canvas setup
│   ├── WebsiteOverlay.tsx  # Scrollable website content
│   ├── ObjectViewer.tsx    # Modal for viewing projects
│   └── Crosshair.tsx       # FPS crosshair
├── experience/
│   ├── Room.tsx            # 3D room environment
│   ├── Controls.tsx        # FPS controls
│   └── InteractiveObject.tsx # Clickable 3D objects
├── store/
│   └── useStore.ts         # Zustand state management
└── App.tsx                 # Main app component
```

## Customization

### Adding New Interactive Objects

Edit `src/experience/Room.tsx`:

```tsx
<InteractiveObject
  position={[x, y, z]}
  color="#yourcolor"
  objectData={{
    id: "unique-id",
    title: "Project Title",
    content: "Project description...",
  }}
/>
```

### Loading 3D Models

1. Place `.glb` or `.gltf` files in `public/models/`
2. Use `useGLTF` from `@react-three/drei`:

```tsx
import { useGLTF } from "@react-three/drei";

function MyModel() {
  const { scene } = useGLTF("/models/your-model.glb");
  return <primitive object={scene} />;
}
```
