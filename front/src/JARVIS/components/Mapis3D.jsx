import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox, ContactShadows, Environment, useTexture } from "@react-three/drei";
import * as THREE from "three";
import mapisTexture from "../mapis.png";

// ─── Personaje 3D de Mapis (Facciones Ultra Felices + Animación Original) ─────
const MapisCharacter = ({ isExcited }) => {
  const meshRef      = useRef();
  const leftEyeRef   = useRef();
  const rightEyeRef  = useRef();
  const leftArmRef   = useRef();
  const rightArmRef  = useRef();
  const mouthRef     = useRef();
  const cheeksRef    = useRef();

  // Estado de la animación de click
  const clickAnim = useRef({ active: false, t: 0 });

  // Textura del mapa
  const mapTex = useTexture(mapisTexture);
  mapTex.wrapS = THREE.RepeatWrapping;
  mapTex.wrapT = THREE.RepeatWrapping;

  const texCenter = mapTex.clone();
  texCenter.needsUpdate = true;
  texCenter.repeat.set(0.34, 1);
  texCenter.offset.set(0.33, 0);

  const texLeft = mapTex.clone();
  texLeft.needsUpdate = true;
  texLeft.repeat.set(0.33, 1);
  texLeft.offset.set(0, 0);

  const texRight = mapTex.clone();
  texRight.needsUpdate = true;
  texRight.repeat.set(0.33, 1);
  texRight.offset.set(0.67, 0);

  // Activar animación de excitación cuando cambia isExcited
  const prevExcited = useRef(false);
  if (isExcited !== prevExcited.current) {
    prevExcited.current = isExcited;
    if (isExcited) {
      clickAnim.current = { active: true, t: 0 };
    }
  }

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    // ── Animación Original de excitación al hacer click ──
    if (clickAnim.current.active) {
      clickAnim.current.t += delta * 3;
      const progress = clickAnim.current.t;
      
      // Giro rápido de 360°
      meshRef.current.rotation.y = Math.sin(progress * Math.PI) * Math.PI * 2;
      // Salto hacia arriba
      meshRef.current.position.y = 0.2 + Math.sin(Math.min(progress, Math.PI)) * 0.4;
      // Escala de "pop"
      const scale = 1 + Math.sin(Math.min(progress * 2, Math.PI)) * 0.2;
      meshRef.current.scale.set(scale, scale, scale);

      if (clickAnim.current.t > Math.PI) {
        clickAnim.current.active = false;
      }
    } else {
      // ── Flotación y respiración suave (idle) ──
      meshRef.current.position.y = 0 + Math.sin(t * 1.5) * 0.07;
      meshRef.current.rotation.z = Math.sin(t * 0.5) * 0.04;
      meshRef.current.rotation.y = Math.cos(t * 0.4) * 0.1;
      meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
    }

    // ── Ojos: Parpadeo y Expresión de Felicidad (^ ^) ──
    const blinkCycle = t % 4;
    const isBlinking = blinkCycle > 3.8 || (blinkCycle > 3.5 && blinkCycle < 3.6);
    
    // Si está emocionada, los ojos se achinan de felicidad. Si no, parpadea normal.
    const targetEyeScaleY = isExcited ? 0.25 : (isBlinking ? 0.05 : 1);
    const targetEyeScaleX = isExcited ? 1.2 : 1;
    
    leftEyeRef.current.scale.y = THREE.MathUtils.lerp(leftEyeRef.current.scale.y, targetEyeScaleY, 0.4);
    leftEyeRef.current.scale.x = THREE.MathUtils.lerp(leftEyeRef.current.scale.x, targetEyeScaleX, 0.4);
    rightEyeRef.current.scale.y = THREE.MathUtils.lerp(rightEyeRef.current.scale.y, targetEyeScaleY, 0.4);
    rightEyeRef.current.scale.x = THREE.MathUtils.lerp(rightEyeRef.current.scale.x, targetEyeScaleX, 0.4);

    // ── Boca: Siempre feliz, nunca triste ──
    // Simulamos el habla con un ligero "Squash & Stretch" para que parezca viva, pero sin cerrarse.
    const talkIntensity = Math.abs(Math.sin(t * 15)) * 0.15; 
    const targetMouthScaleY = isExcited ? 1.4 : 1.0 + talkIntensity;
    const targetMouthScaleX = isExcited ? 1.2 : 1.0 - (talkIntensity * 0.3);

    mouthRef.current.scale.y = THREE.MathUtils.lerp(mouthRef.current.scale.y, targetMouthScaleY, 0.3);
    mouthRef.current.scale.x = THREE.MathUtils.lerp(mouthRef.current.scale.x, targetMouthScaleX, 0.3);

    // ── Mejillas: Palpitación de color ──
    const cheekGlow = 1 + Math.sin(t * 3) * 0.15;
    cheeksRef.current.scale.set(cheekGlow, cheekGlow, 1);

    // ── Brazos: Animación amigable y fluida ──
    leftArmRef.current.rotation.z = 0.4 + Math.sin(t * 1.5) * 0.15;
    leftArmRef.current.rotation.x = Math.sin(t * 1) * 0.1;

    const rightArmWave = isExcited ? Math.sin(t * 15) * 0.8 : Math.sin(t * 2.5) * 0.3;
    rightArmRef.current.rotation.z = -0.8 + rightArmWave;
    rightArmRef.current.rotation.x = isExcited ? 0 : Math.cos(t * 1.8) * 0.15;
  });

  // Colores Premium
  const colorExtr   = "#0f172a"; 
  const colorZapato = "#2563eb"; 
  const skinTone    = "#ffffff";

  return (
    <group ref={meshRef} position={[0, 0, 0]}>

      {/* ── CUERPO del Mapa ── */}
      <group>
        <RoundedBox args={[0.72, 1.45, 0.15]} radius={0.04} smoothness={8}>
          <meshStandardMaterial map={texCenter} roughness={0.3} metalness={0.1} />
        </RoundedBox>
        <RoundedBox args={[0.52, 1.40, 0.12]} radius={0.03} position={[-0.57, 0, 0.05]} rotation={[0, 0.45, 0]}>
          <meshStandardMaterial map={texLeft} roughness={0.3} metalness={0.1} />
        </RoundedBox>
        <RoundedBox args={[0.52, 1.40, 0.12]} radius={0.03} position={[0.57, 0, 0.05]} rotation={[0, -0.45, 0]}>
          <meshStandardMaterial map={texRight} roughness={0.3} metalness={0.1} />
        </RoundedBox>
        
        {/* Sombras de pliegue */}
        <mesh position={[-0.36, 0, 0.11]} rotation={[0, 0.05, 0]}>
          <planeGeometry args={[0.04, 1.45]} />
          <meshBasicMaterial color="#000000" transparent opacity={0.15} depthWrite={false} />
        </mesh>
        <mesh position={[0.36, 0, 0.11]} rotation={[0, -0.05, 0]}>
          <planeGeometry args={[0.04, 1.45]} />
          <meshBasicMaterial color="#000000" transparent opacity={0.15} depthWrite={false} />
        </mesh>
      </group>

      {/* ── ROSTRO Kawaii Ultra Feliz ── */}
      <group position={[0, 0.25, 0.12]}>

        {/* Ojo Izquierdo (Ligeramente inclinado para verse más tierno) */}
        <group ref={leftEyeRef} position={[-0.22, 0.1, 0]} rotation={[0, 0, 0.08]}>
          <mesh scale={[1, 1.3, 0.5]}>
            <sphereGeometry args={[0.08, 32, 32]} />
            <meshStandardMaterial color="#0f172a" roughness={0.1} />
          </mesh>
          <mesh position={[0.02, 0.04, 0.04]}>
            <sphereGeometry args={[0.025, 16, 16]} />
            <meshBasicMaterial color="white" />
          </mesh>
          <mesh position={[-0.02, -0.03, 0.04]}>
            <sphereGeometry args={[0.012, 16, 16]} />
            <meshBasicMaterial color="white" />
          </mesh>
        </group>

        {/* Ojo Derecho (Ligeramente inclinado) */}
        <group ref={rightEyeRef} position={[0.22, 0.1, 0]} rotation={[0, 0, -0.08]}>
          <mesh scale={[1, 1.3, 0.5]}>
            <sphereGeometry args={[0.08, 32, 32]} />
            <meshStandardMaterial color="#0f172a" roughness={0.1} />
          </mesh>
          <mesh position={[-0.02, 0.04, 0.04]}>
            <sphereGeometry args={[0.025, 16, 16]} />
            <meshBasicMaterial color="white" />
          </mesh>
          <mesh position={[0.02, -0.03, 0.04]}>
            <sphereGeometry args={[0.012, 16, 16]} />
            <meshBasicMaterial color="white" />
          </mesh>
        </group>

        {/* Mofletes */}
        <group ref={cheeksRef}>
          <mesh position={[-0.32, -0.05, 0.02]} scale={[1.4, 0.8, 0.1]}>
            <sphereGeometry args={[0.1, 32, 32]} />
            <meshBasicMaterial color="#f472b6" transparent opacity={0.6} />
          </mesh>
          <mesh position={[0.32, -0.05, 0.02]} scale={[1.4, 0.8, 0.1]}>
            <sphereGeometry args={[0.1, 32, 32]} />
            <meshBasicMaterial color="#f472b6" transparent opacity={0.6} />
          </mesh>
        </group>

        {/* Boca: Sonrisa de Anime Abierta */}
        <group position={[0, -0.12, 0.04]}>
          <group ref={mouthRef}>
            {/* Fondo de la boca en forma de "D" invertida */}
            <mesh rotation={[0, 0, Math.PI]}>
              <circleGeometry args={[0.075, 32, 0, Math.PI]} />
              <meshBasicMaterial color="#450a0a" />
            </mesh>
            {/* Lengüita feliz en la parte inferior */}
            <mesh position={[0, -0.035, 0.001]} scale={[1, 0.6, 1]} rotation={[0, 0, Math.PI]}>
              <circleGeometry args={[0.055, 32, 0, Math.PI]} />
              <meshBasicMaterial color="#fca5a5" />
            </mesh>
          </group>
        </group>
      </group>

      {/* ── BRAZOS Redondeados ── */}
      <group ref={leftArmRef} position={[-0.62, -0.1, 0.15]}>
        <mesh>
          <capsuleGeometry args={[0.04, 0.3, 16, 16]} />
          <meshStandardMaterial color={colorExtr} roughness={0.6} />
        </mesh>
        <mesh position={[0, -0.18, 0]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial color={skinTone} roughness={0.3} />
        </mesh>
      </group>

      <group ref={rightArmRef} position={[0.62, 0.25, 0.15]}>
        <mesh>
          <capsuleGeometry args={[0.04, 0.3, 16, 16]} />
          <meshStandardMaterial color={colorExtr} roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.18, 0]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial color={skinTone} roughness={0.3} />
        </mesh>
      </group>

      {/* ── PIERNAS Y ZAPATOS ── */}
      <group position={[-0.22, -0.85, 0]}>
        <mesh>
          <capsuleGeometry args={[0.04, 0.25, 16, 16]} />
          <meshStandardMaterial color={colorExtr} />
        </mesh>
        <RoundedBox args={[0.18, 0.14, 0.24]} radius={0.06} position={[0, -0.18, 0.05]}>
          <meshStandardMaterial color={colorZapato} roughness={0.2} />
        </RoundedBox>
      </group>

      <group position={[0.22, -0.85, 0]}>
        <mesh>
          <capsuleGeometry args={[0.04, 0.25, 16, 16]} />
          <meshStandardMaterial color={colorExtr} />
        </mesh>
        <RoundedBox args={[0.18, 0.14, 0.24]} radius={0.06} position={[0, -0.18, 0.05]}>
          <meshStandardMaterial color={colorZapato} roughness={0.2} />
        </RoundedBox>
      </group>
    </group>
  );
};

// ─── Canvas ───────────────────────────────────────────────────────────────────
const Mapis3D = ({ onClick, isChatOpen }) => {
  const [isExcited, setIsExcited] = useState(false);

  const handleClick = () => {
    setIsExcited(true);
    setTimeout(() => setIsExcited(false), 1200);
    if(onClick) onClick();
  };

  return (
    <div
      className="w-32 h-32 md:w-44 md:h-44 cursor-pointer relative z-[9999] transition-all duration-300 hover:scale-110 group"
      onClick={handleClick}
    >
      {/* Efecto Glow Dinámico */}
      <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full scale-75 group-hover:bg-blue-400/40 group-hover:scale-100 transition-all duration-500" />

      <Canvas camera={{ position: [0, 0, 4.2], fov: 45 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[2, 5, 5]} intensity={1.5} castShadow />
        <spotLight position={[-5, 5, 5]} angle={0.3} penumbra={1} intensity={1} color="#fca5a5" />
        <spotLight position={[5, -5, -5]} angle={0.3} penumbra={1} intensity={0.8} color="#60a5fa" />

        <React.Suspense fallback={null}>
          <MapisCharacter isExcited={isExcited} />
        </React.Suspense>

        <ContactShadows
          position={[0, -1.4, 0]}
          opacity={0.6}
          scale={5}
          blur={2.5}
          far={3}
          color="#0f172a"
        />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
};

export default Mapis3D;