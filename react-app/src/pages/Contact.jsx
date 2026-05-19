import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'general'
  });

  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    console.log('Form submitted:', formData);
    setSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        type: 'general'
      });
      setSubmitted(false);
    }, 3000);
  };

  const contactReasons = [
    {
      icon: 'mail',
      title: 'General Inquiry',
      description: 'Questions about Artohie platform and features'
    },
    {
      icon: 'support_agent',
      title: 'Support',
      description: 'Need help with your account or technical issues'
    },
    {
      icon: 'business',
      title: 'Partnership',
      description: 'Interested in collaboration opportunities'
    },
    {
      icon: 'bug_report',
      title: 'Report Issue',
      description: 'Found a bug or want to report a problem'
    }
  ];

  const socialLinks = [
    { icon: 'mail', label: 'Email', value: 'hello@artohie.com' },
    { icon: 'language', label: 'Website', value: 'www.artohie.com' },
    { icon: 'location_on', label: 'Address', value: 'San Francisco, CA' }
  ];

  return (
    <div className="font-['Inter'] text-[#1a1c1d] selection:bg-[#ffdea0] selection:text-[#261a00] bg-[#f9f9fb]">
      <Navbar />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="min-h-[500px] flex items-center px-5 md:px-[80px] py-20 max-w-[1440px] mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="w-full text-center"
          >
            <motion.h1
              variants={fadeInUp}
              className="font-['Hanken_Grotesk'] text-[40px] md:text-[64px] font-bold leading-[1.1] tracking-[-0.04em] mb-6"
            >
              Get in Touch
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="font-['Inter'] text-[16px] md:text-[18px] text-[#444748] max-w-2xl mx-auto mb-8"
            >
              Have a question or feedback? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </motion.p>
          </motion.div>
        </section>

        {/* Contact Info Cards */}
        <section className="px-5 md:px-[80px] py-20 max-w-[1440px] mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
          >
            {socialLinks.map((link, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="bg-white rounded-xl p-8 border border-[#e2e2e4] hover:border-[#735b25] transition-all duration-300 hover:shadow-lg"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-[#ffdea0]/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#735b25]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      {link.icon}
                    </span>
                  </div>
                  <h3 className="font-['Hanken_Grotesk'] text-[18px] font-[600] text-black">
                    {link.label}
                  </h3>
                </div>
                <p className="font-['Inter'] text-[16px] text-[#444748]">
                  {link.value}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Contact Form Section */}
        <section className="px-5 md:px-[80px] py-20 max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
            {/* Form */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="lg:col-span-2"
            >
              <motion.h2
                variants={fadeInUp}
                className="font-['Hanken_Grotesk'] text-[32px] font-[600] mb-8"
              >
                Send us a Message
              </motion.h2>

              <motion.form
                variants={staggerContainer}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                {/* Contact Type */}
                <motion.div variants={fadeInUp}>
                  <label className="block font-['Inter'] text-[14px] font-[600] text-black mb-3">
                    What's this about?
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-[#e2e2e4] font-['Inter'] text-[16px] focus:outline-none focus:border-[#735b25] focus:ring-2 focus:ring-[#735b25]/10 transition-all"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="support">Support</option>
                    <option value="partnership">Partnership</option>
                    <option value="bug">Report Issue</option>
                  </select>
                </motion.div>

                {/* Name Field */}
                <motion.div variants={fadeInUp}>
                  <label className="block font-['Inter'] text-[14px] font-[600] text-black mb-3">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-[#e2e2e4] font-['Inter'] text-[16px] placeholder:text-[#c4c7c7] focus:outline-none focus:border-[#735b25] focus:ring-2 focus:ring-[#735b25]/10 transition-all"
                  />
                </motion.div>

                {/* Email Field */}
                <motion.div variants={fadeInUp}>
                  <label className="block font-['Inter'] text-[14px] font-[600] text-black mb-3">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-[#e2e2e4] font-['Inter'] text-[16px] placeholder:text-[#c4c7c7] focus:outline-none focus:border-[#735b25] focus:ring-2 focus:ring-[#735b25]/10 transition-all"
                  />
                </motion.div>

                {/* Subject Field */}
                <motion.div variants={fadeInUp}>
                  <label className="block font-['Inter'] text-[14px] font-[600] text-black mb-3">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Message subject"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-[#e2e2e4] font-['Inter'] text-[16px] placeholder:text-[#c4c7c7] focus:outline-none focus:border-[#735b25] focus:ring-2 focus:ring-[#735b25]/10 transition-all"
                  />
                </motion.div>

                {/* Message Field */}
                <motion.div variants={fadeInUp}>
                  <label className="block font-['Inter'] text-[14px] font-[600] text-black mb-3">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us more about your inquiry..."
                    rows="6"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-[#e2e2e4] font-['Inter'] text-[16px] placeholder:text-[#c4c7c7] focus:outline-none focus:border-[#735b25] focus:ring-2 focus:ring-[#735b25]/10 transition-all resize-none"
                  />
                </motion.div>

                {/* Submit Button */}
                <motion.div variants={fadeInUp}>
                  {!submitted ? (
                    <button
                      type="submit"
                      className="w-full bg-black text-white px-8 py-4 font-['Inter'] font-[600] text-[14px] rounded-full hover:bg-black/90 active:scale-95 transition-all duration-200"
                    >
                      Send Message
                    </button>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="w-full bg-[#735b25] text-white px-8 py-4 font-['Inter'] font-[600] text-[14px] rounded-full flex items-center justify-center gap-3"
                    >
                      <span className="material-symbols-outlined">check_circle</span>
                      Message Sent Successfully!
                    </motion.div>
                  )}
                </motion.div>
              </motion.form>
            </motion.div>

            {/* Contact Reasons - Sidebar */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="lg:col-span-1"
            >
              <motion.h3
                variants={fadeInUp}
                className="font-['Hanken_Grotesk'] text-[24px] font-[600] mb-8"
              >
                How Can We Help?
              </motion.h3>
              
              <div className="space-y-4">
                {contactReasons.map((reason, idx) => (
                  <motion.div
                    key={idx}
                    variants={fadeInUp}
                    className="bg-white rounded-lg p-4 border border-[#e2e2e4] hover:border-[#735b25] transition-all group cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#ffdea0]/20 flex items-center justify-center flex-shrink-0 group-hover:bg-[#735b25] group-hover:text-white transition-all">
                        <span className="material-symbols-outlined text-[#735b25] group-hover:text-white transition-colors" style={{ fontVariationSettings: "'FILL' 1" }}>
                          {reason.icon}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-['Hanken_Grotesk'] text-[16px] font-[600] text-black mb-1">
                          {reason.title}
                        </h4>
                        <p className="font-['Inter'] text-[14px] text-[#444748]">
                          {reason.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* FAQ Hint */}
              <motion.div
                variants={fadeInUp}
                className="mt-12 p-6 bg-[#f3f3f5] rounded-lg border border-[#e2e2e4]"
              >
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#735b25] flex-shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>
                    lightbulb
                  </span>
                  <div>
                    <h4 className="font-['Hanken_Grotesk'] text-[16px] font-[600] text-black mb-1">
                      Quick Help
                    </h4>
                    <p className="font-['Inter'] text-[14px] text-[#444748]">
                      Check out our help center for common questions and answers.
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="px-5 md:px-[80px] py-20 max-w-[1440px] mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2
              variants={fadeInUp}
              className="font-['Hanken_Grotesk'] text-[32px] font-[600] text-center mb-12"
            >
              Frequently Asked Questions
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  q: 'How long does it take to get a response?',
                  a: 'We typically respond to inquiries within 24-48 hours during business days.'
                },
                {
                  q: 'Can I change my account type after creation?',
                  a: 'Yes, you can upgrade or change your account type anytime from your account settings.'
                },
                {
                  q: 'What payment methods do you accept?',
                  a: 'We accept all major credit cards, PayPal, and bank transfers for certain transactions.'
                },
                {
                  q: 'How do I report a copyright issue?',
                  a: 'Please fill out our copyright form, and we\'ll investigate your claim promptly.'
                }
              ].map((faq, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeInUp}
                  className="bg-white rounded-xl p-6 border border-[#e2e2e4]"
                >
                  <h4 className="font-['Hanken_Grotesk'] text-[16px] font-[600] text-black mb-3">
                    {faq.q}
                  </h4>
                  <p className="font-['Inter'] text-[14px] text-[#444748] leading-relaxed">
                    {faq.a}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
