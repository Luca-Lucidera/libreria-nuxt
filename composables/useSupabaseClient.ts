import { createClient } from "@supabase/supabase-js";
export const useSupabaseClient = () => {
  const runtimeConfig = useRuntimeConfig();
  return createClient(
    runtimeConfig.public.supabaseUrl,
    runtimeConfig.public.supabaseKey
  );
};
