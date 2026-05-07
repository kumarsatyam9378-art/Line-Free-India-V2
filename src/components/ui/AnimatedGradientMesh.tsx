import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface AnimatedGradientMeshProps {
  className?: string;
  colors?: string[];
  speed?: number;
}

/**
 * Animated Gradient Mesh Background Component
 * 
 * Creates a dynamic, animated gradient mesh background
 * 
 * Features:
 * - Smooth CSS animation with background-position
 * - Multiple gradient colors
 * - Customizable animation speed
 * - Respects prefers-reduced-motion
 * - Optimized for performance
 * 
 * @example
 * ```tsx
 * <AnimatedGradientMesh
 *   colors={['#667EEA', '#764BA2', '#F093FB', '#4FACFE']}
 *   speed={20}
 * />
 * ```
 */
export function AnimatedGradientMesh({
  className = '',
  colors = ['#667EEA', '#764BA2', '#F093FB', '#4FACFE'],
  speed = 20,
}: AnimatedGradientMeshProps) {
  const prefersReducedMotion = useReducedMotion();
  const meshRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion || !meshRef.current) return;

    // Apply animation
    meshRef.current.style.animation = `gradientMeshMove ${speed}s ease infinite`;
  }, [prefersReducedMotion, speed]);

  return (
    <>
      <style>
        {`
          @keyframes gradientMeshMove {
            0%, 100% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
          }
        `}
      </style>
      <div
        ref={meshRef}
        className={`absolute inset-0 ${className}`}
        style={{
          background: `
            radial-gradient(at 0% 0%, ${colors[0]} 0px, transparent 50%),
            radial-gradient(at 100% 0%, ${colors[1]} 0px, transparent 50%),
            radial-gradient(at 100% 100%, ${colors[2]} 0px, transparent 50%),
            radial-gradient(at 0% 100%, ${colors[3]} 0px, transparent 50%)
          `,
          backgroundSize: '200% 200%',
          opacity: 0.15,
          filter: 'blur(60px)',
          willChange: prefersReducedMotion ? 'auto' : 'background-position',
        }}
      />
    </>
  );
}

/**
 * Gradient Orb Component
 * 
 * Individual animated gradient orb for more complex backgrounds
 * 
 * @example
 * ```tsx
 * <div className="relative">
 *   <GradientOrb color="#667EEA" size={400} top="10%" left="20%" />
 *   <GradientOrb color="#764BA2" size={300} top="60%" left="70%" />
 * </div>
 * ```
 */
export function GradientOrb({
  color,
  size = 400,
  top = '50%',
  left = '50%',
  opacity = 0.2,
  blur = 80,
  animationDuration = 20,
}: {
  color: string;
  size?: number;
  top?: string;
  left?: string;
  opacity?: number;
  blur?: number;
  animationDuration?: number;
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <>
      <style>
        {`
          @keyframes orbFloat {
            0%, 100% {
              transform: translate(-50%, -50%) scale(1);
            }
            33% {
              transform: translate(-50%, -50%) scale(1.1) translateX(20px);
            }
            66% {
              transform: translate(-50%, -50%) scale(0.9) translateX(-20px);
            }
          }
        `}
      </style>
      <div
        className="absolute pointer-events-none"
        style={{
          top,
          left,
          width: `${size}px`,
          height: `${size}px`,
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
          opacity,
          filter: `blur(${blur}px)`,
          transform: 'translate(-50%, -50%)',
          animation: prefersReducedMotion
            ? 'none'
            : `orbFloat ${animationDuration}s ease-in-out infinite`,
          willChange: prefersReducedMotion ? 'auto' : 'transform',
        }}
      />
    </>
  );
}

/**
 * Mesh Gradient Background Component
 * 
 * Complex mesh gradient with multiple orbs
 * 
 * @example
 * ```tsx
 * <MeshGradientBackground />
 * ```
 */
export function MeshGradientBackground() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <GradientOrb
        color="#667EEA"
        size={600}
        top="10%"
        left="10%"
        opacity={0.15}
        blur={100}
        animationDuration={25}
      />
      <GradientOrb
        color="#764BA2"
        size={500}
        top="20%"
        left="80%"
        opacity={0.12}
        blur={90}
        animationDuration={30}
      />
      <GradientOrb
        color="#F093FB"
        size={550}
        top="70%"
        left="20%"
        opacity={0.13}
        blur={95}
        animationDuration={28}
      />
      <GradientOrb
        color="#4FACFE"
        size={480}
        top="80%"
        left="75%"
        opacity={0.14}
        blur={85}
        animationDuration={22}
      />
      <GradientOrb
        color="#667EEA"
        size={400}
        top="50%"
        left="50%"
        opacity={0.1}
        blur={80}
        animationDuration={35}
      />
    </div>
  );
}

/**
 * Animated Gradient Text Component
 * 
 * Text with animated gradient effect
 * 
 * @example
 * ```tsx
 * <AnimatedGradientText>
 *   Ultra Premium Design
 * </AnimatedGradientText>
 * ```
 */
export function AnimatedGradientText({
  children,
  colors = ['#667EEA', '#764BA2', '#F093FB'],
  speed = 3,
  className = '',
}: {
  children: React.ReactNode;
  colors?: string[];
  speed?: number;
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <>
      <style>
        {`
          @keyframes gradientTextMove {
            0%, 100% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
          }
        `}
      </style>
      <span
        className={`bg-clip-text text-transparent ${className}`}
        style={{
          backgroundImage: `linear-gradient(90deg, ${colors.join(', ')})`,
          backgroundSize: '200% 200%',
          animation: prefersReducedMotion
            ? 'none'
            : `gradientTextMove ${speed}s ease infinite`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        {children}
      </span>
    </>
  );
}

export default AnimatedGradientMesh;
