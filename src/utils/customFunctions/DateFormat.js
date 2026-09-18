/**
 * Coerce a Date | ISO string | null | "" into a real Date, or null.
 * react-date-range runs date-fns `format()` on whatever it is given, which
 * throws "RangeError: Invalid time value" on null/invalid input and takes the
 * whole page down through the error boundary.
 */
export const toValidDate = (value) => {
  if (value === null || value === undefined || value === "") return null;
  const d = value instanceof Date ? value : new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
};

/** Always hand react-date-range a range built from real Dates. */
export const safeDateRange = (start, end, key = "selection") => {
  const startDate = toValidDate(start) || new Date();
  const parsedEnd = toValidDate(end);
  const endDate = parsedEnd && parsedEnd >= startDate ? parsedEnd : startDate;
  return [{ startDate, endDate, key }];
};

export const dateFormat = (date, noTime) => {
  const d = toValidDate(date);
  if (!d) return "";
  var hours = d.getHours();
  var minutes = d.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return noTime ? `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}` : `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()} ${strTime}`;
};

export const formatDateForDateRange = (dateData) => {
  const date = new Date(dateData);
  return dateFormat(date.toISOString(), true);
};

export const dateSubmitValue = (inputDateString) => {
  const inputDate = new Date(inputDateString);
  const year = inputDate.getFullYear();
  const month = inputDate.getMonth() + 1; // Months are zero-based, so add 1
  const day = inputDate.getDate();
  return `${year}-${month}-${day}`;
};

export const dateWithOnlyMonth = (inputDateString)=>{
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const inputDate = new Date(inputDateString);
  const day = inputDate.getUTCDate();
  const month = months[inputDate.getUTCMonth()];
  const year = inputDate.getUTCFullYear();
  return `${day} ${month} ${year}`;
}