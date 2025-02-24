import { useState } from 'react';
import { supabase } from '../lib/supabase';

const categories = [
  'All',
  'Guides',
  'Templates',
  'Case Studies',
  'Webinars',
  'FAQs'
];

const resources = [
  {
    id: 1,
    title: 'EE Reporting Guide 2024',
    description: 'A comprehensive guide to understanding and completing Employment Equity reports',
    category: 'Guides',
    downloadUrl: '/downloads/ee-guide-2024.pdf',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    )
  },
  {
    id: 2,
    title: 'Workforce Demographics Template',
    description: 'Excel template for tracking and analyzing workforce demographics',
    category: 'Templates',
    downloadUrl: '/downloads/demographics-template.xlsx',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )
  },
  {
    id: 3,
    title: 'Success Story: XYZ Corporation',
    description: 'How XYZ Corp achieved their Employment Equity goals through effective planning and implementation',
    category: 'Case Studies',
    downloadUrl: '/downloads/xyz-case-study.pdf',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H14" />
      </svg>
    )
  },
  {
    id: 4,
    title: 'EE Data Management Webinar',
    description: 'Learn effective strategies for managing and reporting Employment Equity data',
    category: 'Webinars',
    downloadUrl: '/downloads/ee-webinar.mp4',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    )
  }
];

export default function Resources() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [email, setEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [downloadStatus, setDownloadStatus] = useState<{ [key: number]: 'idle' | 'loading' | 'success' | 'error' }>({});

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribeStatus('loading');

    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email, subscribed_at: new Date().toISOString() }]);

      if (error) throw error;
      setSubscribeStatus('success');
      setEmail('');
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      setSubscribeStatus('error');
    }
  };

  const handleDownload = async (resource: typeof resources[0]) => {
    setDownloadStatus(prev => ({ ...prev, [resource.id]: 'loading' }));
    
    try {
      const { data, error } = await supabase
        .storage
        .from('resources')
        .download(resource.downloadUrl);
        
      if (error) throw error;
      
      // Create download link
      const url = window.URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', resource.title);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      setDownloadStatus(prev => ({ ...prev, [resource.id]: 'success' }));
    } catch (error) {
      console.error('Error downloading resource:', error);
      setDownloadStatus(prev => ({ ...prev, [resource.id]: 'error' }));
    }
  };

  const filteredResources = resources.filter((resource) => {
    const matchesCategory = selectedCategory === 'All' || resource.category === selectedCategory;
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
          Resources
        </h1>
        <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
          Access our comprehensive collection of guides, tools, and resources to support your Employment Equity compliance journey.
        </p>
      </div>

      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  selectedCategory === category
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="w-full sm:w-64">
            <input
              type="text"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredResources.map((resource) => (
          <div
            key={resource.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div className="p-6">
              <div className="text-indigo-600 mb-4">
                {resource.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{resource.title}</h3>
              <p className="text-gray-600 mb-4">{resource.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-indigo-600">{resource.category}</span>
                <button
                  onClick={() => handleDownload(resource)}
                  disabled={downloadStatus[resource.id] === 'loading'}
                  className="inline-flex items-center text-indigo-600 hover:text-indigo-700 disabled:opacity-50"
                >
                  <span className="mr-2">
                    {downloadStatus[resource.id] === 'loading'
                      ? 'Downloading...'
                      : downloadStatus[resource.id] === 'success'
                      ? 'Downloaded'
                      : 'Download'}
                  </span>
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                </button>
              </div>
              {downloadStatus[resource.id] === 'error' && (
                <p className="text-red-500 text-sm mt-2">
                  Failed to download. Please try again.
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 bg-gray-50 rounded-lg p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Help?</h2>
          <p className="text-gray-600 mb-8">
            Our team of Employment Equity specialists is here to help you navigate compliance requirements.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Contact Us
          </a>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 mt-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Stay Updated
          </h2>
          <p className="text-white opacity-90 mb-6">
            Subscribe to our newsletter to receive the latest compliance updates and resources
          </p>
          {subscribeStatus === 'success' ? (
            <div className="bg-white bg-opacity-10 rounded-lg p-4">
              <p className="text-white">Thank you for subscribing! You'll receive updates soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <button
                type="submit"
                disabled={subscribeStatus === 'loading'}
                className="bg-white text-indigo-600 px-6 py-2 rounded-lg font-medium hover:bg-indigo-50 transition-colors disabled:opacity-50"
              >
                {subscribeStatus === 'loading' ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
          )}
          {subscribeStatus === 'error' && (
            <p className="text-red-200 mt-2">Failed to subscribe. Please try again later.</p>
          )}
        </div>
      </div>
    </div>
  );
} 