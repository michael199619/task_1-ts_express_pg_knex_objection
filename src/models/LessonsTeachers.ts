import { Model } from 'objection';

export default class LessonsTeachers extends Model {
  static get tableName() {
    return 'lessons_teachers'
  }
}
