"use client";

import { Code, Sparkles, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { footerLinks } from "./data";
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
//2:39:00