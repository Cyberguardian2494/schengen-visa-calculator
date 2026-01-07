import { startOfYear, addDays, format, isSameMonth, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { calculateRollingDays, isVisaValidForDate } from '../utils/schengenMath';

const Timeline = ({ trips, visas }) => {
  const today = new Date();
  const yearStart = startOfYear(today);
  // Show a 12-month view starting from Jan 1st of current year
  const daysInYear = eachDayOfInterval({
    start: yearStart,
    end: addDays(yearStart, 365)
  });

  return (
    <div className="mt-8 bg-white p-6 rounded-xl shadow-lg overflow-x-auto">
      <h3 className="font-bold text-lg mb-4 text-gray-800">Yearly Overview ({today.getFullYear()})</h3>
      
      <div className="flex gap-1 min-w-[800px]">
        {/* Render columns for each Month */}
        {Array.from({ length: 12 }).map((_, monthIndex) => {
          const currentMonth = new Date(today.getFullYear(), monthIndex, 1);
          const daysInMonth = eachDayOfInterval({
            start: startOfMonth(currentMonth),
            end: endOfMonth(currentMonth)
          });

          return (
            <div key={monthIndex} className="flex-1 min-w-[60px]">
              <div className="text-xs font-bold text-center mb-2 text-gray-400">
                {format(currentMonth, 'MMM')}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {daysInMonth.map(day => {
                  // --- THE MAGIC: RUN LOGIC FOR EVERY PIXEL ---
                  const daysUsed = calculateRollingDays(day, trips);
                  const hasVisa = isVisaValidForDate(day, visas);
                  
                  // Check if this specific day is part of a trip
                  const isTripDay = trips.some(t => {
                    const start = new Date(t.start);
                    const end = new Date(t.end);
                    return day >= start && day <= end;
                  });

                  // Determine Color
                  let colorClass = "bg-gray-100"; // Default (Empty)
                  
                  if (isTripDay) {
                    if (daysUsed > 90 || !hasVisa) {
                      colorClass = "bg-red-500"; // ILLEGAL STAY
                    } else {
                      colorClass = "bg-blue-500"; // LEGAL STAY
                    }
                  } else {
                    // Not traveling, but warn if close to limit
                    if (daysUsed > 80) colorClass = "bg-orange-100"; 
                  }

                  return (
                    <div 
                      key={day.toISOString()}
                      className={`h-2 w-2 rounded-full ${colorClass}`}
                      title={`${format(day, 'MMM d')}: ${daysUsed}/90 days used`}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="flex gap-4 mt-4 text-xs text-gray-500 justify-center">
        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Trip</div>
        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div> Overstay/No Visa</div>
        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-orange-100"></div> High Usage Zone</div>
      </div>
    </div>
  );
};

export default Timeline;