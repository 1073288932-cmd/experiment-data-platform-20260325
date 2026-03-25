function getEnv(name: string, required = true) {
  const value = process.env[name];

  if (!value && required) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value ?? "";
}

export function getSupabaseUrl() {
  return getEnv("NEXT_PUBLIC_SUPABASE_URL");
}

export function getSupabaseAnonKey() {
  return getEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

export function getSupabaseServiceRoleKey() {
  return getEnv("SUPABASE_SERVICE_ROLE_KEY");
}

export function getTeacherShareToken() {
  return getEnv("TEACHER_SHARE_TOKEN");
}

