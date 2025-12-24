export function getMeetingDateTime(date, time) {
  const [h, m] = time.split(":");
  const d = new Date(date);
  d.setHours(h, m, 0, 0);
  return d;
}
