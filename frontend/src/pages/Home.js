import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFeaturedProducts } from '../store/slices/productSlice';
import ProductCard from '../components/Products/ProductCard';
import { FiArrowRight, FiStar } from 'react-icons/fi';

const Home = () => {
  const dispatch = useDispatch();
  const { featuredProducts } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchFeaturedProducts());
  }, [dispatch]);

  const features = [
    {
      title: 'Divine Artistry',
      description: 'Every sculpture tells a sacred story.',
      icon: '🎨',
    },
    {
      title: 'Virtual Darshan',
      description: 'Experience your future temple online.',
      icon: '🕉️',
    },
    {
      title: 'Made Just for You',
      description: 'Custom designs to match your faith.',
      icon: '✨',
    },
    {
      title: 'Unmatched Quality',
      description: 'Finest marble, flawless detailing.',
      icon: '💎',
    },
    {
      title: 'Spiritual Elegance',
      description: 'Peace and positivity for your home.',
      icon: '🌸',
    },
  ];

  return (
    <>
      <Helmet>
        <title>Mateshwari Exports - Crafting Divinity, One Masterpiece at a Time</title>
        <meta name="description" content="Premium marble idols and temples. Experience the serenity and splendor of handcrafted marble temples and idols." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gold-50 via-white to-marble-100"></div>
        <div className="absolute inset-0 marble-bg opacity-20"></div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-4"
        >
          <h1 className="text-5xl md:text-7xl font-heading font-bold text-gray-900 mb-4">
            Crafting Divinity,
            <br />
            <span className="text-gold-600 text-glow">One Masterpiece at a Time</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 font-light">
            Where devotion meets design
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/shop" className="btn-primary text-lg">
              Explore Our Collection
              <FiArrowRight className="inline ml-2" />
            </Link>
            <Link to="/virtual-showroom" className="btn-secondary text-lg">
              Visit Virtual Showroom
            </Link>
          </div>
        </motion.div>

        {/* Floating particles effect */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-gold-400 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                opacity: 0,
              }}
              animate={{
                y: [null, Math.random() * window.innerHeight],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-heading font-bold text-gray-900 mb-4">
              What Sets Us Apart
            </h2>
            <p className="text-gray-600 text-lg">
              Excellence in every detail, devotion in every creation
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-heading font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-heading font-bold text-gray-900 mb-4">
              Featured Masterpieces
            </h2>
            <p className="text-gray-600 text-lg">
              Handpicked creations that embody our commitment to excellence
            </p>
          </motion.div>

          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">Featured products coming soon...</p>
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/shop" className="btn-primary">
              View All Products
              <FiArrowRight className="inline ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Preview */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-heading font-bold text-gray-900 mb-4">
              Trusted by Devotees Worldwide
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="bg-gray-50 p-6 rounded-lg"
              >
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, j) => (
                    <FiStar key={j} className="text-gold-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">
                  "The craftsmanship is exceptional. Every detail is perfect, and the spiritual energy is palpable."
                </p>
                <p className="font-semibold text-gray-900">- Devotee</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;

