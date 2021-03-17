import Knex from 'knex';

export const seed = async (knex: Knex) => {
  const table = await Promise.all([
    knex('lessons').del(),
    knex('lessons_students').del(),
    knex('students').del()
  ])

  await knex('lessons').insert([{
    id: 1,
    title: 'урок 1',
    date: new Date(),
    status: 0
  }
  ]);

  await knex('lessons_students').insert([{
    id: 1,
    visit: true,
    lessonId: 1,
    studentId: 1
  }, {
    id: 2,
    visit: false,
    lessonId: 1,
    studentId: 2
  }
  ]);

  await knex('lessons_teachers').insert([{
    id: 1,
    lessonId: 1,
    teacherId: 1
  }, {
    id: 2,
    lessonId: 1,
    teacherId: 1
  }
  ]);

  await knex('students').insert([{
    id: 1,
    name: 'миша'
  }, {
    id: 2,
    name: 'анна'
  }
  ]);

  await knex('teachers').insert([{
    id: 1,
    name: 'учитель 1'
  }, {
    id: 2,
    name: 'учитель 2'
  }
  ]);

  return true;
};
