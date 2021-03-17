import { Model } from 'objection';

export default class Lessons extends Model {
  static get tableName() {
    return 'lessons'
  }
}
