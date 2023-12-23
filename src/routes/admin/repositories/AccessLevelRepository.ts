import { supabase } from "../../../databases/supabase";
import { accessLevel } from '../interfaces/InterfacesBD'

class AccessLevelRepository {
  async findAll() {
    const {
      data: accessLevels,
      error: accessLevelsError
    }: {
      data: accessLevel[] | null;
      error: any
    } = await supabase.from('access_levels').select('*')
  
    return accessLevelsError ? accessLevelsError : accessLevels
  }
  
  async findById(id: string) {
    const {
      data: accessLevels,
      error: accessLevelsError
    }: {
      data: accessLevel[] | null;
      error: any
    } = await supabase
      .from('access_levels')
      .select('*')
      .eq('id', id)
    
    return accessLevelsError ? accessLevelsError : accessLevels
  }

  async findByType(type: string) {
    const {
      data: accessLevels,
      error: accessLevelsError
    }: {
      data: accessLevel[] | null;
      error: any
    } = await supabase
      .from('access_levels')
      .select('*')
      .eq('type', type)
    
    return accessLevelsError ? accessLevelsError : accessLevels
  }
  
  async createAccess(type: string) {
    const {
      data: accessLevels,
      error: accessLevelsError
    }: {
      data: accessLevel[] | null;
      error: any
    } = await supabase
      .from('access_levels')
      .insert([{ type }])
      .select()
    
    return accessLevelsError ? accessLevelsError : accessLevels
  }

  async updateAccess(id: string, type: string) {
    const {
      data: accessLevels,
      error: accessLevelsError
    }: {
      data: accessLevel[] | null;
      error: any
    } = await supabase
      .from('access_levels')
      .update({ type })
      .eq('id', id)
    
    return accessLevelsError ? accessLevelsError : accessLevels
  }

  async deleteAccess(id: string) {
    const {
      data: accessLevels,
      error: accessLevelsError
    }: {
      data: accessLevel[] | null;
      error: any
    } = await supabase
      .from('access_levels')
      .delete()
      .eq('id', id)
    
    return accessLevelsError ? accessLevelsError : accessLevels
  }
}

export default new AccessLevelRepository()