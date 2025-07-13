import { useState } from 'react';

export default function LandingPage() {
  const [email, setEmail] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Header with fake login */}
      <header className="fixed w-full bg-white shadow-sm z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-indigo-600">FormGenAI</div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-indigo-600 transition-colors">Features</a>
              <a href="#examples" className="text-gray-600 hover:text-indigo-600 transition-colors">Examples</a>
              <a href="#pricing" className="text-gray-600 hover:text-indigo-600 transition-colors">Pricing</a>
              <a href="#contact" className="text-gray-600 hover:text-indigo-600 transition-colors">Contact</a>
              
              <div className="flex items-center space-x-4 ml-6">
                <button className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:border-indigo-300 hover:text-indigo-600 transition-colors">
                  Log in
                </button>
                <button className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">
                  Sign up
                </button>
              </div>
            </nav>
            
            {/* Mobile menu button */}
            <button 
              className="md:hidden focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <div className="w-6 flex flex-col space-y-1">
                <span className={`h-0.5 bg-gray-600 transition-all ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                <span className={`h-0.5 bg-gray-600 transition-all ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                <span className={`h-0.5 bg-gray-600 transition-all ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
              </div>
            </button>
          </div>
          
          {/* Mobile Navigation */}
          {isMenuOpen && (
            <nav className="md:hidden mt-4 pb-4 space-y-4">
              <a href="#features" className="block text-gray-600 hover:text-indigo-600 transition-colors">Features</a>
              <a href="#examples" className="block text-gray-600 hover:text-indigo-600 transition-colors">Examples</a>
              <a href="#pricing" className="block text-gray-600 hover:text-indigo-600 transition-colors">Pricing</a>
              <a href="#contact" className="block text-gray-600 hover:text-indigo-600 transition-colors">Contact</a>
              
              <div className="flex space-x-4 pt-2">
                <button className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:border-indigo-300 hover:text-indigo-600 transition-colors">
                  Log in
                </button>
                <button className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">
                  Sign up
                </button>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 mb-12 lg:mb-0 lg:pr-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              AI-Powered Forms in <span className="text-indigo-600">Seconds</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Generate beautiful, functional forms with just a description. 
              Let our AI handle the design, logic, and implementation.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-grow px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors focus:ring-2 focus:ring-indigo-200">
                Get Started
              </button>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center text-sm text-gray-500">
              <span className="mb-2 sm:mb-0 sm:mr-4">Trusted by 10,000+ businesses</span>
              <div className="flex items-center space-x-4">
                <span className="font-medium">Acme Inc</span>
                <span className="font-medium">TechCorp</span>
                <span className="font-medium">StartUp</span>
              </div>
            </div>
          </div>
          
          <div className="lg:w-1/2 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="space-y-4">
              <div className="pb-4 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900">Customer Feedback Form</h3>
                <p className="text-gray-500">Help us improve our services</p>
              </div>
              
              <div className="space-y-2">
                <label className="block text-gray-700">How satisfied are you with our product?</label>
                <div className="flex space-x-1 text-2xl text-yellow-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star}>★</span>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-gray-700">What could we improve?</label>
                <textarea 
                  placeholder="Your suggestions..." 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition-all"
                  rows={3}
                ></textarea>
              </div>
              
              <button className="w-full py-2.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                Submit Feedback
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Powerful Features</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to create perfect forms
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: '✨',
                title: 'AI Generation',
                description: 'Describe what you need and our AI will build the form for you instantly.'
              },
              {
                icon: '🔄',
                title: 'Smart Logic',
                description: 'Conditional questions that adapt based on previous answers.'
              },
              {
                icon: '📊',
                title: 'Analytics',
                description: 'Real-time insights into form performance and responses.'
              },
              {
                icon: '🎨',
                title: 'Custom Design',
                description: 'Match your brand with customizable colors, fonts, and layouts.'
              },
              {
                icon: '🔒',
                title: 'Secure',
                description: 'Enterprise-grade security with encryption and compliance.'
              },
              {
                icon: '🛠️',
                title: 'Integrations',
                description: 'Connect with your favorite tools like Slack, Google Sheets, and more.'
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-indigo-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to revolutionize your forms?</h2>
          <button className="px-8 py-3.5 bg-white text-indigo-600 font-medium rounded-lg hover:bg-gray-100 transition-colors shadow-md">
            Start Free Trial
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <div className="text-2xl font-bold text-white mb-4">FormGenAI</div>
              <p className="max-w-xs">The most advanced AI form builder for modern businesses.</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h4 className="text-white font-medium mb-4">Product</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Examples</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-white font-medium mb-4">Resources</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-white font-medium mb-4">Company</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <span>© 2023 FormGenAI. All rights reserved.</span>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}