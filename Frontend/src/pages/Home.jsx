import React from 'react'
import { Link } from 'react-router-dom'
import Chatbot from '../components/Chatbot'

const Home = () => {
  return (
    <>
      {/* Hero Section */}
      <section 
        className="hero-gradient text-white py-20 bg-center bg-no-repeat relative"
        style={{
          backgroundImage: "url('../../dist/assets/background.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center center"
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">Welcome to UAP CSE Alumni Connect</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Building a strong community connecting current students, faculty, and alumni. 
            Network, share opportunities, and grow together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/login" 
              className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Join Our Community
            </Link>
            <Link 
              to="/alumni-directory" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors"
            >
              Browse Alumni
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">What We Offer</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Alumni Directory */}
            <div className="bg-white rounded-xl shadow-lg p-6 card-hover">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <i className="fas fa-users text-purple-600 text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Alumni Directory</h3>
              <p className="text-gray-600 mb-4">
                Connect with fellow alumni by batch, company, or designation. View profiles with LinkedIn, GitHub, and more.
              </p>
              <Link 
                to="/alumni-directory" 
                className="text-purple-600 font-medium hover:text-purple-700"
              >
                Browse Directory →
              </Link>
            </div>

            {/* Job Opportunities */}
            <div className="bg-white rounded-xl shadow-lg p-6 card-hover">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <i className="fas fa-briefcase text-blue-600 text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Job Opportunities</h3>
              <p className="text-gray-600 mb-4">
                Find and post job opportunities. Apply directly through the platform with application tracking.
              </p>
              <Link 
                to="/job-opportunities" 
                className="text-blue-600 font-medium hover:text-blue-700"
              >
                View Jobs →
              </Link>
            </div>

            {/* Events */}
            <div className="bg-white rounded-xl shadow-lg p-6 card-hover">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <i className="fas fa-calendar-alt text-green-600 text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Upcoming Events</h3>
              <p className="text-gray-600 mb-4">
                Stay updated with department events, workshops, and networking opportunities.
              </p>
              <Link 
                to="/events" 
                className="text-green-600 font-medium hover:text-green-700"
              >
                View Events →
              </Link>
            </div>

            {/* Community */}
            <div className="bg-white rounded-xl shadow-lg p-6 card-hover">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <i className="fas fa-comments text-yellow-600 text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Community Forum</h3>
              <p className="text-gray-600 mb-4">
                Engage in discussions, share experiences, and connect with the community.
              </p>
              <Link 
                to="/community" 
                className="text-yellow-600 font-medium hover:text-yellow-700"
              >
                Join Discussion →
              </Link>
            </div>

            {/* Mentorship */}
            <div className="bg-white rounded-xl shadow-lg p-6 card-hover">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <i className="fas fa-handshake text-red-600 text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Mentorship Program</h3>
              <p className="text-gray-600 mb-4">
                Connect alumni mentors with current students for guidance and career advice.
              </p>
              <Link 
                to="/mentorship" 
                className="text-red-600 font-medium hover:text-red-700"
              >
                Find Mentor →
              </Link>
            </div>

            {/* Resources */}
            <div className="bg-white rounded-xl shadow-lg p-6 card-hover">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <i className="fas fa-book text-indigo-600 text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Resource Sharing</h3>
              <p className="text-gray-600 mb-4">
                Access and share academic resources, study materials, and industry insights.
              </p>
              <Link 
                to="/resources" 
                className="text-indigo-600 font-medium hover:text-indigo-700"
              >
                Browse Resources →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">500+</div>
              <div className="text-gray-600">Alumni Members</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
              <div className="text-gray-600">Job Postings</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">25+</div>
              <div className="text-gray-600">Events This Year</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-red-600 mb-2">100+</div>
              <div className="text-gray-600">Mentorship Matches</div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Recent Activity</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Recent Job */}
            <div className="bg-white rounded-lg shadow-md p-6 recent-card-hover">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-briefcase text-blue-600"></i>
                </div>
                <div className="ml-3">
                  <h4 className="font-semibold text-gray-800">New Job Posted</h4>
                  <p className="text-sm text-gray-600">Software Engineer at Google</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-3">
                Senior Software Engineer position available at Google. Apply now!
              </p>
              <Link 
                to="/job-opportunities" 
                className="text-purple-600 text-sm hover:text-purple-700"
              >
                View Details →
              </Link>
            </div>

            {/* Recent Event */}
            <div className="bg-white rounded-lg shadow-md p-6 recent-card-hover">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-calendar text-green-600"></i>
                </div>
                <div className="ml-3">
                  <h4 className="font-semibold text-gray-800">New Event</h4>
                  <p className="text-sm text-gray-600">AI/ML Workshop - Dec 15</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-3">
                Join us for an intensive workshop on Machine Learning fundamentals.
              </p>
              <Link 
                to="/events" 
                className="text-purple-600 text-sm hover:text-purple-700"
              >
                Register Now →
              </Link>
            </div>

            {/* Recent Discussion */}
            <div className="bg-white rounded-lg shadow-md p-6 recent-card-hover">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-comments text-yellow-600"></i>
                </div>
                <div className="ml-3">
                  <h4 className="font-semibold text-gray-800">New Discussion</h4>
                  <p className="text-sm text-gray-600">Career Transition Tips</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-3">
                Share your experience transitioning from software to product management.
              </p>
              <Link 
                to="/community" 
                className="text-purple-600 text-sm hover:text-purple-700"
              >
                Join Discussion →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Connected</h2>
          <p className="text-xl mb-8">
            Subscribe to our newsletter for the latest updates, job opportunities, and events.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button 
              onClick={() => alert('Thank you for subscribing to our newsletter!')}
              className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* AI Chatbot */}
      <Chatbot />
    </>
  )
}

export default Home
