import React, { useState } from 'react'


const JobOpportunities = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterLocation, setFilterLocation] = useState('')
  const [filterType, setFilterType] = useState('')


  const jobs = [
    {
    id: 1,
    title: "Software Engineer",
    company: "TechWave IT Solutions",
    location: "Sirajganj Sadar, Sirajganj",
    type: "Full-time",
    postedBy: "Kamrul Hasan (2024)",
    postedDate: "2024-12-10",
    description: "We are seeking a passionate Software Engineer to build and maintain web-based applications for local businesses.",
    requirements: ["2+ years experience", "Proficient in PHP/Laravel", "Basic knowledge of MySQL", "Bachelor's in CSE/IT"],
    salary: "৳45,000 - ৳60,000",
    remote: false
    },
    {
    id: 2,
    title: "Frontend Developer",
    company: "Creative Pixel Lab",
    location: "Belkuchi, Sirajganj",
    type: "Full-time",
    postedBy: "Nafis Rahman (2023)",
    postedDate: "2024-12-22",
    description: "Looking for a talented frontend developer skilled in React.js and TailwindCSS to design user-friendly interfaces.",
    requirements: ["1+ year experience", "React.js, HTML, CSS, JS", "UI/UX knowledge preferred"],
    salary: "৳35,000 - ৳50,000",
    remote: true
    },
    {
    id: 4,
    title: "Data Entry Operator",
    company: "AgroWave Global Ltd.",
    location: "Sirajganj Sadar, Sirajganj",
    type: "Part-time",
    postedBy: "Kamrun Nahar (2024)",
    postedDate: "2024-12-01",
    description: "We are looking for a data entry operator to manage product export records (Mud Eel, Crab, Shrimp).",
    requirements: ["Typing speed 30+ WPM", "Basic Excel/Google Sheets", "Attention to detail"],
    salary: "৳12,000 - ৳18,000",
    remote: true
    },
    {
    id: 4,
    title: "Full Stack Web Developer",
    company: "BD SoftTech Ltd.",
    location: "Uttara, Dhaka",
    type: "Full-time",
    postedBy: "Shakil Ahmed (2024)",
    postedDate: "2024-12-20",
    description: "We are hiring a Full Stack Developer to work with Node.js, React, and MongoDB for enterprise web apps.",
    requirements: ["3+ years experience", "React, Node.js, MongoDB", "REST API knowledge", "Bachelor's in CSE"],
    salary: "৳70,000 - ৳90,000",
    remote: false
    },
      {
    id: 5,
    title: "Backend Engineer (Python)",
    company: "CloudBridge Technologies",
    location: "Banani, Dhaka",
    type: "Full-time",
    postedBy: "Imran Hossain (2023)",
    postedDate: "2024-12-28",
    description: "Looking for a backend engineer with strong experience in Python and Django to maintain scalable APIs.",
    requirements: ["Django/Flask", "PostgreSQL", "RESTful API design", "3+ years experience"],
    salary: "৳80,000 - ৳100,000",
    remote: true
  },
  {
    id: 6,
    title: "Junior Software Engineer",
    company: "Inspire IT Solutions",
    location: "Dhanmondi, Dhaka",
    type: "Full-time",
    postedBy: "Farzana Rahman (2022)",
    postedDate: "2024-11-15",
    description: "Entry-level opportunity for computer science graduates to learn full-stack development.",
    requirements: ["Basic HTML/CSS/JS", "React knowledge is a plus", "Bachelor’s in CSE/IT"],
    salary: "৳25,000 - ৳35,000",
    remote: false
  },
  {
    id: 7,
    title: "Data Analyst",
    company: "Smart Insight BD",
    location: "Mirpur DOHS, Dhaka",
    type: "Full-time",
    postedBy: "Mahfuz Hasan (2021)",
    postedDate: "2024-12-10",
    description: "Analyze business data and create insights using Excel, SQL, and Power BI dashboards.",
    requirements: ["Excel, SQL, Power BI", "Analytical mindset", "1+ year experience"],
    salary: "৳45,000 - ৳60,000",
    remote: true
  },
  {
    id: 8,
    title: "Digital Marketing Executive",
    company: "BrandOrbit Bangladesh",
    location: "Badda, Dhaka",
    type: "Full-time",
    postedBy: "Tanvir Ahsan (2023)",
    postedDate: "2024-12-01",
    description: "We are seeking a digital marketer with experience in running Facebook and Google Ads campaigns.",
    requirements: ["Facebook/Google Ads", "SEO, SMM", "Bachelor’s in Marketing/Business"],
    salary: "৳30,000 - ৳50,000",
    remote: false
  },
  {
    id: 9,
    title: "UI/UX Designer",
    company: "DesignHub Studio",
    location: "Gulshan, Dhaka",
    type: "Full-time",
    postedBy: "Rumana Ahmed (2024)",
    postedDate: "2024-11-25",
    description: "Join our creative team to design clean, user-centered web and mobile app interfaces.",
    requirements: ["Figma/Adobe XD", "UX research", "Portfolio required"],
    salary: "৳50,000 - ৳70,000",
    remote: true
  },
  {
    id: 10,
    title: "System Administrator",
    company: "TechServe BD",
    location: "Motijheel, Dhaka",
    type: "Full-time",
    postedBy: "Asif Mahmud (2022)",
    postedDate: "2024-11-28",
    description: "Manage and maintain local servers, LAN/WAN connectivity, and system security.",
    requirements: ["Linux/Windows Server", "Network troubleshooting", "2+ years experience"],
    salary: "৳40,000 - ৳55,000",
    remote: false
  },
  {
    id: 11,
    title: "Content Writer (Bangla & English)",
    company: "EduVibe Academy",
    location: "Mohakhali, Dhaka",
    type: "Part-time",
    postedBy: "Tasnim Alam (2024)",
    postedDate: "2024-12-15",
    description: "Create educational blogs, articles, and course summaries in both Bangla and English.",
    requirements: ["Excellent writing skills", "SEO knowledge", "Bachelor’s in English/Journalism"],
    salary: "৳20,000 - ৳30,000",
    remote: true
  },
  {
    id: 12,
    title: "Mobile App Developer (React Native)",
    company: "Appify Bangladesh",
    location: "Dhanmondi, Dhaka",
    type: "Full-time",
    postedBy: "Rakibul Islam (2023)",
    postedDate: "2024-12-22",
    description: "Develop and maintain cross-platform mobile applications using React Native and Firebase.",
    requirements: ["React Native", "Firebase, REST API", "2+ years experience"],
    salary: "৳60,000 - ৳80,000",
    remote: true
  },
  ]

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLocation = !filterLocation || job.location.toLowerCase().includes(filterLocation.toLowerCase())
    const matchesType = !filterType || job.type === filterType
    
    return matchesSearch && matchesLocation && matchesType
  })

  const uniqueLocations = [...new Set(jobs.map(job => job.location))]
  const uniqueTypes = [...new Set(jobs.map(job => job.type))]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Job Opportunities</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover exciting career opportunities posted by our alumni network. Find your next role or post opportunities for fellow alumni.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Jobs</label>
              <input
                type="text"
                placeholder="Search by title, company, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <select
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">All Locations</option>
                {uniqueLocations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">All Types</option>
                {uniqueTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Post Job Button */}
        <div className="mb-6 flex justify-between items-center">
          <p className="text-gray-600">
            Showing {filteredJobs.length} of {jobs.length} job opportunities
          </p>
          <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">
            <i className="fas fa-plus mr-2"></i>
            Post a Job
          </button>
        </div>

        {/* Jobs List */}
        <div className="space-y-6">
          {filteredJobs.map(job => (
            <div key={job.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-800 mb-2">{job.title}</h3>
                  <p className="text-xl text-gray-600 mb-1">{job.company}</p>
                  <div className="flex items-center text-gray-500 text-sm">
                    <i className="fas fa-map-marker-alt mr-2"></i>
                    {job.location}
                    {job.remote && (
                      <span className="ml-4 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                        Remote
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-green-600">{job.salary}</p>
                  <p className="text-sm text-gray-500">{job.type}</p>
                </div>
              </div>

              <p className="text-gray-600 mb-4">{job.description}</p>

              <div className="mb-4">
                <h4 className="font-semibold text-gray-700 mb-2">Requirements:</h4>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  {job.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-500">
                  <p>Posted by {job.postedBy}</p>
                  <p>Posted on {new Date(job.postedDate).toLocaleDateString()}</p>
                </div>
                <div className="flex space-x-3">
                  <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors">
                    <i className="fas fa-bookmark mr-2"></i>
                    Save
                  </button>
                  <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                    Apply Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <i className="fas fa-briefcase text-6xl text-gray-300 mb-4"></i>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No jobs found</h3>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default JobOpportunities
