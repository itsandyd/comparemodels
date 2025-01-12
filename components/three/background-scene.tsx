'use client'
import React, { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { motion } from 'framer-motion'

export function BackgroundScene() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mountRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true 
    })

    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    mountRef.current.appendChild(renderer.domElement)

    // Create particles
    const particlesGeometry = new THREE.BufferGeometry()
    const count = 5000

    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      const radius = Math.random() * 10
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI

      // Spherical distribution
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i3 + 2] = radius * Math.cos(phi)

      // Light blue and purple gradient colors
      colors[i3] = 0.2 + Math.random() * 0.3     // R: subtle red
      colors[i3 + 1] = 0.4 + Math.random() * 0.4 // G: medium green
      colors[i3 + 2] = 0.8 + Math.random() * 0.2 // B: strong blue
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    particlesGeometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3))

    // Enhanced shader material
    const particlesMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        attribute vec3 aColor;
        varying vec3 vColor;
        void main() {
          vColor = aColor;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          gl_PointSize = 5.0 * (1.0 / -mvPosition.z);
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        void main() {
          float strength = distance(gl_PointCoord, vec2(0.5));
          strength = 1.0 - strength;
          strength = pow(strength, 2.0);
          vec3 finalColor = mix(vec3(0.0), vColor, strength);
          gl_FragColor = vec4(finalColor, strength * 0.8);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true
    })

    const particles = new THREE.Points(particlesGeometry, particlesMaterial)
    scene.add(particles)

    camera.position.z = 15

    // Enhanced mouse interaction
    const mouse = new THREE.Vector2()
    const targetRotation = new THREE.Vector2()
    window.addEventListener('mousemove', (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
      
      targetRotation.x = mouse.y * 0.5
      targetRotation.y = mouse.x * 0.5
    })

    // Animation
    const clock = new THREE.Clock()

    const animate = () => {
      const elapsedTime = clock.getElapsedTime()

      // Smooth rotation
      particles.rotation.y += (targetRotation.y - particles.rotation.y) * 0.05
      particles.rotation.x += (targetRotation.x - particles.rotation.x) * 0.05

      // Additional wave motion
      particles.position.y = Math.sin(elapsedTime * 0.5) * 0.3
      
      // Particle size pulsing
      const scale = 1 + Math.sin(elapsedTime) * 0.3
      particles.scale.set(scale, scale, scale)

      renderer.render(scene, camera)
      requestAnimationFrame(animate)
    }

    animate()

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }

    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', () => {})
      mountRef.current?.removeChild(renderer.domElement)
      particlesGeometry.dispose()
      particlesMaterial.dispose()
    }
  }, [])

  return (
    <motion.div 
      ref={mountRef}
      className="fixed top-0 left-0 w-full h-full -z-10 bg-gradient-to-b from-white to-blue-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    />
  )
} 