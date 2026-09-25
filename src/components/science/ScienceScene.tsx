"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sparkles, useGLTF } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { Suspense, useEffect, useMemo, useRef, type MutableRefObject } from "react";
import * as THREE from "three";

// vertical Y position of each checkpoint along the figure — head down to
// end of torso. Measured this model's actual vertex data directly
// (walking the full node transform chain): feet at y=0, head at y≈5.3,
// and the torso's width sharply changes (hip/groin) around y≈2.85. The
// visible frame extends well below the checkpoint's own Y target though
// (narrow-FOV camera looking slightly down, at this distance the visible
// span is roughly ±0.7 around the look-at point) — a floor of 3.55 let
// the hip/groin actually show on screen, so this stops higher, at 4.1,
// which keeps the visible frame's bottom edge comfortably above 2.85.
const CHECKPOINTS_Y = [5.1, 4.9, 4.7, 4.5, 4.3, 4.1];
// the traveling ball's own vertical range — deliberately separate from
// CHECKPOINTS_Y (which drives the camera/crop and stays untouched here).
// The camera's visible frame already extends below its look-at target
// (±0.7 or so at this distance/fov), so the ball can keep descending
// toward belly level, further than the last camera checkpoint's own Y,
// while staying inside the same already-visible crop. Starts at mouth
// level (was 5.1, the very top of the skull) rather than the head's own
// top — since the ball now raycasts onto the real surface, only this
// starting Y needs to move down onto the face for it to visibly start
// at the mouth instead of the scalp.
const PARTICLE_Y = [4.85, 4.56, 4.27, 3.98, 3.69, 3.4];
const BODY_COLOR = "#6a65ff";
const ACCENT = "#deff08";
const MODEL_PATH = "/models/human-body.glb";
// the model is still fitted to this full head-to-feet height regardless of
// CHECKPOINTS_Y's (now shorter) camera range — only the camera frames a
// smaller torso-up window into it, the model itself isn't cropped
const TARGET_HEIGHT = 5.3;

// real sculpted geometry (a downloaded human body model) in place of the
// earlier primitive-shape mannequin — every mesh in it gets the same glass
// transmission material plus a wireframe scan-grid duplicate, so it keeps
// this scene's established look instead of the model's own materials.
//
// exposes the "solid" clone via solidRef so TravelingParticle (rendered
// as a sibling, outside this Suspense-wrapped component — see
// ScienceScene below) can raycast against the real geometry to trace its
// actual surface, instead of guessing a fixed offset.
function BodyFigure({ solidRef }: { solidRef: MutableRefObject<THREE.Object3D | null> }) {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF(MODEL_PATH);

  const { solid, wire } = useMemo(() => {
    const solidClone = scene.clone(true);
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: BODY_COLOR,
      transmission: 0.9,
      thickness: 0.6,
      roughness: 0.18,
      ior: 1.3,
    });
    solidClone.traverse((child) => {
      if (child instanceof THREE.Mesh) child.material = glassMaterial;
    });

    // auto-fit: scale so the model's own height matches TARGET_HEIGHT,
    // then shift it so the feet sit at y=0 and it's centered on x/z —
    // works regardless of the source model's native scale or pivot point
    const box = new THREE.Box3().setFromObject(solidClone);
    const size = new THREE.Vector3();
    box.getSize(size);
    const scale = TARGET_HEIGHT / (size.y || 1);
    solidClone.scale.setScalar(scale);

    const scaledBox = new THREE.Box3().setFromObject(solidClone);
    solidClone.position.y -= scaledBox.min.y;
    solidClone.position.x -= (scaledBox.min.x + scaledBox.max.x) / 2;
    solidClone.position.z -= (scaledBox.min.z + scaledBox.max.z) / 2;

    const wireClone = solidClone.clone(true);
    const wireMaterial = new THREE.MeshBasicMaterial({ color: ACCENT, wireframe: true, transparent: true, opacity: 0.25 });
    wireClone.traverse((child) => {
      if (child instanceof THREE.Mesh) child.material = wireMaterial;
    });
    wireClone.scale.multiplyScalar(1.015); // slightly oversized to avoid z-fighting

    return { solid: solidClone, wire: wireClone };
  }, [scene]);

  useEffect(() => {
    solidRef.current = solid;
  }, [solid, solidRef]);

  useFrame((state) => {
    if (group.current) {
      // continuous slow full rotation (~30s per revolution) instead of a
      // small idle sway, so every angle — front, side, back — comes
      // smoothly into view over time rather than just a subtle wobble
      group.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <group ref={group}>
      <primitive object={solid} />
      <primitive object={wire} />
    </group>
  );
}

useGLTF.preload(MODEL_PATH);

// traces the body's ACTUAL front surface via raycasting against the real
// mesh (solidRef, populated by BodyFigure above) rather than guessing a
// fixed depth offset — a raycast fired from in front of the body at the
// current target height, straight back toward it, lands exactly on the
// surface at that height, so the ball genuinely follows the contour from
// mouth to chin to neck to chest as the checkpoint height descends,
// whatever that contour's actual depth is at each point (and rotation,
// since the ray — and the solid mesh's matrixWorld — are both in world
// space, it stays correct as the body spins too).
function TravelingParticle({ progress, solidRef }: { progress: number; solidRef: MutableRefObject<THREE.Object3D | null> }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const currentPos = useRef(new THREE.Vector3(0, PARTICLE_Y[0], 0.3));
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const rayOrigin = useMemo(() => new THREE.Vector3(), []);
  const rayDir = useMemo(() => new THREE.Vector3(0, 0, -1), []);
  const fallback = useMemo(() => new THREE.Vector3(), []);
  const lastTarget = useRef(new THREE.Vector3(0, PARTICLE_Y[0], 0.3));
  const frameParity = useRef(false);

  useFrame(() => {
    const scaled = progress * (PARTICLE_Y.length - 1);
    const idx = Math.min(Math.floor(scaled), PARTICLE_Y.length - 2);
    const t = scaled - idx;
    const targetY = THREE.MathUtils.lerp(PARTICLE_Y[idx], PARTICLE_Y[idx + 1], t);

    // raycasting against the full body mesh every single frame is real
    // CPU cost (this runs continuously whenever the pinned section is in
    // view, not just while actively scrolling, since the body itself is
    // always slowly rotating). The existing lerp below already glides
    // the ball toward its target rather than snapping to it, so
    // recomputing the raycast every other frame instead of every frame
    // is invisible in motion but halves this cost.
    frameParity.current = !frameParity.current;
    if (frameParity.current) {
      const solid = solidRef.current;
      if (solid) {
        rayOrigin.set(0, targetY, 4);
        raycaster.set(rayOrigin, rayDir);
        const hits = raycaster.intersectObject(solid, true);
        if (hits.length > 0) {
          // nudge slightly back toward the ray origin (outward) so the
          // ball sits just outside the surface instead of clipped into it
          lastTarget.current.copy(hits[0].point).addScaledVector(rayDir, -0.02);
        }
      } else {
        // the model hasn't finished loading yet — hold at a sane
        // fallback position rather than doing nothing
        lastTarget.current.copy(fallback.set(0, targetY, 0.3));
      }
    }

    // ease toward the target instead of snapping straight to it each
    // frame, so the ball glides along the surface rather than jumping
    currentPos.current.lerp(lastTarget.current, 0.15);
    meshRef.current?.position.copy(currentPos.current);
    lightRef.current?.position.copy(currentPos.current);
  });

  return (
    <>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.03, 16, 16]} />
        {/* slightly translucent rather than a flat, fully-opaque dot */}
        <meshBasicMaterial color={ACCENT} transparent opacity={0.85} />
      </mesh>
      {/* wider reach and a softer falloff (default decay is 2) than
          before, so more of the surrounding mesh picks up a shiny
          highlight as the ball nears it, not just a tight halo right
          around the ball itself */}
      <pointLight ref={lightRef} color={ACCENT} intensity={6} distance={4.5} decay={1.4} />
    </>
  );
}

function CameraRig({ progress }: { progress: number }) {
  const { camera } = useThree();
  useFrame(() => {
    // the +0.3 headroom above the first checkpoint (combined with this
    // narrow fov's fairly tall visible span at this distance) was leaving
    // a large blank gap of background above the head at the very start of
    // the section — pulled down to -0.3 so the head sits close to the
    // top of frame from the first checkpoint on, instead of well below it
    const targetY = THREE.MathUtils.lerp(
      CHECKPOINTS_Y[0] - 0.3,
      CHECKPOINTS_Y[CHECKPOINTS_Y.length - 1] - 0.1,
      progress
    );
    camera.position.y += (targetY - camera.position.y) * 0.08;
    // zoomed out a bit further than before (was 2.6 base)
    camera.position.z += (3.4 - progress * 0.6 - camera.position.z) * 0.08;
    camera.lookAt(0, camera.position.y - 0.15, 0);
  });
  return null;
}

// narrow fov (was 45) — at this camera distance, 45deg was capturing
// ~44% of the figure's total height in one frame (roughly head to
// mid-thigh) regardless of the look-at target; a tighter, more
// "portrait lens" fov keeps the distance (zoomed out) while actually
// cropping to the upper body
export default function ScienceScene({ progress }: { progress: number }) {
  const solidRef = useRef<THREE.Object3D | null>(null);
  return (
    <Canvas camera={{ position: [0, 5.0, 3.4], fov: 28 }} gl={{ antialias: true }} dpr={[1, 1.75]}>
      <color attach="background" args={["#003366"]} />
      <fog attach="fog" args={["#003366", 3, 11]} />
      <ambientLight intensity={0.25} />
      <directionalLight position={[-3, 6, 4]} intensity={0.6} color="#a89dff" />
      <Sparkles count={140} scale={[8, 8, 6]} size={2} speed={0.25} color="#9a8cff" opacity={0.6} />
      <Sparkles count={60} scale={[6, 7, 5]} size={3} speed={0.15} color={ACCENT} opacity={0.35} />
      <Suspense fallback={null}>
        <BodyFigure solidRef={solidRef} />
      </Suspense>
      <TravelingParticle progress={progress} solidRef={solidRef} />
      <CameraRig progress={progress} />
      <EffectComposer>
        <Bloom intensity={0.9} luminanceThreshold={0.15} luminanceSmoothing={0.4} mipmapBlur />
      </EffectComposer>
    </Canvas>
  );
}
