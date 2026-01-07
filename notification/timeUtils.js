export const formatTimeAMPM = (time24) => {
  if (!time24) return "";

  let [hours, minutes] = time24.split(":");
  hours = parseInt(hours, 10);

  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  return `${hours}:${minutes} ${ampm}`;
};
