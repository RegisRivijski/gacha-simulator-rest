module.exports = {
  addingZero(number) {
    return number < 10 ? `0${number}` : number;
  },

  howManySecondsPast(time) {
    return Math.floor(((new Date()).getTime() - time) / 60000);
  },
};
