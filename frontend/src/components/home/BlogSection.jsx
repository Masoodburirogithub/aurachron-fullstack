// components/home/BlogSection.jsx
import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Clock, User, Tag } from 'lucide-react';

const blogPosts = [
  {
    title: "The Future of AI-Augmented Development in 2026",
    excerpt: "Explore how AI is transforming software development and what it means for businesses in Pakistan.",
    date: "Jan 15, 2026",
    readTime: "5 min read",
    author: "Ahmed Raza",
    category: "AI Trends",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600"
  },
  {
    title: "Why Zero Technical Debt Matters for Enterprise SaaS",
    excerpt: "Learn how maintaining clean code and architecture can save millions in the long run.",
    date: "Jan 10, 2026",
    readTime: "7 min read",
    author: "Sara Khan",
    category: "SaaS",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600"
  },
  {
    title: "Building Pakistan's First Agentic Automation Platform",
    excerpt: "A deep dive into how we built a unified SDK connecting 150+ enterprise platforms.",
    date: "Jan 5, 2026",
    readTime: "8 min read",
    author: "Omar Farooq",
    category: "Case Study",
    image: "https://images.unsplash.com/photo-1551434678-e076c2235d7d?w=600"
  }
];

const BlogCard = ({ post, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500"
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={post.image} 
          alt={post.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-indigo-600 text-white text-xs px-2 py-1 rounded-full">
            {post.category}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-3">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{post.date}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{post.readTime}</span>
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {post.title}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
          {post.excerpt}
        </p>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">{post.author}</span>
          </div>
          <Link 
            to="/blog" 
            className="text-indigo-600 dark:text-indigo-400 text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all"
          >
            Read More <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
};

const BlogSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="section-padding bg-gray-50 dark:bg-gray-900">
      <div className="container-custom">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold text-sm uppercase tracking-wider">Insights</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mt-2 mb-4">
              Latest <span className="gradient-text">Blog Posts</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Insights, thoughts, and industry trends from our experts
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, idx) => (
            <BlogCard key={idx} post={post} index={idx} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/blog" className="btn-outline inline-flex items-center gap-2 group">
            View All Articles <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;