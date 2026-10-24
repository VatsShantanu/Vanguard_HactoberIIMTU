// Generates and triggers download of .ics iCalendar file and Google Calendar 1-Click URLs

export function getGoogleCalendarUrl(event) {
  if (!event || !event.date) return '';

  const cleanDate = (dStr) => dStr.replace(/-/g, '');
  const start = cleanDate(event.date);
  
  // For all-day/multi-day event in Google Calendar format: YYYYMMDD/YYYYMMDD
  // Next day for end date if single day
  let end = event.endDate ? cleanDate(event.endDate) : start;
  if (start === end) {
    // Add 1 day to end date for full day event in Google Calendar
    try {
      const d = new Date(event.date);
      d.setDate(d.getDate() + 1);
      end = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
    } catch {
      end = start;
    }
  }

  const text = encodeURIComponent(event.name || 'Campus Event');
  const location = encodeURIComponent(event.venue || 'Campus');
  const details = encodeURIComponent(
    `${event.description || ''}\n\nCategory: ${event.category || 'General'}\nFee: ${event.fee || 'Free'}\nOrganizer: ${event.organizer || 'Campus'}\nLink: ${event.sourceUrl || ''}\n\nSynced via MyCampus: Your Event Journey`
  );

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${start}/${end}&details=${details}&location=${location}`;
}

export function openInGoogleCalendar(event) {
  const url = getGoogleCalendarUrl(event);
  if (url) {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}

export function exportEventToICS(event) {
  if (!event || !event.date) return;

  const formatDate = (dateStr) => {
    return dateStr.replace(/-/g, '');
  };

  const startDateFormatted = formatDate(event.date);
  const endDateFormatted = event.endDate ? formatDate(event.endDate) : startDateFormatted;

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//MyCampus//Event Journey Platform//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${event.id || Date.now()}@mycampus.app`,
    `DTSTAMP:${formatDate(new Date().toISOString().slice(0, 10))}T000000Z`,
    `DTSTART;VALUE=DATE:${startDateFormatted}`,
    `DTEND;VALUE=DATE:${endDateFormatted}`,
    `SUMMARY:${event.name || 'Campus Event'}`,
    `DESCRIPTION:${(event.description || '').replace(/\n/g, '\\n')} - Category: ${event.category || 'General'}`,
    `LOCATION:${event.venue || 'Campus'}`,
    `STATUS:CONFIRMED`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${(event.name || 'event').replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportAllEventsToICS(events) {
  if (!events || events.length === 0) return;

  const formatDate = (dateStr) => dateStr.replace(/-/g, '');

  const vEvents = events.map(event => {
    const start = formatDate(event.date);
    const end = event.endDate ? formatDate(event.endDate) : start;
    return [
      'BEGIN:VEVENT',
      `UID:${event.id}@mycampus.app`,
      `DTSTAMP:${formatDate(new Date().toISOString().slice(0, 10))}T000000Z`,
      `DTSTART;VALUE=DATE:${start}`,
      `DTEND;VALUE=DATE:${end}`,
      `SUMMARY:${event.name}`,
      `DESCRIPTION:${(event.description || '').replace(/\n/g, ' ')}`,
      `LOCATION:${event.venue || 'Campus'}`,
      'END:VEVENT'
    ].join('\r\n');
  }).join('\r\n');

  const fullICS = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//MyCampus//Full Timeline//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    vEvents,
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([fullICS], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `mycampus_all_events_${Date.now()}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
