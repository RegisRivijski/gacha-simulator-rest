import mongoose from 'mongoose';
import { genshinImpactTgBot } from '../../modules/mongoose.js';

import {
  DEFAULT_BANNER_FOR_USERS,
} from '../../constants/index.js';
import {
  START_PRIMOGEMS_COUNT,
} from '../../constants/economy.js';

const usersSchema = new mongoose.Schema({
  chatId: {
    type: Number,
    default: 0,
  },
  platform: {
    type: Number,
    default: 1,
  },
  groupChatIds: {
    type: [Number],
    default: [],
  },
  firstName: {
    type: String,
    default: '',
  },
  lastName: {
    type: String,
    default: '',
  },
  username: {
    type: String,
    default: '',
  },
  languageCode: {
    type: String,
    default: '',
  },
  standard: {
    fourStar: {
      type: Number,
      default: 1,
    },
    fiveStar: {
      type: Number,
      default: 1,
    },
  },
  character: {
    fourStar: {
      type: Number,
      default: 1,
    },
    fiveStar: {
      type: Number,
      default: 1,
    },
    fourStarEventGuaranteed: {
      type: Boolean,
      default: true,
    },
    fiveStarEventGuaranteed: {
      type: Boolean,
      default: true,
    },
  },
  weapon: {
    fourStar: {
      type: Number,
      default: 1,
    },
    fiveStar: {
      type: Number,
      default: 1,
    },
    fourStarEventGuaranteed: {
      type: Boolean,
      default: true,
    },
    fiveStarEventGuaranteed: {
      type: Boolean,
      default: true,
    },
  },
  currentBanner: {
    type: String,
    default: DEFAULT_BANNER_FOR_USERS,
  },
  primogems: {
    type: Number,
    default: START_PRIMOGEMS_COUNT,
  },
  stardust: {
    type: Number,
    default: 0,
  },
  starglitter: {
    type: Number,
    default: 0,
  },
  primogemsAdded: {
    type: Date,
    default: Date.now,
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  gifEnable: {
    type: Boolean,
    default: true,
  },
  notificationsEnable: {
    type: Boolean,
    default: true,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

export default genshinImpactTgBot.model('users', usersSchema);
