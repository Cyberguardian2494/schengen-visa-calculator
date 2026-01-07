import { subDays, addDays, format, isWithinInterval, eachDayOfInterval, startOfDay, areIntervalsOverlapping, isValid } from 'date-fns';

export const calculateRollingDays = (checkDate, tripHistory) => {
  const windowEnd = startOfDay(new Date(checkDate));
  const windowStart = subDays(windowEnd, 179);
  let daysUsed = 0;

  tripHistory.forEach(trip => {
    const tripStart = startOfDay(new Date(trip.start));
    const tripEnd = startOfDay(new Date(trip.end));
    if (!isValid(tripStart) || !isValid(tripEnd)) return;

    if (areIntervalsOverlapping({ start: tripStart, end: tripEnd }, { start: windowStart, end: windowEnd })) {
      const overlapStart = tripStart < windowStart ? windowStart : tripStart;
      const overlapEnd = tripEnd > windowEnd ? windowEnd : tripEnd;
      daysUsed += eachDayOfInterval({ start: overlapStart, end: overlapEnd }).length;
    }
  });
  return daysUsed;
};

export const isVisaValidForDate = (checkDate, visaList) => {
  const target = startOfDay(new Date(checkDate));
  return visaList.some(visa => {
    const vStart = startOfDay(new Date(visa.start));
    const vEnd = startOfDay(new Date(visa.end));
    return isValid(vStart) && isValid(vEnd) && isWithinInterval(target, { start: vStart, end: vEnd });
  });
};
/**
 * FORECAST: How long can I stay starting from 'startDate'?
 * Returns the date of the last legal day.
 */
export const calculateSafeUntil = (startDate, tripHistory) => {
  let currentDate = new Date(startDate);
  // Safety valve: Don't calculate more than 1 year ahead to prevent browser crashes
  const maxDaysLookAhead = 365; 

  for (let i = 0; i < maxDaysLookAhead; i++) {
    // 1. Create a hypothetical scenario where we stay on this specific day
    // We do this by temporarily adding this single day to the calculation logic
    // But since our 'calculateRollingDays' looks at history, we treat this day as a "Trip of 1 day"
    
    // Actually, simpler approach: 
    // Just run the rolling calculation for 'currentDate', 
    // BUT we must assume the user has been present every day from 'startDate' up to 'currentDate'.
    
    // Let's build a temporary trip list that includes a "stay" from startDate to currentDate
    const hypotheticalTrip = { start: startDate, end: currentDate };
    const tempHistory = [...tripHistory, hypotheticalTrip];

    // 2. Check the math for this specific day
    const used = calculateRollingDays(currentDate, tempHistory);

    if (used > 90) {
      // If today pushes us over 90, the SAFE day was yesterday.
      return addDays(currentDate, -1);
    }

    // Move to tomorrow
    currentDate = addDays(currentDate, 1);
  }

  return addDays(new Date(startDate), maxDaysLookAhead); // If they are safe for a year, just return that.
};
/**
 * RE-ENTRY: If I have 0 days left, when is the first day I can return?
 */
export const calculateReEntryDate = (tripHistory) => {
  // Start checking from tomorrow
  let checkDate = addDays(new Date(), 1); 
  
  // Safety valve: limit to 180 days (since you definitely get days back by then)
  for (let i = 0; i < 180; i++) {
    // Check: If I try to enter on 'checkDate', how many days would I have used?
    // We assume 0 duration for the check itself, we just want to know the "Backlog"
    const daysUsed = calculateRollingDays(checkDate, tripHistory);
    
    // If the backlog drops below 90, we have space to enter!
    if (daysUsed < 90) {
      return checkDate;
    }
    
    checkDate = addDays(checkDate, 1);
  }
  
  return checkDate;
};