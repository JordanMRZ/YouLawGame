function Fabric({ color, roughness = 0.82 }: { color: string; roughness?: number }) {
  return <meshStandardMaterial color={color} roughness={roughness} />
}

function Curtain({
  position,
  rotationY,
  color,
}: {
  position: [number, number, number]
  rotationY: number
  color: string
}) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {[-0.42, -0.21, 0, 0.21, 0.42].map((x, i) => (
        <mesh key={x} position={[x, 1.55, Math.sin(i * 1.1) * 0.045]} castShadow>
          <boxGeometry args={[0.22, 3.1, 0.05]} />
          <Fabric color={color} roughness={0.88} />
        </mesh>
      ))}
      <mesh position={[0, 3.12, 0.02]}>
        <cylinderGeometry args={[0.035, 0.035, 1.15, 10]} />
        <meshStandardMaterial color="#c9a227" metalness={0.72} roughness={0.28} />
      </mesh>
    </group>
  )
}

function Plant({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh>
        <cylinderGeometry args={[0.13, 0.1, 0.2, 12]} />
        <meshStandardMaterial color="#c9785a" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.04, 12]} />
        <meshStandardMaterial color="#6b4a32" roughness={1} />
      </mesh>
      <mesh position={[0, 0.32, 0]} castShadow>
        <sphereGeometry args={[0.18, 14, 12]} />
        <meshStandardMaterial color="#2f6b4f" roughness={0.75} />
      </mesh>
      <mesh position={[-0.1, 0.4, 0.06]}>
        <sphereGeometry args={[0.1, 12, 10]} />
        <meshStandardMaterial color="#3d8f63" roughness={0.7} />
      </mesh>
      <mesh position={[0.1, 0.38, -0.05]}>
        <sphereGeometry args={[0.09, 12, 10]} />
        <meshStandardMaterial color="#245c40" roughness={0.7} />
      </mesh>
    </group>
  )
}

function ClothingRack({ position }: { position: [number, number, number] }) {
  const garments = ['#1f6f8b', '#9b2226', '#e9c46a', '#ff6b9d', '#2a9d8f']
  return (
    <group position={position}>
      <mesh position={[-0.55, 0.7, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 1.4, 10]} />
        <meshStandardMaterial color="#c9a227" metalness={0.65} roughness={0.3} />
      </mesh>
      <mesh position={[0.55, 0.7, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 1.4, 10]} />
        <meshStandardMaterial color="#c9a227" metalness={0.65} roughness={0.3} />
      </mesh>
      <mesh position={[0, 1.38, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.025, 0.025, 1.16, 10]} />
        <meshStandardMaterial color="#c9a227" metalness={0.65} roughness={0.3} />
      </mesh>
      {garments.map((color, i) => (
        <group key={color} position={[-0.42 + i * 0.21, 1.12, 0]}>
          <mesh position={[0, 0.22, 0]}>
            <boxGeometry args={[0.09, 0.02, 0.04]} />
            <meshStandardMaterial color="#d7c1a4" roughness={0.5} />
          </mesh>
          <mesh castShadow>
            <boxGeometry args={[0.16, 0.42, 0.05]} />
            <Fabric color={color} roughness={0.7} />
          </mesh>
          <mesh position={[0, -0.16, 0.01]} scale={[1, 0.55, 1]}>
            <sphereGeometry args={[0.08, 10, 8]} />
            <Fabric color={color} roughness={0.7} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

export function ShopStage() {
  return (
    <>
      <color attach="background" args={['#e9d5c0']} />
      <fog attach="fog" args={['#e9d5c0', 8, 16]} />
      <hemisphereLight args={['#fff4e6', '#8d6e4c', 0.55]} />
      <ambientLight intensity={0.42} />
      <spotLight
        position={[-0.15, 3.8, 2.4]}
        intensity={18}
        angle={0.42}
        penumbra={0.7}
        distance={12}
        castShadow
        color="#fff1dc"
      />
      <spotLight position={[1.6, 3.2, 0.4]} intensity={6} angle={0.5} penumbra={0.85} color="#ffd6a5" />
      <pointLight position={[-1.6, 2.1, 1.1]} intensity={3.2} color="#9fd4ea" />
      <pointLight position={[0, 2.7, -0.4]} intensity={2.4} color="#ffe6b0" />
      <pointLight position={[0.8, 1.4, 1.6]} intensity={1.6} color="#ffffff" />

      <group position={[0, 0, -1.5]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0.4]} receiveShadow>
          <planeGeometry args={[10, 8]} />
          <meshStandardMaterial color="#cbb08a" roughness={0.92} />
        </mesh>
        {[-1.2, -0.4, 0.4, 1.2].map((z) => (
          <mesh key={z} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, z]} receiveShadow>
            <planeGeometry args={[8, 0.18]} />
            <meshStandardMaterial color="#b89870" roughness={0.95} />
          </mesh>
        ))}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0.15]} receiveShadow>
          <circleGeometry args={[1.35, 48]} />
          <meshStandardMaterial color="#7a3040" roughness={0.8} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, 0.15]}>
          <ringGeometry args={[1.18, 1.32, 48]} />
          <meshStandardMaterial color="#c9a227" metalness={0.55} roughness={0.32} />
        </mesh>

        <mesh position={[0, 0.07, 0]} receiveShadow>
          <cylinderGeometry args={[0.58, 0.66, 0.14, 40]} />
          <meshStandardMaterial color="#f3ece3" roughness={0.28} metalness={0.18} />
        </mesh>
        <mesh position={[0, 0.145, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.58, 0.018, 12, 48]} />
          <meshStandardMaterial color="#c9a227" roughness={0.24} metalness={0.72} />
        </mesh>
        <mesh position={[0, 0.15, 0]} receiveShadow>
          <cylinderGeometry args={[0.54, 0.54, 0.02, 40]} />
          <meshStandardMaterial color="#efe6d8" roughness={0.22} metalness={0.12} />
        </mesh>

        <mesh position={[0, 1.7, -2.15]} receiveShadow>
          <planeGeometry args={[9, 4.4]} />
          <meshStandardMaterial color="#f4e4d0" roughness={0.95} />
        </mesh>
        <mesh position={[0, 0.42, -2.12]}>
          <boxGeometry args={[9, 0.84, 0.08]} />
          <meshStandardMaterial color="#d7c1a4" roughness={0.75} />
        </mesh>
        <mesh position={[0, 0.86, -2.08]}>
          <boxGeometry args={[9, 0.04, 0.06]} />
          <meshStandardMaterial color="#c9a227" metalness={0.55} roughness={0.35} />
        </mesh>
        <mesh position={[0, 3.35, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[9, 6]} />
          <meshStandardMaterial color="#f7efe4" roughness={1} />
        </mesh>

        {[-1.05, -0.52, 0, 0.52, 1.05].map((x) => (
          <mesh key={x} position={[x, 2.72, -2.05]}>
            <sphereGeometry args={[0.07, 14, 14]} />
            <meshStandardMaterial color="#fff6d8" emissive="#ffe29a" emissiveIntensity={1.6} />
          </mesh>
        ))}

        <Curtain position={[-2.15, 0, -0.55]} rotationY={0.72} color="#7a3040" />
        <Curtain position={[2.25, 0, -0.35]} rotationY={-0.78} color="#2f6f68" />

        <ClothingRack position={[1.85, 0, 0.55]} />
        <Plant position={[-1.55, 0.1, 0.7]} />
        <Plant position={[1.35, 0.1, -0.85]} />

        <group position={[-1.85, 1.55, -1.35]} rotation={[0, 0.55, 0]}>
          <mesh>
            <planeGeometry args={[0.7, 1.15]} />
            <meshStandardMaterial color="#c5e4f0" metalness={0.62} roughness={0.1} />
          </mesh>
          <mesh position={[0, 0.6, 0]}>
            <boxGeometry args={[0.78, 0.05, 0.05]} />
            <meshStandardMaterial color="#c9a227" metalness={0.6} roughness={0.3} />
          </mesh>
          <mesh position={[0, -0.6, 0]}>
            <boxGeometry args={[0.78, 0.05, 0.05]} />
            <meshStandardMaterial color="#c9a227" metalness={0.6} roughness={0.3} />
          </mesh>
          <mesh position={[-0.36, 0, 0]}>
            <boxGeometry args={[0.05, 1.25, 0.05]} />
            <meshStandardMaterial color="#c9a227" metalness={0.6} roughness={0.3} />
          </mesh>
          <mesh position={[0.36, 0, 0]}>
            <boxGeometry args={[0.05, 1.25, 0.05]} />
            <meshStandardMaterial color="#c9a227" metalness={0.6} roughness={0.3} />
          </mesh>
        </group>

        <mesh position={[0, 3.05, 0.1]}>
          <cylinderGeometry args={[0.04, 0.04, 0.5, 10]} />
          <meshStandardMaterial color="#c9a227" metalness={0.7} roughness={0.28} />
        </mesh>
        <mesh position={[0, 2.72, 0.1]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color="#fff1d2" emissive="#ffdca8" emissiveIntensity={1.1} />
        </mesh>
      </group>
    </>
  )
}
