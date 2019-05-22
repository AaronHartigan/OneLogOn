export default function formatDate(date, timePeriod = 'day') {
  if (!(date instanceof Date)) {
    return '';
  }
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const longMonthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  let day = date.getDate();
  let month = monthNames[date.getMonth()];
  let year = date.getFullYear();

  if (timePeriod === 'day') {
    return `${month} ${day}, ${year}`;
  } else if (timePeriod === 'week') {
    let newDate = new Date(date);
    let firstOfWeek = newDate.getDate() - newDate.getDay();

    newDate.setDate(firstOfWeek);
    let day1 = newDate.getDate();
    let month1 = monthNames[newDate.getMonth()];

    newDate.setDate(newDate.getDate() + 6);
    let day2 = newDate.getDate();
    let month2 = monthNames[newDate.getMonth()];
    let year2 = newDate.getFullYear();
    return `${month1} ${day1} - ${month2} ${day2}, ${year2}`;
  } else if (timePeriod === 'month') {
    return `${longMonthNames[date.getMonth()]} ${year}`;
  }
  return '';
}
