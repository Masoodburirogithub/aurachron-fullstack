// src/components/home/TestimonialsSection.jsx
import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFlip } from 'swiper/modules';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-flip';

const testimonials = [
  {
    text: "A reliable technology partner that consistently delivers high-quality, professional software solutions. Their AI expertise transformed our operations and saved us countless hours.",
    author: "Jeremy Khattar",
    title: "CEO, Ronin Global LLC",
    rating: 5,
    image: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    text: "A scalable, enthusiastic team that integrates seamlessly and adapts quickly to evolving project needs. They're like an extension of our own team. Highly recommended!",
    author: "Greg Lind",
    title: "CEO, Buildly, Inc.",
    rating: 5,
    image: "https://randomuser.me/api/portraits/men/45.jpg"
  },
  {
    text: "Delivered an intuitive database with exceptional UX and flexible support for last-minute design changes. Truly outstanding partnership that exceeded our expectations.",
    author: "Aditi Das",
    title: "Head of Alliance & India Office, MPP",
    rating: 5,
    image: "https://randomuser.me/api/portraits/women/68.jpg"
  }
];

const TestimonialsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="section-padding bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 overflow-hidden">
      <div className="container-custom">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="text-indigo-200 font-semibold text-sm uppercase tracking-wider">Testimonials</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mt-2 mb-4">
              What our <span className="text-indigo-200">clients</span> are saying
            </h2>
            <p className="text-xl text-indigo-100 max-w-3xl mx-auto">
              Don't just take our word for it — hear from our satisfied clients
            </p>
          </motion.div>
        </div>

        <Swiper
          modules={[Navigation, Pagination, Autoplay, EffectFlip]}
          effect="flip"
          grabCursor={true}
          pagination={{ clickable: true, dynamicBullets: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          navigation={{
            nextEl: '.testimonial-next',
            prevEl: '.testimonial-prev',
          }}
          className="pb-12"
        >
          {testimonials.map((testimonial, idx) => (
            <SwiperSlide key={idx}>
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl max-w-3xl mx-auto">
                <Quote className="w-12 h-12 text-indigo-200 dark:text-indigo-800 mb-4" />
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-6">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center gap-4">
                  <img src={testimonial.image} alt={testimonial.author} className="w-14 h-14 rounded-full object-cover border-2 border-indigo-600" />
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white text-lg">{testimonial.author}</p>
                    <p className="text-gray-500 dark:text-gray-400">{testimonial.title}</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation Buttons */}
        <div className="flex justify-center gap-4 mt-6">
          <button className="testimonial-prev w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all duration-300 flex items-center justify-center">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button className="testimonial-next w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all duration-300 flex items-center justify-center">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;