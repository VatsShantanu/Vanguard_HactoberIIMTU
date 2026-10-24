// Rule-based validation & Schedule clash detection engine

/**
 * Validates mandatory fields and formatting
 */
export function validateEventFields(eventData) {
  const errors = {};

  if (!eventData.name || !eventData.name.trim()) {
    errors.name = 'Event name is required';
  } else if (eventData.name.trim().length < 3) {
    errors.name = 'Event name must be at least 3 characters';
  }

  if (!eventData.date) {
    errors.date = 'Event date is required';
  }

  if (!eventData.venue || !eventData.venue.trim()) {
    errors.venue = 'Venue or location is required';
  }

  if (eventData.fee === undefined || eventData.fee === null || eventData.fee === '') {
    errors.fee = 'Fee details required (enter "Free" or amount)';
  }

  if (!eventData.eligibility || !eventData.eligibility.trim()) {
    errors.eligibility = 'Eligibility criteria is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Checks for exact or fuzzy duplicate event in existing list
 */
export function checkDuplicateEvent(newEvent, existingEvents, currentEventId = null) {
  if (!newEvent.name) return null;

  const normalize = (str) =>
    str.toLowerCase().replace(/[^a-z0-9]/g, '');

  const newNorm = normalize(newEvent.name);
  const newUrl = newEvent.sourceUrl ? newEvent.sourceUrl.trim().toLowerCase() : null;

  for (const item of existingEvents) {
    if (currentEventId && item.id === currentEventId) continue;

    const itemNorm = normalize(item.name);
    // Exact or high-similarity match
    if (newNorm === itemNorm) {
      return {
        isDuplicate: true,
        type: 'Exact Name Match',
        conflictingEvent: item,
        message: `An event with the exact name "${item.name}" is already in your timeline.`
      };
    }

    // High substring match
    if (
      (newNorm.length > 5 && itemNorm.includes(newNorm)) ||
      (itemNorm.length > 5 && newNorm.includes(itemNorm))
    ) {
      return {
        isDuplicate: true,
        type: 'Fuzzy Name Similarity',
        conflictingEvent: item,
        message: `Similar event "${item.name}" already exists on ${item.date}.`
      };
    }

    // URL match
    if (newUrl && item.sourceUrl && item.sourceUrl.trim().toLowerCase() === newUrl) {
      return {
        isDuplicate: true,
        type: 'Source URL Match',
        conflictingEvent: item,
        message: `This registration URL is already registered under "${item.name}".`
      };
    }
  }

  return null;
}

/**
 * Checks schedule clashes against existing events on the same date/time
 */
export function checkScheduleClash(newEvent, existingEvents, currentEventId = null) {
  if (!newEvent.date) return null;

  const targetDate = newEvent.date;
  const targetEndDate = newEvent.endDate || newEvent.date;

  for (const existing of existingEvents) {
    if (currentEventId && existing.id === currentEventId) continue;

    const existStartDate = existing.date;
    const existEndDate = existing.endDate || existing.date;

    // Check if dates overlap
    const datesOverlap = !(targetEndDate < existStartDate || targetDate > existEndDate);

    if (datesOverlap) {
      // If dates overlap, examine severity
      const isAcademic = existing.category === 'Academic' || newEvent.category === 'Academic';
      const severity = isAcademic ? 'high' : 'medium';

      return {
        hasClash: true,
        severity,
        conflictingWith: existing.name,
        conflictDate: existing.date,
        conflictTime: existing.time || 'All Day',
        existingCategory: existing.category,
        existingVenue: existing.venue,
        message: isAcademic
          ? `CRITICAL SCHEDULE CLASH: Overlaps with mandatory academic commitment "${existing.name}" on ${existing.date} (${existing.time})!`
          : `SCHEDULE OVERLAP: You already have "${existing.name}" scheduled on ${existing.date} at ${existing.venue}.`
      };
    }
  }

  return null;
}
