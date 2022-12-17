export function addingZero(number) {
  return number < 10 ? `0${number}` : number;
}

export function howManyMinutesPast(time) {
  return Math.floor(((new Date()).getTime() - time) / 60000);
}

export function howManyHoursPast(time) {
  return Math.floor(((new Date()).getTime() - time) / 60000 / 60);
}
