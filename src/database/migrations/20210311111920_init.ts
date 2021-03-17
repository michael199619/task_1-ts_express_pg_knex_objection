import Knex from 'knex';

export const up = (knex: Knex) => knex.schema
  .createTable('lessons', (table) => {
    table.increments();
    table.string('title').notNullable();
    table.date('date').notNullable();
    table.enum('status', [0, 1]).defaultTo(0).notNullable();
  })

  .createTable('students', (table) => {
    table.increments();
    table.string('name').notNullable();
  })

  .createTable('lessons_students', (table) => {
    table.increments();
    table.boolean('visit').defaultTo(false).notNullable();
    table.integer('lessonId').references('lessons');
    table.integer('studentId').references('students');
  })

  .createTable('teachers', (table) => {
    table.increments();
    table.string('name').notNullable();
  })

    .createTable('lessons_teachers', (table) => {
    table.increments();
    table.integer('lessonId').references('lessons');
    table.integer('teacherId').references('teachers');
  })

export const down = (knex: Knex) => knex.schema
  .dropTableIfExists('students')
  .dropTableIfExists('lessons')
  .dropTableIfExists('lessons_students')
  .dropTableIfExists('teachers')
  .dropTableIfExists('lessons_teachers')
