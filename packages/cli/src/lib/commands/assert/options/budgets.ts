import { Param } from './budgets.model.js';

export const param: Param = {
  budgets: {
    alias: 'j',
    type: 'array',
    string: true,
    description: 'Performance budgets (RC file only)'
  }
};
