// src/pages/Admin/DashboardHome.jsx
import React from 'react';
import { FiMail, FiUsers, FiBriefcase, FiFileText } from 'react-icons/fi';

const DashboardHome = ({ stats }) => {
  const statCards = [
    {
      title: 'Contact Submissions',
      value: stats.totalContacts || 0,
      pending: stats.pendingContacts || 0,
      icon: FiMail,
      color: 'bg-blue-500',
    },
    {
      title: 'Job Applications',
      value: stats.totalApplications || 0,
      pending: stats.pendingApplications || 0,
      icon: FiUsers,
      color: 'bg-green-500',
    },
    {
      title: 'Case Studies',
      value: stats.totalCaseStudies || 0,
      icon: FiFileText,
      color: 'bg-purple-500',
    },
    {
      title: 'Active Positions',
      value: stats.activePositions || 0,
      icon: FiBriefcase,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`${card.color} p-3 rounded-lg text-white`}>
                <card.icon size={24} />
              </div>
              {card.pending !== undefined && (
                <span className="text-sm text-yellow-600 bg-yellow-100 px-2 py-1 rounded">
                  {card.pending} pending
                </span>
              )}
            </div>
            <h3 className="text-2xl font-bold">{card.value}</h3>
            <p className="text-gray-600 mt-1">{card.title}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity Placeholder */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <p className="text-gray-500 text-center py-8">
            Activity feed will appear here as submissions come in.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;