import { createClient } from "@supabase/supabase-js";
export const useSupabaseClient = () => {
  return createClient(
    "https://zmpighhgifmqcsvseaux.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InptcGlnaGhnaWZtcWNzdnNlYXV4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4MDUxNjQ2MywiZXhwIjoxOTk2MDkyNDYzfQ.dxXeTHfMHFCagykiLWTkVWTQAUOfbUyrkJW3y6kfPlI"
  );
};
