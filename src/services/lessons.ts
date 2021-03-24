import { LessonsGetFilter, LessonsPostFilter } from '../validators/lessonsRequest';
import { Students, Lessons, Teachers, LessonsTeachers } from '../models';
import knex from '../config/knex';
import { GetLesson, Lesson, Teacher } from '../domain/lessons';
import config from '../config/config';

const {saveLessonsCount, saveLessonsDays} = config;

export const get = async (lessonsFilter: LessonsGetFilter): Promise<GetLesson[]> => {
  const {teacherIds, lessonsPerPage, page, status, date, studentsCount} = lessonsFilter;

  const qb = Lessons.query()
    .leftJoin('lessons_students', 'lessons_students.lessonId', '=', 'lessons.id')
    .leftJoin('students', 'lessons_students.studentId', '=', 'students.id')
    .leftJoin('lessons_teachers', 'lessons_teachers.lessonId', '=', 'lessons.id')
    .leftJoin('teachers', 'lessons_teachers.teacherId', 'teachers.id')
    .select([
      'lessons.*',
      knex.raw('count(DISTINCT CASE WHEN lessons_students.visit THEN lessons_students.id END)::integer as "visitCount"'),
      knex.raw('lessons.status::integer as status'),
      knex.raw(`
        CASE WHEN count(lessons_students) = 0
        THEN '[]' 
        ELSE json_agg(DISTINCT jsonb_build_object('id', lessons_students."studentId", 'name', students.name, 'visit', lessons_students.visit))
        END as students
     `),
      knex.raw(`
        CASE WHEN count(lessons_teachers) = 0
        THEN '[]' 
        ELSE json_agg(DISTINCT jsonb_build_object('id', lessons_teachers."teacherId", 'name', teachers.name)) 
        END as teachers
      `),
    ])
    .offset(page * lessonsPerPage)
    .limit(lessonsPerPage)
    .groupBy('lessons.id')

  if (teacherIds.length) {
    qb.whereIn('teachers.id', teacherIds)
  }

  if (status !== undefined) {
    qb.andWhere('lessons.status', status);
  }

  const [date1, date2] = date.split(',');
  if (date && !date2) {
    qb.andWhere('lessons.date', new Date(date));
  } else if (date) {
    qb.whereBetween('date', [new Date(date1), new Date(date2)]);
  }

  const [studentsCount1, studentsCount2] = studentsCount.split(',');
  if (studentsCount && !studentsCount2) {
    qb.having(knex.raw('count(distinct students.id) = ?', [studentsCount1]));
  } else if (studentsCount) {
    qb
      .having(knex.raw('count(distinct students.id) >= ?', [studentsCount1]))
      .having(knex.raw('count(distinct students.id) <= ?', [studentsCount2]));
  }

  return (await qb.toKnexQuery()) as GetLesson[];
}

export const save = async (lessonsFilter: LessonsPostFilter): Promise<number[]> => {
  const {days, firstDate, lastDate, teacherIds, title} = lessonsFilter;
  const lessons: Lesson[] = [];
  const day = 1000 * 60 * 60 * 24;
  let {lessonsCount} = lessonsFilter;

  const teachers = await Teachers.query().whereIn('id', teacherIds);
  if (teachers.length !== teacherIds.length) {
    throw new Error('teacher does not exists');
  }

  // lessonsCount and lastDate are params mutually exclusive
  if (!lessonsCount) {
    lessonsCount = (+new Date(lastDate) - +new Date(firstDate)) / day;
  }

  const max = Math.min(lessonsCount, saveLessonsCount);
  for (let i = 0, count = 0; count < max; i++) {
    const date = new Date(+new Date(firstDate) + day * i);

    if (i > saveLessonsDays || lastDate && i === max) {
      break;
    }

    if (days.indexOf(date.getDay()) === -1) {
      continue;
    }

    lessons.push({
      title,
      date: date.toDateString()
    });

    count++;
  }

  const ids: number[] = (await Lessons.query().insertGraph(lessons as any[])).map((e: any) => e.id) as number[];
  await LessonsTeachers.query().insertGraph(ids.reduce((prev, lessonId) => {
    return [...prev, ...teacherIds.map(teacherId => ({lessonId, teacherId}))] as []
  }, []));

  return ids;
}


