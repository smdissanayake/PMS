import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Surgery {
  id: string;
  patientName: string;
  refNo: string;
  uhid: string;
  surgeryName: string;
  date: string;
  time: string;
}

interface SurgeryCalendarViewProps {
  view: 'month' | 'week';
  surgeries: Surgery[];
  onDateSelect: (date: string) => void;
  selectedDate: string;
}

const SurgeryCalendarView: React.FC<SurgeryCalendarViewProps> = ({ view, surgeries, onDateSelect, selectedDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const today = new Date().toISOString().split('T')[0];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getSurgeriesForDate = (date: string) => {
    return surgeries.filter(surgery => surgery.date === date);
  };

  const renderMonthView = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDayOfMonth = getFirstDayOfMonth(currentDate);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 border border-gray-100"></div>);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dateString = formatDate(date);
      const daySurgeries = getSurgeriesForDate(dateString);
      const isToday = dateString === today;
      const isSelected = dateString === selectedDate;

      days.push(
        <div
          key={day}
          onClick={() => onDateSelect(dateString)}
          className={`h-24 border border-gray-100 p-2 cursor-pointer transition-colors ${
            isToday ? 'bg-blue-50' : ''
          } ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
        >
          <div className="font-medium text-sm mb-1">{day}</div>
          {daySurgeries.length > 0 && (
            <div className="text-xs p-1 bg-blue-100 text-blue-800 rounded text-center">
              {daySurgeries.length} {daySurgeries.length === 1 ? 'Surgery' : 'Surgeries'}
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-7 gap-px bg-gray-100">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="bg-white p-2 text-center font-medium text-sm text-gray-500">
            {day}
          </div>
        ))}
        {days}
      </div>
    );
  };

  const renderWeekView = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      const dateString = formatDate(date);
      const daySurgeries = getSurgeriesForDate(dateString);
      const isToday = dateString === today;
      const isSelected = dateString === selectedDate;

      days.push(
        <div
          key={i}
          onClick={() => onDateSelect(dateString)}
          className={`border border-gray-100 p-4 cursor-pointer transition-colors ${
            isToday ? 'bg-blue-50' : ''
          } ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
        >
          <div className="font-medium mb-2">
            {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </div>
          {daySurgeries.length > 0 && (
            <div className="p-2 bg-blue-100 text-blue-800 rounded text-center">
              {daySurgeries.length} {daySurgeries.length === 1 ? 'Surgery' : 'Surgeries'}
            </div>
          )}
        </div>
      );
    }

    return <div className="grid grid-cols-7 gap-px bg-gray-100">{days}</div>;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const newDate = new Date(currentDate);
              newDate.setMonth(currentDate.getMonth() - 1);
              setCurrentDate(newDate);
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-lg font-semibold">
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h2>
          <button
            onClick={() => {
              const newDate = new Date(currentDate);
              newDate.setMonth(currentDate.getMonth() + 1);
              setCurrentDate(newDate);
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      {view === 'month' ? renderMonthView() : renderWeekView()}
    </div>
  );
};

export default SurgeryCalendarView;