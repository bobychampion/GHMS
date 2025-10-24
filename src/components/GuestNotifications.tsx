'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Mail, MessageSquare, Clock, CheckCircle, AlertCircle, Send } from 'lucide-react';

interface NotificationTemplate {
  id: string;
  name: string;
  type: 'checkin' | 'checkout' | 'payment' | 'reminder';
  subject: string;
  message: string;
  timing: 'immediate' | '1hour' | '24hours' | 'custom';
}

interface GuestNotification {
  id: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  bookingReference: string;
  roomType: string;
  checkInDate: string;
  checkOutDate: string;
  notificationType: string;
  status: 'sent' | 'pending' | 'failed';
  sentAt?: string;
  message: string;
}

export default function GuestNotifications() {
  const [notifications, setNotifications] = useState<GuestNotification[]>([]);
  const [templates, setTemplates] = useState<NotificationTemplate[]>([
    {
      id: '1',
      name: 'Check-in Reminder',
      type: 'checkin',
      subject: 'Welcome to Godatin Hotel - Check-in Reminder',
      message: 'Dear {{guestName}}, your check-in is scheduled for {{checkInDate}} at Godatin Hotel. We look forward to welcoming you!',
      timing: '24hours'
    },
    {
      id: '2',
      name: 'Check-out Reminder',
      type: 'checkout',
      subject: 'Check-out Reminder - Godatin Hotel',
      message: 'Dear {{guestName}}, your check-out is scheduled for {{checkOutDate}}. Please ensure all belongings are collected.',
      timing: '1hour'
    },
    {
      id: '3',
      name: 'Payment Confirmation',
      type: 'payment',
      subject: 'Payment Confirmation - Booking {{bookingReference}}',
      message: 'Dear {{guestName}}, your payment for booking {{bookingReference}} has been confirmed. Thank you for choosing Godatin Hotel!',
      timing: 'immediate'
    }
  ]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [sendForm, setSendForm] = useState({
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    bookingRef: '',
    checkInDate: '',
    checkOutDate: '',
    amount: 0
  });
  const [notificationType, setNotificationType] = useState<'email' | 'sms'>('email');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications');
      const data = await response.json();
      if (data.success) {
        setNotifications(data.notifications);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const sendNotification = async (bookingId: string, templateId: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId,
          templateId
        })
      });
      
      const data = await response.json();
      if (data.success) {
        await fetchNotifications();
        alert('Notification sent successfully!');
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      alert('Failed to send notification');
    }
    setLoading(false);
  };

  const handleSendNotification = async () => {
    if (!selectedTemplate) {
      alert('Please select a template first');
      return;
    }
    
    if (notificationType === 'email' && !sendForm.guestEmail) {
      alert('Please fill in guest email');
      return;
    }
    
    if (notificationType === 'sms' && !sendForm.guestPhone) {
      alert('Please fill in guest phone number');
      return;
    }
    
    if (!sendForm.guestName) {
      alert('Please fill in guest name');
      return;
    }

    setLoading(true);
    try {
      const template = templates.find(t => t.id === selectedTemplate);
      if (!template) {
        alert('Template not found');
        return;
      }

      const endpoint = notificationType === 'email' ? '/api/notifications/send' : '/api/notifications/send-sms';
      const payload = {
        bookingId: sendForm.bookingRef || 'manual',
        templateId: selectedTemplate,
        guestName: sendForm.guestName,
        bookingRef: sendForm.bookingRef,
        checkInDate: sendForm.checkInDate,
        checkOutDate: sendForm.checkOutDate,
        amount: sendForm.amount,
        ...(notificationType === 'email' ? { guestEmail: sendForm.guestEmail } : { guestPhone: sendForm.guestPhone })
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      if (data.success) {
        alert(`${notificationType.toUpperCase()} notification sent successfully!`);
        setShowSendModal(false);
        setSendForm({
          guestName: '',
          guestEmail: '',
          guestPhone: '',
          bookingRef: '',
          checkInDate: '',
          checkOutDate: '',
          amount: 0
        });
        setSelectedTemplate('');
        await fetchNotifications();
      } else {
        alert(`Failed to send ${notificationType} notification: ` + data.message);
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      alert('Failed to send notification');
    }
    setLoading(false);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'checkin': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'checkout': return <Clock className="w-5 h-5 text-orange-600" />;
      case 'payment': return <CheckCircle className="w-5 h-5 text-blue-600" />;
      default: return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="flex justify-end">
        <button 
          onClick={() => setShowSendModal(true)}
          className="px-4 py-2 bg-gold-600 text-white rounded-lg hover:bg-gold-700 transition-colors"
        >
          <Send className="w-4 h-4 inline mr-2" />
          Send Notification
        </button>
      </div>

      {/* Notification Templates */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-royal-900 mb-4">Notification Templates</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {templates.map((template) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="border border-gray-200 rounded-lg p-4 hover:border-gold-300 transition-colors"
            >
              <div className="flex items-center space-x-3 mb-3">
                {getNotificationIcon(template.type)}
                <h4 className="font-semibold text-royal-900">{template.name}</h4>
              </div>
              <p className="text-sm text-gray-600 mb-2">{template.subject}</p>
              <p className="text-xs text-gray-500 mb-3 line-clamp-2">{template.message}</p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Timing: {template.timing}</span>
                <button
                  onClick={() => setSelectedTemplate(template.id)}
                  className="text-xs text-gold-600 hover:text-gold-700"
                >
                  Use Template
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Notifications */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-royal-900 mb-4">Recent Notifications</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Guest</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Booking</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Sent At</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {notifications.map((notification) => (
                <tr key={notification.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-royal-900">{notification.guestName}</p>
                      <p className="text-sm text-gray-600">{notification.guestEmail}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      {getNotificationIcon(notification.notificationType)}
                      <span className="text-sm text-gray-700 capitalize">{notification.notificationType}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{notification.bookingReference}</p>
                      <p className="text-xs text-gray-600">{notification.roomType}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(notification.status)}`}>
                      {notification.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-600">
                      {notification.sentAt ? formatDate(notification.sentAt) : 'Not sent'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-700 text-sm">
                        <Mail className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-700 text-sm">
                        <MessageSquare className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-royal-900 mb-4">Notification Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Email Notifications</h4>
            <div className="space-y-2">
              <label className="flex items-center">
                <input type="checkbox" defaultChecked className="mr-2" />
                <span className="text-sm text-gray-700">Check-in reminders</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" defaultChecked className="mr-2" />
                <span className="text-sm text-gray-700">Check-out reminders</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" defaultChecked className="mr-2" />
                <span className="text-sm text-gray-700">Payment confirmations</span>
              </label>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-3">SMS Notifications</h4>
            <div className="space-y-2">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-sm text-gray-700">Check-in reminders</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-sm text-gray-700">Check-out reminders</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-sm text-gray-700">Payment confirmations</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Send Notification Modal */}
      {showSendModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-royal-900 mb-4">
              Send {notificationType.toUpperCase()} Notification
            </h3>
            
            <div className="space-y-4">
              {/* Notification Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notification Type</label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="notificationType"
                      value="email"
                      checked={notificationType === 'email'}
                      onChange={(e) => setNotificationType(e.target.value as 'email' | 'sms')}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">📧 Email</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="notificationType"
                      value="sms"
                      checked={notificationType === 'sms'}
                      onChange={(e) => setNotificationType(e.target.value as 'email' | 'sms')}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">📱 SMS</span>
                  </label>
                </div>
              </div>

              {/* Template Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Template</label>
                <select
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
                >
                  <option value="">Choose a template...</option>
                  {templates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Guest Information */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Guest Name</label>
                <input
                  type="text"
                  value={sendForm.guestName}
                  onChange={(e) => setSendForm({...sendForm, guestName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
                  placeholder="Enter guest name"
                />
              </div>

              {notificationType === 'email' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Guest Email</label>
                  <input
                    type="email"
                    value={sendForm.guestEmail}
                    onChange={(e) => setSendForm({...sendForm, guestEmail: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
                    placeholder="Enter guest email"
                  />
                </div>
              )}

              {notificationType === 'sms' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Guest Phone Number</label>
                  <input
                    type="tel"
                    value={sendForm.guestPhone}
                    onChange={(e) => setSendForm({...sendForm, guestPhone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
                    placeholder="Enter phone number (e.g., 08012345678)"
                  />
                  <p className="text-xs text-gray-500 mt-1">Include country code or start with 0</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Booking Reference</label>
                <input
                  type="text"
                  value={sendForm.bookingRef}
                  onChange={(e) => setSendForm({...sendForm, bookingRef: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
                  placeholder="Enter booking reference"
                />
              </div>

              {/* Conditional fields based on template */}
              {selectedTemplate === '1' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Check-in Date</label>
                  <input
                    type="date"
                    value={sendForm.checkInDate}
                    onChange={(e) => setSendForm({...sendForm, checkInDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
                  />
                </div>
              )}

              {selectedTemplate === '2' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Check-out Date</label>
                  <input
                    type="date"
                    value={sendForm.checkOutDate}
                    onChange={(e) => setSendForm({...sendForm, checkOutDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
                  />
                </div>
              )}

              {selectedTemplate === '3' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount Paid</label>
                  <input
                    type="number"
                    value={sendForm.amount}
                    onChange={(e) => setSendForm({...sendForm, amount: Number(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
                    placeholder="Enter amount"
                  />
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowSendModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSendNotification}
                disabled={loading}
                className="px-4 py-2 bg-gold-600 text-white rounded-lg hover:bg-gold-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Sending...' : `Send ${notificationType.toUpperCase()}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
