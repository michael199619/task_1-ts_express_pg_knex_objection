import { Model } from 'objection';
import LessonsStudents from './LessonsStudents';

export default class Students extends Model {
  static tableName = 'students';

  static relationMappings = {
    lessons: {
      relation: Model.HasManyRelation,
      modelClass: LessonsStudents,
      join: {
        from: 'students.id',
        to: 'lessons_students.studentId'
      }
    }
  };
}
