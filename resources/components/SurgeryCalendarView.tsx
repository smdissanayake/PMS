import React, { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
interface Surgery {
  id: string;
  patientName: string;
  surgeryName: string;
  date: string;
  time: string;
}
interface SurgeryCalendarViewProps {
  view: 'month' | 'week';
  surgeries: Surgery[];
}
const SurgeryCalendarView = ({
  view,
  surgeries
}: SurgeryCalendarViewProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    // Add previous month's days
    for (let i = 0; i < firstDay.getDay(); i++) {
      const prevDate = new Date(year, month, -i);
      days.unshift({
        date: prevDate,
        isCurrentMonth: false
      });
    }
    // Add current month's days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true
      });
    }
    // Add next month's days to complete the grid
    const remainingDays = 42 - days.length; // 6 rows * 7 days
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false
      });
    }
    return days;
  };
  const getSurgeriesForDate = (date: Date) => {
    return surgeries.filter(surgery => {
      const surgeryDate = new Date(surgery.date);
      return surgeryDate.getDate() === date.getDate() && surgeryDate.getMonth() === date.getMonth() && surgeryDate.getFullYear() === date.getFullYear();
    });
  };
  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + (direction === 'next' ? 1 : -1), 1));
  };
  const renderMonthView = () => <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
      {daysOfWeek.map(day => <div key={day} className="bg-gray-50 p-2 text-center text-sm font-medium text-gray-700">
          {day}
        </div>)}
      {getDaysInMonth(currentDate).map(({
      date,
      isCurrentMonth
    }, i) => {
      const daySurgeries = getSurgeriesForDate(date);
      return <div key={i} className={`bg-white min-h-[120px] p-2 transition-colors hover:bg-gray-50 ${!isCurrentMonth ? 'bg-gray-50' : ''}`}>
            <span className={`text-sm ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}`}>
              {date.getDate()}
            </span>
            <div className="mt-1 space-y-1">
              {daySurgeries.map(surgery => <div key={surgery.id} className="p-1.5 bg-blue-50 border border-blue-100 rounded text-xs text-blue-700">
                  {surgery.surgeryName} - {surgery.patientName}
                </div>)}
            </div>
          </div>;
    })}
    </div>;
  const renderWeekView = () => {
    const weekStart = new Date(currentDate);
    weekStart.setDate(currentDate.getDate() - currentDate.getDay());
    return <div className="space-y-2">
        {Array.from({
        length: 7
      }).map((_, i) => {
        const date = new Date(weekStart);
        date.setDate(weekStart.getDate() + i);
        const daySurgeries = getSurgeriesForDate(date);
        return <div key={i} className="flex items-center p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-32 text-sm font-medium text-gray-700">
                {daysOfWeek[i]} {date.getDate()}
              </div>
              <div className="flex-1 space-y-1">
                {daySurgeries.map(surgery => <div key={surgery.id} className="inline-flex items-center px-2.5 py-1 bg-blue-50 border border-blue-100 rounded text-xs text-blue-700">
                    {surgery.surgeryName} - {surgery.patientName} (
                    {surgery.time})
                  </div>)}
              </div>
            </div>;
      })}
      </div>;
  };
  return <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900">
          {currentDate.toLocaleString('default', {
          month: 'long',
          year: 'numeric'
        })}
        </h2>
        <div className="flex items-center gap-2">
          <button onClick={() => navigateMonth('prev')} className="p-1 rounded hover:bg-gray-100 text-gray-500">
            <ChevronLeftIcon size={20} />
          </button>
          <button onClick={() => navigateMonth('next')} className="p-1 rounded hover:bg-gray-100 text-gray-500">
            <ChevronRightIcon size={20} />
          </button>
        </div>
      </div>
      {view === 'month' ? renderMonthView() : renderWeekView()}
    </div>;
};
export default SurgeryCalendarView;