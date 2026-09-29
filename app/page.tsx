"use client";

import { Code, Sparkles, Star, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { footerLinks, testimonials } from "./data";
import { SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";


export default function LandingPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-white to-indigo-50 overflow-hidden">
      {/* Aniamated Background */}

      {/* Navigation */}

      {/* Feature Sections */}

      {/* How it works */}

      {/* Testimonials Sections */}
      <section className="relative container mx-auto px-4 py-20 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-4xl font-bold text-gray-900">
            Loved by Developers
          </h2>
          <p className="text-gray-600 mt-4">
            Join thousands of successfull learners
          </p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg flex flex-col justify-between"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <p className="text-gray-700 mb-4">"{testimonial.content}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-linear-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">
                    {testimonial.name[0]}
                  </span>
                </div>
                <div>
                  <p className="text-gray-900 font-semibold text-sm">
                    {testimonial.name}
                  </p>
                  <p className="text-gray-500 text-xs">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section*/}
      <section className="relative container mx-auto px-4 py-20 z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-linear-to-r from-purple-600 via-pink-600 to-indigo-600 p-12 text-center shadow-xl"
        >
          {/* <div className="absolute inset-0 bg-black/10" /> */}
          <div className="relative z-10">
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full mb-6"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span className="text-white text-sm font-medium">
                Limited Time Offer
              </span>
            </motion.div>

            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of developers who are already building their future
              with BuildSpace
            </p>

            <SignUpButton mode="modal">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 shadow-lg"
                >
                  Get Started For Free
                  <TrendingUp className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </SignUpButton>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-gray-200 py-8 z-10 bg-white/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-linear-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Code className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-gray-900">BuildSpace</span>
            </div>
            <div className="flex gap-6">
              {footerLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="text-gray-600 hover:text-purple-600 transition-colors text-sm"
                >
                  {link.label}
                </a>
              ))}
            </div>
            <p className="text-sm text-gray-500">
              © 2026 BuildSpace. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
