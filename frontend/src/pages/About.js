import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiAward, FiUsers, FiHeart, FiTarget } from 'react-icons/fi';

const About = () => {
  const milestones = [
    { year: '2010', title: 'Foundation', description: 'Started with a vision to preserve traditional craftsmanship' },
    { year: '2015', title: 'Expansion', description: 'Expanded to international markets with premium quality' },
    { year: '2020', title: 'Digital Innovation', description: 'Launched virtual showroom for global reach' },
    { year: '2024', title: 'Today', description: 'Trusted by devotees worldwide for divine creations' },
  ];

  const values = [
    {
      icon: <FiAward className="text-4xl" />,
      title: 'Excellence',
      description: 'We strive for perfection in every detail, ensuring each piece meets the highest standards of craftsmanship.',
    },
    {
      icon: <FiHeart className="text-4xl" />,
      title: 'Devotion',
      description: 'Every creation is made with devotion and respect for the divine, infusing spiritual energy into each piece.',
    },
    {
      icon: <FiUsers className="text-4xl" />,
      title: 'Heritage',
      description: 'We preserve and promote traditional Indian art forms, keeping ancient techniques alive for future generations.',
    },
    {
      icon: <FiTarget className="text-4xl" />,
      title: 'Innovation',
      description: 'While honoring tradition, we embrace modern technology to enhance the customer experience.',
    },
  ];

  return (
    <>
      <Helmet>
        <title>About Us - Mateshwari Exports</title>
        <meta name="description" content="Learn about Mateshwari Exports - Crafting Divinity, One Masterpiece at a Time" />
      </Helmet>

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative h-[50vh] bg-gradient-to-br from-gold-50 via-white to-marble-100 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center px-4"
          >
            <h1 className="text-5xl md:text-6xl font-heading font-bold text-gray-900 mb-4">
              Our Story
            </h1>
            <p className="text-xl text-gray-600">
              Crafting Divinity, One Masterpiece at a Time
            </p>
          </motion.div>
        </section>

        {/* Story Section */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="prose prose-lg max-w-none"
              >
                <h2 className="text-4xl font-heading font-bold text-gray-900 mb-6">
                  Where Devotion Meets Design
                </h2>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  Step into a world where devotion meets design. At Mateshwari Exports, we don't just
                  sculpt idols—we shape sanctity. Our artisans breathe life into stone, creating divine
                  centerpieces that transform ordinary spaces into sacred sanctuaries.
                </p>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  With the launch of our exclusive virtual showroom, customers can experience the serenity
                  and splendor of handcrafted marble temples and idols from the comfort of their homes.
                  Each piece is a testament to our commitment to excellence, traditional craftsmanship,
                  and spiritual devotion.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Our journey began with a simple belief: that every home deserves a piece of divinity.
                  Today, we stand proud as a trusted name in the world of marble artistry, serving
                  devotees across the globe with our premium creations.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="section-padding bg-gray-50">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-heading font-bold text-gray-900 mb-4">
                Our Values
              </h2>
              <p className="text-gray-600 text-lg">
                The principles that guide everything we do
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-6 rounded-lg shadow-lg text-center"
                >
                  <div className="text-gold-500 mb-4 flex justify-center">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-heading font-semibold text-gray-900 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-gray-600">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="section-padding">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-heading font-bold text-gray-900 mb-4">
                Our Journey
              </h2>
            </motion.div>

            <div className="max-w-4xl mx-auto">
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gold-300"></div>

                {milestones.map((milestone, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="relative flex items-start mb-12"
                  >
                    <div className="absolute left-0 w-16 h-16 bg-gold-500 rounded-full flex items-center justify-center text-white font-bold z-10">
                      {milestone.year.slice(-2)}
                    </div>
                    <div className="ml-24">
                      <h3 className="text-2xl font-heading font-bold text-gray-900 mb-2">
                        {milestone.year} - {milestone.title}
                      </h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="section-padding bg-gradient-to-br from-gold-50 to-marble-100">
          <div className="container-custom">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">
                  Our Mission
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  To create divine masterpieces that bring peace, positivity, and spiritual energy
                  into homes and spaces worldwide. We are committed to preserving traditional
                  craftsmanship while making our creations accessible to devotees everywhere.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">
                  Our Vision
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  To become the world's most trusted name in marble idol and temple craftsmanship,
                  known for our exceptional quality, devotion to tradition, and innovative approach
                  to bringing divinity into modern homes.
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default About;

