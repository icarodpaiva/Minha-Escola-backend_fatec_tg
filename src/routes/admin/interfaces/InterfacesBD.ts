export interface accessLevel {
  id: number,
  type: string
}
export interface courses_and_subjects {
  id: number,
  name: string,
  description: string
}

export interface courses_subjects {
  id: number,
  course_id: number,
  subject_id: number
}