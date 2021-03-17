import joi from 'joi';
import config from '../config/config';

const {saveLessonsCount} = config;

export const LessonsGetSchema = joi.object()
  .options({abortEarly: false})
  .keys({
    date: joi.string().regex(/^\d{4}-\d{2}-\d{2}(,\d{4}-\d{2}-\d{2}|)$/).default('').error(() => ({message: 'format: YYYY-MM-DD or YYYY-MM-DD,YYYY-MM-DD'} as Error)),
    status: joi.number().integer().valid(0, 1),
    teacherIds: joi.array().items(joi.number().integer().min(1)).default([]),
    page: joi.number().integer().min(1).default(0),
    lessonsPerPage: joi.number().integer().min(1).default(5),
    studentsCount: joi.string().regex(/^\d+(,\d+|)$/).default('').error(() => ({message: 'format: number or number,number'} as Error))
  });

export const LessonsSaveSchema = joi.object()
  .options({abortEarly: false})
  .keys({
    title: joi.string(),
    teacherIds: joi.array().unique().items(joi.number().integer().min(1)).default([]),
    days: joi.array().unique().items(joi.number().integer().min(0).max(6)).default([]),
    lessonsCount: joi.number().integer().min(1).max(saveLessonsCount),
    firstDate: joi.date(),
    lastDate: joi.date()
  });

export interface LessonsGetFilter {
  date: string | '';
  status?: '1' | '2';
  teacherIds: number[];
  page: number | 0;
  lessonsPerPage: number | 5;
  studentsCount: string | '';
}

export interface LessonsPostFilter {
  title: string,
  teacherIds: number[];
  days: number[];
  lessonsCount?: number;
  firstDate: string;
  lastDate: string;
}

