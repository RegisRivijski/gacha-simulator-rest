const mongoose = require('mongoose');

const allActiveStatistic = new mongoose.Schema({
  created: {
    type: Date,
    default: Date.now,
  },
  allUsers: {
    type: Number,
    default: 0,
  },
  groupUsers: {
    type: Number,
    default: 0,
  },
  activeUsers: {
    type: Number,
    default: 0,
  },
  blockedUsers: {
    type: Number,
    default: 0,
  },
  groupActiveUsers: {
    type: Number,
    default: 0,
  },
  groupBlockedUsers: {
    type: Number,
    default: 0,
  },
  primogems24: {
    type: Number,
    default: 0,
  },
  primogems48: {
    type: Number,
    default: 0,
  },
  primogems72: {
    type: Number,
    default: 0,
  },
  primogemsLongTimeAgo: {
    type: Number,
    default: 0,
  },
  primogemsNever: {
    type: Number,
    default: 0,
  },
  fates24: {
    type: Number,
    default: 0,
  },
  fates48: {
    type: Number,
    default: 0,
  },
  fates72: {
    type: Number,
    default: 0,
  },
  fatesLongTimeAgo: {
    type: Number,
    default: 0,
  },
  fatesNever: {
    type: Number,
    default: 0,
  },
  languages: {
    type: Object,
    default: {},
  },
});
module.exports = mongoose.model('allstatistic', allActiveStatistic);
