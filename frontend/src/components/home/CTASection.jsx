// // components/home/CTASection.jsx
// import React from 'react';
// import { motion } from 'framer-motion';
// import { Link } from 'react-router-dom';
// import { ArrowRight, Sparkles, Calendar, MessageCircle } from 'lucide-react';

// const CTASection = () => {
//   return (
//     <section className="py-20 relative overflow-hidden">
//       {/* Animated Background */}
//       <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600" />
//       <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-10" />
      
//       <div className="container-custom relative z-10">
//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           viewport={{ once: true }}
//           className="text-center text-white"
//         >
//           <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
//             <Sparkles className="w-4 h-4" />
//             <span className="text-sm">Limited Time Offer</span>
//           </div>
          
//           <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
//             Ready to Transform Your Business?
//           </h2>
          
//           <p className="text-xl text-white/90 max-w-2xl mx-auto mb-10">
//             Join 50+ businesses that have accelerated their growth with our AI-augmented development.
//             Get a free consultation and project estimate today.
//           </p>
          
//           <div className="flex flex-col sm:flex-row gap-4 justify-center">
//             <Link
//               to="/contact"
//               className="bg-white text-indigo-600 px-8 py-3 rounded-xl font-semibold hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 inline-flex items-center gap-2 group"
//             >
//               Start Your Project <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
//             </Link>
//             <button className="border-2 border-white/30 text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/10 transition-all duration-300 inline-flex items-center gap-2">
//               <Calendar className="w-5 h-5" />
//               Schedule Call
//             </button>
//           </div>
          
//           <div className="mt-8 flex items-center justify-center gap-6 text-sm text-white/70">
//             <div className="flex items-center gap-2">
//               <MessageCircle className="w-4 h-4" />
//               <span>Free Consultation</span>
//             </div>
//             <div>•</div>
//             <div>No Obligation</div>
//             <div>•</div>
//             <div>24hr Response</div>
//           </div>
//         </motion.div>
//       </div>
//     </section>
//   );
// };

// export default CTASection;