import React, { useState } from 'react'

const Resources = () => {
  const [activeCategory, setActiveCategory] = useState('all')

  const resources = [
     {
    id: 1,
    title: "Data Structures and Algorithms Guide",
    category: "Study Materials",
    type: "PDF",
    size: "2.5 MB",
    uploadedBy: "Dr. Sarah Ahmed",
    uploadDate: "2024-01-10",
    downloads: 156,
    description: "Comprehensive guide covering all major data structures and algorithms with examples and practice problems."
  },
  {
    id: 2,
    title: "Introduction to Python Programming",
    category: "Study Materials",
    type: "PDF",
    size: "3 MB",
    uploadedBy: "Mr. Kamrul Hasan",
    uploadDate: "2024-03-05",
    downloads: 200,
    description: "Beginner-friendly PDF covering basics of Python programming with examples."
  },
  {
    id: 3,
    title: "React.js Crash Course",
    category: "Video Tutorials",
    type: "MP4",
    size: "250 MB",
    uploadedBy: "Ms. Farzana Rahman",
    uploadDate: "2024-06-12",
    downloads: 180,
    description: "Step-by-step React.js tutorial for building modern web applications."
  },
  {
    id: 4,
    title: "Linux Command Line Basics",
    category: "Study Materials",
    type: "PDF",
    size: "1.8 MB",
    uploadedBy: "Dr. Imran Hossain",
    uploadDate: "2024-02-20",
    downloads: 120,
    description: "Essential Linux commands and shell scripting tips for beginners."
  },
  {
    id: 5,
    title: "Git & GitHub Complete Guide",
    category: "Video Tutorials",
    type: "MP4",
    size: "300 MB",
    uploadedBy: "Mr. Rakibul Islam",
    uploadDate: "2024-04-15",
    downloads: 220,
    description: "Comprehensive tutorial on Git version control and GitHub workflows."
  },
  {
    id: 6,
    title: "Database Management with MySQL",
    category: "Study Materials",
    type: "PDF",
    size: "4 MB",
    uploadedBy: "Ms. Sadia Akter",
    uploadDate: "2024-05-22",
    downloads: 145,
    description: "Covers MySQL basics, queries, joins, and database design principles."
  },
  {
    id: 7,
    title: "VS Code Productivity Tools",
    category: "Tools & Software",
    type: "ZIP",
    size: "15 MB",
    uploadedBy: "Mr. Shahriar Khan",
    uploadDate: "2024-07-10",
    downloads: 90,
    description: "Collection of VS Code extensions and snippets to boost coding productivity."
  }
  ]

  const categories = ["All", "Study Materials", "Industry Reports", "Career Resources", "Software Tools"]

  const filteredResources = resources.filter(resource => 
    activeCategory === 'all' || resource.category === activeCategory
  )

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Resource Library</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Access and share academic resources, study materials, industry insights, and career development tools.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-4">
              {categories.map(category => (
                <button
                  key={category}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    activeCategory === category.toLowerCase().replace(' ', '-') 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  onClick={() => setActiveCategory(category === 'All' ? 'all' : category.toLowerCase().replace(' ', '-'))}
                >
                  {category}
                </button>
              ))}
            </div>
            <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">
              <i className="fas fa-upload mr-2"></i>
              Upload Resource
            </button>
          </div>

          <div className="space-y-4">
            {filteredResources.map(resource => (
              <div key={resource.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <i className={`fas ${
                        resource.type === 'PDF' ? 'fa-file-pdf' :
                        resource.type === 'Video' ? 'fa-video' :
                        resource.type === 'ZIP' ? 'fa-file-archive' : 'fa-file'
                      } text-purple-600`}></i>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">{resource.title}</h3>
                      <p className="text-gray-600 mb-3">{resource.description}</p>
                      <div className="flex items-center text-sm text-gray-500 space-x-4">
                        <span>By {resource.uploadedBy}</span>
                        <span>{resource.type} • {resource.size}</span>
                        <span>{resource.downloads} downloads</span>
                        <span>Uploaded {new Date(resource.uploadDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full">
                      {resource.category}
                    </span>
                    <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                      <i className="fas fa-download mr-2"></i>
                      Download
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Resources
