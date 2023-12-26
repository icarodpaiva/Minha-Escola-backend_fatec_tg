import { supabase } from "../../../databases/supabase";
import { accessLevel } from "../interfaces/interfacesBD";

class AccessLevelRepository {
  async findAll() {
    const { data, error }: {
      data: accessLevel[] | null;
      error: any
    } = await supabase.from('access_levels').select('*')
  
    return error ? error : data
  }
  
  async findById(id: string) {
    const { data, error }: {
      data: accessLevel[] | null;
      error: any
    } = await supabase
      .from('access_levels')
      .select('*')
      .eq('id', id)
    
    return error ? error : data
  }

  async findByType(type: string) {
    const { data, error }: {
      data: accessLevel[] | null;
      error: any
    } = await supabase
      .from('access_levels')
      .select('*')
      .eq('type', type)
    
    return error ? error : data
  }
  
  async createAccess(type: string) {
    const { data, error }: {
      data: accessLevel[] | null;
      error: any
    } = await supabase
      .from('access_levels')
      .insert([{ type }])
      .select()
    
    return error ? error : data
  }

  async updateAccess(id: string, type: string) {
    const { data, error }: {
      data: accessLevel[] | null;
      error: any
    } = await supabase
      .from('access_levels')
      .update({ type })
      .eq('id', id)
    
    return error ? error : data
  }

  async deleteAccess(id: string) {
    const { data, error }: {
      data: accessLevel[] | null;
      error: any
    } = await supabase
      .from('access_levels')
      .delete()
      .eq('id', id)
    
    return error ? error : data
  }
}

export default new AccessLevelRepository()