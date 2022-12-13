export function addingZero(number) {
  return number < 10 ? `0${number}` : number;
}

export function howManySecondsPast(time) {
  return Math.floor(((new Date()).getTime() - time) / 60000);
}
