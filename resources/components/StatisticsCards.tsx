import React, { useState, useEffect } from 'react';
import { UsersIcon, CalendarIcon, BedIcon, FileTextIcon } from 'lucide-react';
import axios from 'axios';

const StatisticsCards = () => {
  const [todaysVisits, setTodaysVisits] = useState(0);
  const [totalPatients, setTotalPatients] = useState(0);
  const [admittedPatients, setAdmittedPatients] = useState({ value: 0, change: '0', changeType: 'increase' });
  const [pendingReports, setPendingReports] = useState({ value: 0, change: '0', changeType: 'increase' });
  const [loading, setLoading] = useState(true);
  const [loadingAdmitted, setLoadingAdmitted] = useState(true);
  const [loadingReports, setLoadingReports] = useState(true);
  const [pendingMedicalOrders, setPendingMedicalOrders] = useState<number | null>(null);

  useEffect(() => {
    fetchTodaysVisits();
    fetchAdmittedPatientsStats();
    fetchPendingReportsStats();
    fetchPendingMedicalOrders();
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

  const fetchAdmittedPatientsStats = async () => {
    setLoadingAdmitted(true);
    try {
      const response = await axios.get('/api/ward-admissions/statistics');
      setAdmittedPatients({
        value: response.data.totalAdmittedPatients,
        change: response.data.change,
        changeType: response.data.changeType
      });
    } catch (error) {
      console.error('Error fetching admitted patients stats:', error);
    } finally {
      setLoadingAdmitted(false);
    }
  };

  const fetchPendingReportsStats = async () => {
    setLoadingReports(true);
    try {
      const response = await axios.get('/api/patient-reports/statistics');
      setPendingReports({
        value: response.data.totalReports,
        change: response.data.change,
        changeType: response.data.changeType
      });
    } catch (error) {
      console.error('Error fetching pending reports stats:', error);
    } finally {
      setLoadingReports(false);
    }
  };

  const fetchPendingMedicalOrders = async () => {
    try {
      const response = await axios.get('/medical-orders/pending-reports-count');
      setPendingMedicalOrders(response.data.pending_reports_count);
    } catch (error) {
      console.error('Error fetching pending medical orders:', error);
    }
  };

  const stats = [{
    name: 'Total Patients',
    value: loading ? '...' : totalPatients.toString(),
    change: '+12%',
    icon: UsersIcon,
    changeType: 'increase',
    subtitle: 'All',
    onClick: () => window.open('/patient-details', '_blank')
  }, {
    name: "Today's Visits",
    value: loading ? '...' : todaysVisits.toString(),
    change: '+5',
    icon: CalendarIcon,
    changeType: 'increase',
    subtitle: 'All',
    onClick: () => window.open('/todays-visits', '_blank')
  }, {
    name: 'Patient Admitted Count',
    value: loadingAdmitted ? '...' : admittedPatients.value.toString(),
    change: loadingAdmitted ? '...' : admittedPatients.change,
    icon: BedIcon,
    changeType: admittedPatients.changeType,
    subtitle: 'All'
  }, {
    name: 'Pending Reports',
    value: pendingMedicalOrders === null ? '...' : pendingMedicalOrders.toString(),
    change: loadingReports ? '...' : pendingReports.change,
    icon: FileTextIcon,
    changeType: pendingReports.changeType,
    subtitle: 'All'
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