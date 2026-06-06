// Gate de sesión placeholder para el panel. Es deliberadamente simple: un único
// email autorizado y una cookie con su valor. Cuando exista la base con Supabase
// Auth, reemplazar este módulo + las rutas /api/auth/* por la sesión real.

export const SESSION_COOKIE = "mm_session";

// Email habilitado para entrar al panel. Validar contra esto en login.
export const AUTHORIZED_EMAIL = "larenasdam@gmail.com";

export function isAuthorizedEmail(email: string): boolean {
  return email.trim().toLowerCase() === AUTHORIZED_EMAIL;
}
