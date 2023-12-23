import { supabase } from "../../../databases/supabase";
import { courses } from '../interfaces/InterfacesBD';

class CoursesRepository {
  async findAll() {
    const {
      data: courses,
      error: coursesError
    }: {
      data: courses[] | null,
      error: any
    } = await supabase.from('courses').select('*')

    return coursesError ? coursesError : courses
  }

  async findById(id: string) {
    const {
      data: courses,
      error: coursesError
    }: {
      data: courses[] | null,
      error: any
    } = await supabase.from('courses').select('*')
      .eq('id', id)
    
    return coursesError ? coursesError : courses
  }

  async findByName(name: string) {
    const {
      data: courses,
      error: coursesError
    }: {
      data: courses[] | null,
      error: any
    } = await supabase.from('courses').select('*')
      .eq('name', name)
    
    return coursesError ? coursesError : courses
  }

  async create(name: string, description: string) {
    const {
      data: courses,
      error: coursesError
    }: {
      data: courses[] | null,
      error: any
    } = await supabase.from('courses')
      .insert([
        {
          name,
          description
        }
      ]).select()
    
    return coursesError ? coursesError : courses
  }

  async update(id: string, name: string, description: string) {
    const {
      data: courses,
      error: coursesError
    }: {
      data: courses[] | null,
      error: any
    } = await supabase.from('courses')
      .update({
        name, description
      }).eq('id', id)
    
    return coursesError ? coursesError : courses
  }

  async delete(id: string) {
    const {
      data: courses,
      error: coursesError
    }: {
      data: courses[] | null,
      error: any
    } = await supabase.from('courses').delete()
      .eq('id', id)
    
    return coursesError ? coursesError : courses
  }
}

export default new CoursesRepository()