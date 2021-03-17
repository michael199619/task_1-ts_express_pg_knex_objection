export interface GetLesson extends Lesson {
  students: Student[];
  teachers: Teacher[];
}

export interface Lesson {
  id?: number;
  title: string;
  date: string;
  status?: 0 | 1;
  visitCount?: number | 0;
}

export interface Student {
  id: number;
  name: string;
  visit: boolean;
}

export interface Teacher {
  id: number;
  name: string;
}
