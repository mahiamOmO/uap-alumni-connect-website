import React, { useState } from 'react'

const Mentorship = () => {
  const [activeTab, setActiveTab] = useState('find-mentor')

  const mentors = [
 
  {
    id: 1,
    name: "Sadia Akter",
    company: "TechWave IT Solutions",
    position: "Frontend Developer",
    batch: "2020",
    expertise: ["React.js", "UI/UX", "Career Coaching"],
    availability: "Busy",
    rating: 4.7,
    mentees: 8
  },
  {
    id: 2,
    name: "Rafiqul Islam",
    company: "NextGen Apps BD",
    position: "Mobile App Developer",
    batch: "2017",
    expertise: ["Flutter", "Android/iOS Development", "Project Mentoring"],
    availability: "Available",
    rating: 4.9,
    mentees: 20
  },
  {
    id: 3,
    name: "Farzana Rahman",
    company: "Inspire IT Solutions",
    position: "Software Engineer",
    batch: "2016",
    expertise: ["Python/Django", "Data Structures", "Interview Prep"],
    availability: "Busy",
    rating: 4.6,
    mentees: 10
  }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Mentorship Program</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect with experienced alumni mentors or become a mentor yourself. Share knowledge, guide career paths, and build lasting relationships.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-center space-x-4 mb-8">
            <button
              className={`px-6 py-3 rounded-lg transition-colors ${
                activeTab === 'find-mentor' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              onClick={() => setActiveTab('find-mentor')}
            >
              Find a Mentor
            </button>
            <button
              className={`px-6 py-3 rounded-lg transition-colors ${
                activeTab === 'become-mentor' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              onClick={() => setActiveTab('become-mentor')}
            >
              Become a Mentor
            </button>
          </div>

          {activeTab === 'find-mentor' && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Available Mentors</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mentors.map(mentor => (
                  <div key={mentor.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                        {mentor.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="ml-4">
                        <h3 className="text-xl font-semibold text-gray-800">{mentor.name}</h3>
                        <p className="text-gray-600">{mentor.position} at {mentor.company}</p>
                        <p className="text-sm text-gray-500">Batch {mentor.batch}</p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-700 mb-2">Expertise</h4>
                      <div className="flex flex-wrap gap-2">
                        {mentor.expertise.map((skill, index) => (
                          <span key={index} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center">
                        <span className="text-yellow-500 mr-1">★</span>
                        <span className="text-gray-600">{mentor.rating}</span>
                        <span className="text-gray-500 ml-2">({mentor.mentees} mentees)</span>
                      </div>
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                        {mentor.availability}
                      </span>
                    </div>

                    <button className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors">
                      Request Mentorship
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'become-mentor' && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Become a Mentor</h2>
              <div className="max-w-2xl mx-auto">
                <p className="text-gray-600 mb-6">
                  Share your experience and help guide the next generation of UAP CSE graduates. 
                  As a mentor, you can make a significant impact on someone's career journey.
                </p>
                <button className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors">
                  Apply to Become a Mentor
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Mentorship
