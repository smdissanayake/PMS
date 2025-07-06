import React, { useState, useEffect } from 'react';
import { UsersIcon, CalendarIcon, BedIcon, FileTextIcon } from 'lucide-react';
import axios from 'axios';

const StatisticsCards = () => {
  const [todaysVisits, setTodaysVisits] = useState(0);
  const [totalPatients, setTotalPatients] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodaysVisits();
  }, []);

  const fetchTodaysVisits = async () => {
    try {
      const response = await axios.get('/api/patient-notes/today');
      setTodaysVisits(response.data.visits.length);
      setTotalPatients(response.data.totalPatients);
    } catch (error) {
      console.error('Error fetching today\'s visits:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [{
    name: 'Total Patients',
    value: loading ? '...' : totalPatients.toString(),
    change: '+12%',
    icon: UsersIcon,
    changeType: 'increase',
    subtitle: 'from last month',
    onClick: () => window.open('/patient-details', '_blank')
  }, {
    name: "Today's Visits",
    value: loading ? '...' : todaysVisits.toString(),
    change: '+5',
    icon: CalendarIcon,
    changeType: 'increase',
    subtitle: 'from last month',
    onClick: () => window.open('/todays-visits', '_blank')
  }, {
    name: 'Admitted Patients',
    value: '156',
    change: '-2',
    icon: BedIcon,
    changeType: 'decrease',
    subtitle: 'from last month'
  }, {
    name: 'Pending Reports',
    value: '23',
    change: '+8',
    icon: FileTextIcon,
    changeType: 'increase',
    subtitle: 'from last month'
  }];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map(stat => (
        <div 
          key={stat.name} 
          className={`bg-white rounded-xl p-6 ${stat.onClick ? 'cursor-pointer hover:shadow-lg transition-shadow duration-200' : ''}`}
          onClick={stat.onClick}
        >
          <div className="flex items-center justify-between mb-4">
            <stat.icon size={24} className="text-[#4287f5]" />
            <span className={`text-sm font-medium ${stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
              {stat.change}
            </span>
          </div>
          <h3 className="text-3xl font-semibold text-gray-900 mb-2">
            {stat.value}
          </h3>
          <div className="space-y-1">
            <p className="text-sm text-gray-600">{stat.name}</p>
            <p className="text-xs text-gray-400">{stat.subtitle}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatisticsCards;