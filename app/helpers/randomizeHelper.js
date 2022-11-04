module.exports = {
  randomInteger(min, max) {
    const rand = min + Math.random(Date.now) * (max + 1 - min);
    return Math.floor(rand);
  },

  /**
   * @param chances [{item:'', chance: 0}]
   */
  getRandomItemByChances(chances) {
    let sum = 0;
    for (const chance of chances) {
      sum += chance.chance;
    }
    let index = 0;
    const rand = Math.floor(Math.random() * sum);
    for (let s = chances[0].chance; s <= rand; s += chances[index].chance) {
      index += 1;
    }
    return chances[index].item;
  },

  getRandomArrayElement(array) {
    const index = this.randomInteger(0, array.length - 1);
    return array.sort(() => Math.random() - 0.5)[index];
  },
};
