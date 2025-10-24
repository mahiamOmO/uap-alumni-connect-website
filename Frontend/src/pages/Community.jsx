import React, { useState } from 'react'

const Community = () => {
  const [activeTab, setActiveTab] = useState('discussions')

  const discussions = [
    {
      id: 1,
      title: "Career Transition Tips",
      author: "John Doe (2018)",
      replies: 12,
      views: 156,
      lastActivity: "2 hours ago",
      category: "Career"
    },
    {
      id: 2,
      title: "Best Programming Languages for 2024",
      author: "Jane Smith (2019)",
      replies: 8,
      views: 89,
      lastActivity: "5 hours ago",
      category: "Technology"
    },
    {
      id: 3,
      title: "Alumni Success Stories",
      author: "Ahmed Hassan (2020)",
      replies: 15,
      views: 234,
      lastActivity: "1 day ago",
      category: "General"
    }
  ]

  const categories = ["All", "Career", "Technology", "General", "Study", "Events"]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Community Forum</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect with fellow alumni, share experiences, ask questions, and engage in meaningful discussions.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-4">
              {categories.map(category => (
                <button
                  key={category}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    activeTab === category.toLowerCase() 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  onClick={() => setActiveTab(category.toLowerCase())}
                >
                  {category}
                </button>
              ))}
            </div>
            <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">
              <i className="fas fa-plus mr-2"></i>
              Start Discussion
            </button>
          </div>

          <div className="space-y-4">
            {discussions.map(discussion => (
              <div key={discussion.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{discussion.title}</h3>
                    <div className="flex items-center text-sm text-gray-500 space-x-4">
                      <span>By {discussion.author}</span>
                      <span>{discussion.replies} replies</span>
                      <span>{discussion.views} views</span>
                      <span>Last activity {discussion.lastActivity}</span>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full">
                    {discussion.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Community
