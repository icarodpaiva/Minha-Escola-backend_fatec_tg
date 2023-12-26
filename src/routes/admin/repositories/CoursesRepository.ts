import { supabase } from "../../../databases/supabase";
import { courses_and_subjects } from "../interfaces/interfacesBD";

class CoursesRepository {
  async findAll() {
    const { data, error }: {
      data: courses_and_subjects[] | null,
      error: any
    } = await supabase.from('courses').select('*')

    return error ? error : data
  }

  async findById(id: string) {
    const { data, error }: {
      data: courses_and_subjects[] | null,
      error: any
    } = await supabase.from('courses').select('*')
      .eq('id', id)
    
    return error ? error : data
  }

  async findByName(name: string) {
    const { data, error }: {
      data: courses_and_subjects[] | null,
      error: any
    } = await supabase.from('courses').select('*')
      .eq('name', name)
    
    return error ? error : data
  }

  async create(name: string, description: string) {
    const { data, error }: {
      data: courses_and_subjects[] | null,
      error: any
    } = await supabase.from('courses')
      .insert([
        {
          name,
          description
        }
      ]).select()
    
    return error ? error : data
  }

  async update(id: string, name: string, description: string) {
    const { data, error }: {
      data: courses_and_subjects[] | null,
      error: any
    } = await supabase.from('courses')
      .update({
        name, description
      }).eq('id', id)
    
    return error ? error : data
  }

  async delete(id: string) {
    const { data, error }: {
      data: courses_and_subjects[] | null,
      error: any
    } = await supabase.from('courses').delete()
      .eq('id', id)
    
    return error ? error : data
  }
}

export default new CoursesRepository()