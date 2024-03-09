import { supabase } from "../../../databases/supabase";
import { courses_and_subjects } from "../interfaces/interfacesBD";

class SubjectRepository {
  async findAll() {
    const { data, error }: {
      data: courses_and_subjects[] | null,
      error: any
    } = await supabase.from('subjects').select('*')

    return error ? error : data
  }

  async findById(id: string) {
    const { data, error }: {
      data: courses_and_subjects[] | null,
      error: any
    } = await supabase.from('subjects').select('*')
      .eq('id', id)
    
    return error ? error : data
  }

  async findByName(name: string) {
    const { data, error }: {
      data: courses_and_subjects[] | null,
      error: any
    } = await supabase.from('subjects').select('*')
      .eq('name', name)
    
    return error ? error : data
  }

  async create(name: string, description: string) {
    const { data, error }: {
      data: courses_and_subjects[] | null,
      error: any
    } = await supabase.from('subjects')
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
    } = await supabase.from('subjects')
      .update({
        name, description
      }).eq('id', id)
    
    return error ? error : data
  }

  async delete(id: string) {
    const { data, error }: {
      data: courses_and_subjects[] | null,
      error: any
    } = await supabase.from('subjects').delete()
      .eq('id', id)
    
    return error ? error : data
  }
}

export default new SubjectRepository()