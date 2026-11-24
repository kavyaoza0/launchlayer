import { useEffect, useRef, useState } from 'react';

const VERTEX_SHADER_SOURCE = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER_SOURCE = `
  precision highp float;

  uniform vec2 u_resolution;
  uniform float u_time;
  uniform vec2 u_pointer;
  uniform float u_pointerIntensity;

  // --- Shared GLSL preamble: hashed value noise, six-octave fbm, two-level domain warp ---

  float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float vnoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);

    float a = hash21(i);
    float b = hash21(i + vec2(1.0, 0.0));
    float c = hash21(i + vec2(0.0, 1.0));
    float d = hash21(i + vec2(1.0, 1.0));

    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    mat2 rot = mat2(0.80, 0.60, -0.60, 0.80);

    for (int i = 0; i < 6; i++) {
      value += amplitude * vnoise(p);
      p = rot * p * 2.02 + vec2(17.1, 31.7);
      amplitude *= 0.5;
    }

    return value;
  }

  vec2 warp(vec2 p, float t) {
    vec2 q = vec2(
      fbm(p + vec2(0.0, 0.0) + 0.14 * vec2(t, -t * 0.6)),
      fbm(p + vec2(5.2, 1.3) + 0.12 * vec2(-t * 0.5, t))
    );

    vec2 r = vec2(
      fbm(p + 2.4 * q + vec2(1.7, 9.2) + 0.08 * t),
      fbm(p + 2.4 * q + vec2(8.3, 2.8) - 0.07 * t)
    );

    return p + 0.95 * r;
  }

  // --- Halftone body ---

  void main() {
    float minDim = max(min(u_resolution.x, u_resolution.y), 1.0);
    vec2 uv = gl_FragCoord.xy / minDim;

    // 34-cell lattice: sample fbm once at each CELL CENTRE
    const float LATTICE = 34.0;
    vec2 gridUv = uv * LATTICE;
    vec2 cellId = floor(gridUv);
    vec2 cellCenter = (cellId + 0.5) / LATTICE;

    float slowTime = u_time * 0.16;
    vec2 warpedCenter = warp(cellCenter * 1.15, slowTime);
    float field = fbm(warpedCenter * 1.45 + vec2(slowTime * 0.18, -slowTime * 0.11));

    // Pointer influence evaluated at cell centre so dot radius remains uniform per cell
    vec2 pointerUv = u_pointer / minDim;
    float pointerDist = length(cellCenter - pointerUv);
    float pointerFalloff = exp(-pointerDist * 2.75) * u_pointerIntensity;

    float shapedField = clamp((field - 0.24) * 1.65, 0.0, 1.0);
    float combined = clamp(shapedField + pointerFalloff * 0.58 + u_pointerIntensity * 0.08, 0.0, 1.0);

    // Dot radius for the whole cell
    float radius = mix(0.04, 0.44, pow(combined, 1.25));

    vec2 localUv = fract(gridUv) - 0.5;
    float dist = length(localUv);
    float aa = max(1.15 / (minDim / LATTICE), 0.015);
    float dotMask = 1.0 - smoothstep(radius - aa, radius + aa, dist);

    // Warm Editorial Palette: Ground #08090D, shadow #0D090A, slate ink #DBE0EB, warm amber #D99B52, burgundy #C4454B
    vec3 colGround   = vec3(8.0, 9.0, 13.0) / 255.0;
    vec3 colShadow   = vec3(15.0, 9.0, 11.0) / 255.0;
    vec3 colInk      = vec3(219.0, 224.0, 235.0) / 255.0;
    vec3 colBurgundy = vec3(196.0, 69.0, 75.0) / 255.0;
    vec3 colAmber    = vec3(217.0, 155.0, 82.0) / 255.0;

    // Subtle tonal depth plus gentle warm burgundy-amber underglow on pointer hover
    vec3 base = mix(colShadow, colGround, smoothstep(0.15, 0.85, field));
    base += colBurgundy * (0.045 * pointerFalloff) + colAmber * (0.025 * smoothstep(0.35, 0.9, field));

    vec3 warmTone = mix(colBurgundy, colAmber, smoothstep(0.2, 0.85, field));
    vec3 activeInk = mix(colInk, warmTone, clamp(0.24 + pointerFalloff * 0.72, 0.0, 1.0));
    float dotStrength = mix(0.18, 0.48, pointerFalloff) * (0.45 + 0.55 * combined);
    vec3 color = mix(base, activeInk, dotMask * dotStrength);

    gl_FragColor = vec4(color, 1.0);
  }
`;

function compileShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(
  gl: WebGLRenderingContext,
  vertexSource: string,
  fragmentSource: string
): WebGLProgram | null {
  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  if (!vertexShader || !fragmentShader) return null;

  const program = gl.createProgram();
  if (!program) return null;

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

export function HalftoneCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [webglFailed, setWebglFailed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl =
      canvas.getContext('webgl', {
        alpha: false,
        antialias: false,
        depth: false,
        stencil: false,
        powerPreference: 'high-performance',
      }) ||
      (canvas.getContext('experimental-webgl') as WebGLRenderingContext | null);

    if (!gl) {
      setWebglFailed(true);
      return;
    }

    const program = createProgram(gl, VERTEX_SHADER_SOURCE, FRAGMENT_SHADER_SOURCE);
    if (!program) {
      setWebglFailed(true);
      return;
    }

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const positionLoc = gl.getAttribLocation(program, 'a_position');
    const resolutionLoc = gl.getUniformLocation(program, 'u_resolution');
    const timeLoc = gl.getUniformLocation(program, 'u_time');
    const pointerLoc = gl.getUniformLocation(program, 'u_pointer');
    const pointerIntensityLoc = gl.getUniformLocation(program, 'u_pointerIntensity');

    const pointer = {
      targetX: window.innerWidth * 0.65,
      targetY: window.innerHeight * 0.45,
      x: window.innerWidth * 0.65,
      y: window.innerHeight * 0.45,
      targetIntensity: 0,
      intensity: 0,
      dpr: 1,
    };

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let prefersReducedMotion = motionQuery.matches;
    let rafId = 0;
    let startTime = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      pointer.dpr = dpr;
      const width = Math.max(1, Math.floor(window.innerWidth * dpr));
      const height = Math.max(1, Math.floor(window.innerHeight * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      gl.viewport(0, 0, width, height);
    };

    const drawFrame = (elapsedSeconds: number) => {
      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.enableVertexAttribArray(positionLoc);
      gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

      gl.uniform2f(resolutionLoc, canvas.width, canvas.height);
      gl.uniform1f(timeLoc, elapsedSeconds);
      gl.uniform2f(
        pointerLoc,
        pointer.x * pointer.dpr,
        (window.innerHeight - pointer.y) * pointer.dpr
      );
      gl.uniform1f(pointerIntensityLoc, pointer.intensity);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    const tick = (now: number) => {
      // Smooth pointer coordinates and intensity so the halftone strengthens under cursor and relaxes on exit
      pointer.x += (pointer.targetX - pointer.x) * 0.1;
      pointer.y += (pointer.targetY - pointer.y) * 0.1;
      pointer.intensity += (pointer.targetIntensity - pointer.intensity) * 0.075;
      pointer.targetIntensity *= 0.965;

      drawFrame((now - startTime) * 0.001);
      rafId = window.requestAnimationFrame(tick);
    };

    const handlePointerMove = (e: PointerEvent) => {
      pointer.targetX = e.clientX;
      pointer.targetY = e.clientY;
      pointer.targetIntensity = 1.0;
    };

    const handlePointerLeave = () => {
      pointer.targetIntensity = 0;
    };

    const handleResize = () => {
      resize();
      if (prefersReducedMotion) {
        drawFrame(4.2);
      }
    };

    const handleMotionChange = (e: MediaQueryListEvent) => {
      prefersReducedMotion = e.matches;
      window.cancelAnimationFrame(rafId);
      if (prefersReducedMotion) {
        pointer.intensity = 0;
        drawFrame(4.2);
      } else {
        startTime = performance.now();
        rafId = window.requestAnimationFrame(tick);
      }
    };

    resize();

    if (prefersReducedMotion) {
      drawFrame(4.2);
    } else {
      rafId = window.requestAnimationFrame(tick);
    }

    window.addEventListener('resize', handleResize);
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('pointerleave', handlePointerLeave);
    motionQuery.addEventListener('change', handleMotionChange);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerleave', handlePointerLeave);
      motionQuery.removeEventListener('change', handleMotionChange);
      gl.deleteBuffer(positionBuffer);
      gl.deleteProgram(program);
    };
  }, []);

  return (
    <>
      {/* Hidden fallback panel behind the canvas, shown only if WebGL context creation fails */}
      <div
        aria-hidden={!webglFailed}
        className={`absolute inset-0 z-0 halftone-fallback transition-opacity duration-300 ${
          webglFailed ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none hidden'
        }`}
      />
      {!webglFailed && (
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="absolute inset-0 z-0 block w-full h-full pointer-events-none"
        />
      )}
    </>
  );
}
