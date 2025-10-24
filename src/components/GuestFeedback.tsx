'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, MessageSquare, ThumbsUp, ThumbsDown, Filter, Search, Eye, Reply } from 'lucide-react';

interface GuestFeedback {
  id: string;
  guestName: string;
  guestEmail: string;
  bookingReference: string;
  roomType: string;
  checkInDate: string;
  checkOutDate: string;
  overallRating: number;
  cleanlinessRating: number;
  serviceRating: number;
  amenitiesRating: number;
  valueRating: number;
  comments: string;
  status: 'pending' | 'reviewed' | 'responded';
  submittedAt: string;
  response?: string;
  respondedAt?: string;
  tags: string[];
}

export default function GuestFeedback() {
  const [feedbacks, setFeedbacks] = useState<GuestFeedback[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'reviewed' | 'responded'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFeedback, setSelectedFeedback] = useState<GuestFeedback | null>(null);
  const [responseText, setResponseText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const response = await fetch('/api/feedback');
      const data = await response.json();
      if (data.success) {
        setFeedbacks(data.feedbacks);
      }
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    }
  };

  const handleResponse = async (feedbackId: string) => {
    if (!responseText.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/feedback/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feedbackId,
          response: responseText
        })
      });
      
      const data = await response.json();
      if (data.success) {
        await fetchFeedbacks();
        setResponseText('');
        setSelectedFeedback(null);
        alert('Response sent successfully!');
      }
    } catch (error) {
      console.error('Error sending response:', error);
      alert('Failed to send response');
    }
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      case 'responded': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const getOverallRatingColor = (rating: number) => {
    if (rating >= 4) return 'text-green-600';
    if (rating >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredFeedbacks = feedbacks.filter(feedback => {
    const matchesFilter = filter === 'all' || feedback.status === filter;
    const matchesSearch = feedback.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feedback.bookingReference.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feedback.comments.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const averageRating = feedbacks.length > 0 
    ? feedbacks.reduce((sum, f) => sum + f.overallRating, 0) / feedbacks.length 
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-royal-900 font-serif">Guest Feedback</h2>
          <p className="text-gray-600 mt-1">Manage guest reviews and feedback</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-yellow-400 fill-current" />
            <span className="text-lg font-semibold text-royal-900">
              {averageRating.toFixed(1)} / 5.0
            </span>
          </div>
          <span className="text-sm text-gray-600">({feedbacks.length} reviews)</span>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Reviews</p>
              <p className="text-2xl font-bold text-royal-900">{feedbacks.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <MessageSquare className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Review</p>
              <p className="text-2xl font-bold text-yellow-600">
                {feedbacks.filter(f => f.status === 'pending').length}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Filter className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Responded</p>
              <p className="text-2xl font-bold text-green-600">
                {feedbacks.filter(f => f.status === 'responded').length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Reply className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Rating</p>
              <p className="text-2xl font-bold text-royal-900">{averageRating.toFixed(1)}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search feedback..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'all' ? 'bg-gold-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'pending' ? 'bg-gold-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter('reviewed')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'reviewed' ? 'bg-gold-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Reviewed
            </button>
            <button
              onClick={() => setFilter('responded')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'responded' ? 'bg-gold-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Responded
            </button>
          </div>
        </div>

        {/* Feedback List */}
        <div className="space-y-4">
          {filteredFeedbacks.map((feedback, index) => (
            <motion.div
              key={feedback.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div>
                    <h3 className="font-semibold text-royal-900">{feedback.guestName}</h3>
                    <p className="text-sm text-gray-600">{feedback.bookingReference}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    {renderStars(feedback.overallRating)}
                    <span className={`ml-2 font-semibold ${getOverallRatingColor(feedback.overallRating)}`}>
                      {feedback.overallRating}/5
                    </span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(feedback.status)}`}>
                    {feedback.status.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-xs text-gray-600">Cleanliness</p>
                  <div className="flex justify-center space-x-1">
                    {renderStars(feedback.cleanlinessRating)}
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-600">Service</p>
                  <div className="flex justify-center space-x-1">
                    {renderStars(feedback.serviceRating)}
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-600">Amenities</p>
                  <div className="flex justify-center space-x-1">
                    {renderStars(feedback.amenitiesRating)}
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-600">Value</p>
                  <div className="flex justify-center space-x-1">
                    {renderStars(feedback.valueRating)}
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-600">Overall</p>
                  <div className="flex justify-center space-x-1">
                    {renderStars(feedback.overallRating)}
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Comments:</p>
                <p className="text-royal-900 bg-gray-50 p-3 rounded-lg">{feedback.comments}</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Submitted: {formatDate(feedback.submittedAt)}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedFeedback(feedback)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  {feedback.status !== 'responded' && (
                    <button
                      onClick={() => setSelectedFeedback(feedback)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    >
                      <Reply className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredFeedbacks.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No feedback found</p>
          </div>
        )}
      </div>

      {/* Response Modal */}
      {selectedFeedback && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4">
            <h3 className="text-lg font-semibold text-royal-900 mb-4">
              Respond to {selectedFeedback.guestName}
            </h3>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Original Feedback:</p>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  {renderStars(selectedFeedback.overallRating)}
                  <span className="text-sm text-gray-600">
                    {selectedFeedback.overallRating}/5 stars
                  </span>
                </div>
                <p className="text-sm text-gray-800">{selectedFeedback.comments}</p>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Response:
              </label>
              <textarea
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                placeholder="Thank you for your feedback..."
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setSelectedFeedback(null);
                  setResponseText('');
                }}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleResponse(selectedFeedback.id)}
                disabled={loading || !responseText.trim()}
                className="px-4 py-2 bg-gold-600 text-white rounded-lg hover:bg-gold-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Response'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
