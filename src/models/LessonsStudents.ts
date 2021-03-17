import { Model } from 'objection';

export default class LessonsStudents extends Model {
  static get tableName() {
    return 'lessons_students'
  }
}
