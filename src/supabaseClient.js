// src/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

// ⚙️ Thông tin Supabase
const supabaseUrl = "https://zsbaxdbhdyfrjnowltnp.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzYmF4ZGJoZHlmcmpub3dsdG5wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4MTA1MzMsImV4cCI6MjA3NTM4NjUzM30.lcnS66HvuK3U4Ct6Ul9UGwgUTfXA6p4hKnRvHXkgNow";

// 🔗 Tạo kết nối Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
