import dotenv from "dotenv"
import { createClient } from "@supabase/supabase-js"

import type { SupabaseClient } from "@supabase/supabase-js"

interface CustomNodeJsGlobal {
  supabase: SupabaseClient<any, "public", any>
}

declare const global: CustomNodeJsGlobal

if (!global.supabase) {
  dotenv.config()

  global.supabase = createClient(
    process.env.DATABASE_URL!,
    process.env.DATABASE_KEY!
  )
}

export const supabase = global.supabase
