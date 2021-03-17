import * as HttpStatus from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';
import config from '../config/config';
import { LessonsGetFilter, LessonsPostFilter } from '../validators/lessonsRequest';
import * as lessonService from '../services/lessons';

const { messages } = config;

/**
 * Handle / GET request, responds API information
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} _next
 */
export async function get(req: Request, res: Response, _next: NextFunction): Promise<void> {
  try {
    res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        data: await lessonService.get(req.query as unknown as LessonsGetFilter),
        message: messages.lessons.get
    });
  } catch (err) {
    res.status(500).json({message: err.toString()})
  }
}

/**
 * Handle /lessons POST request, responds API information
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} _next
 */
export async function save(req: Request, res: Response, _next: NextFunction): Promise<void> {
  try {
    res.status(HttpStatus.OK).json({
      code: HttpStatus.OK,
      data: await lessonService.save(req.body as unknown as LessonsPostFilter),
      message: messages.lessons.get
    });
  } catch (err) {
    res.status(500).json({message: err.toString()})
  }
}
