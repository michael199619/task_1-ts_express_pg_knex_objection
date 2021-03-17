import { Model } from 'objection';
import LessonsTeachers from './LessonsTeachers';

export default class Students extends Model {
  static get tableName() {
    return 'teachers'
  }

  static relationMappings = {
    animals: {
      relation: Model.HasManyRelation,
      modelClass: LessonsTeachers,
      join: {
        from: 'teachers.id',
        to: 'lessons_teachers.lessonId'
      }
    }
  };
}
