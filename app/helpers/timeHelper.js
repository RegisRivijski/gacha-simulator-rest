export function addingZero(number) {
  return number < 10 ? `0${number}` : number;
}

export function howManyMinutesPast(time) {
  return Math.floor(((new Date()).getTime() - time) / 60000);
}

export function howManyHoursPast(time) {
  return Math.floor(((new Date()).getTime() - time) / 60000 / 60);
}

export function addThirtyDays() {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 30);
  return currentDate;
}

export function daysUntil(futureDate) {
  const currentDate = new Date();
  const timeDifference = futureDate - currentDate;

  if (timeDifference <= 0) {
    return 0;
  }

  const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
  return daysDifference;
}

export function isNextDay(previousDate, currentDate = new Date()) {
  const prevDate = new Date(previousDate.getFullYear(), previousDate.getMonth(), previousDate.getDate());
  const currDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

  return currDate > prevDate;
}
