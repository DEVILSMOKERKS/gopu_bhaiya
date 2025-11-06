import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import { motion } from 'framer-motion';
import { FiCalendar, FiArrowRight } from 'react-icons/fi';

// Simple 3D scene component
const ShowroomScene = () => {
  return (
    <Canvas>
      <PerspectiveCamera makeDefault position={[0, 5, 10]} />
      <OrbitControls enableZoom={true} enablePan={true} enableRotate={true} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <Environment preset="sunset" />
      
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#f5f5f5" />
      </mesh>

      {/* Centerpiece */}
      <mesh position={[0, 2, 0]}>
        <boxGeometry args={[2, 4, 2]} />
        <meshStandardMaterial color="#ffd700" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Decorative elements */}
      {[...Array(4)].map((_, i) => (
        <mesh key={i} position={[Math.cos(i * Math.PI / 2) * 3, 1, Math.sin(i * Math.PI / 2) * 3]}>
          <cylinderGeometry args={[0.3, 0.3, 2, 32]} />
          <meshStandardMaterial color="#d4af37" />
        </mesh>
      ))}
    </Canvas>
  );
};

const VirtualShowroom = () => {
  return (
    <>
      <Helmet>
        <title>Virtual Showroom - Mateshwari Exports</title>
        <meta name="description" content="Experience our marble idols and temples in immersive 3D" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative h-[60vh] bg-gradient-to-br from-gold-50 via-white to-marble-100 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center px-4 z-10"
          >
            <h1 className="text-5xl md:text-6xl font-heading font-bold text-gray-900 mb-4">
              Virtual Showroom
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Experience the serenity and splendor of our divine creations
            </p>
          </motion.div>
        </section>

        {/* 3D Viewer Section */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="bg-white rounded-lg shadow-xl overflow-hidden mb-8">
              <div className="h-[600px] bg-gray-900">
                <ShowroomScene />
              </div>
              <div className="p-6 bg-gray-50">
                <p className="text-gray-600 text-center">
                  Use your mouse to rotate, scroll to zoom, and drag to pan around the showroom
                </p>
              </div>
            </div>

            {/* Information Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-lg shadow-lg"
              >
                <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">
                  Guided Tour
                </h2>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  Our virtual showroom allows you to explore our collection of marble idols and temples
                  from the comfort of your home. Navigate through different sections, zoom in on intricate
                  details, and experience the divine craftsmanship that goes into each masterpiece.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <span className="text-gold-500 mr-2">✓</span>
                    360° product views
                  </li>
                  <li className="flex items-center">
                    <span className="text-gold-500 mr-2">✓</span>
                    Detailed craftsmanship showcase
                  </li>
                  <li className="flex items-center">
                    <span className="text-gold-500 mr-2">✓</span>
                    Interactive exploration
                  </li>
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-gold-50 to-marble-100 p-8 rounded-lg shadow-lg"
              >
                <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">
                  Book Your Virtual Appointment
                </h2>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  Want a personalized virtual tour? Schedule an appointment with our team and we'll
                  guide you through our collection, answer your questions, and help you find the
                  perfect piece for your space.
                </p>
                <Link
                  to="/contact"
                  className="btn-primary inline-flex items-center gap-2"
                >
                  <FiCalendar />
                  Schedule Appointment
                  <FiArrowRight />
                </Link>
              </motion.div>
            </div>

            {/* Featured Products Link */}
            <div className="text-center">
              <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">
                Explore Our Collection
              </h2>
              <p className="text-gray-600 mb-6">
                Discover our complete range of marble idols and temples
              </p>
              <Link to="/shop" className="btn-primary">
                View All Products
                <FiArrowRight className="inline ml-2" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default VirtualShowroom;

