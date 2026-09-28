import { Code } from "lucide-react";
import { footerLinks } from "./data";


export default function LandingPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-white to-indigo-50 overflow-hidden">
      {/* Aniamated Background */}

      {/* Navigation */}

      {/* Feature Sections */}

      {/* How it works */}

      {/* Testimonials Sections */}

      {/* CTA Section*/}

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
