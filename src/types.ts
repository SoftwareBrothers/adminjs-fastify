export type AuthenticationOptions = {
  cookiePassword: string;
  cookieName?: string;
  authenticate: (email: string, password: string) => unknown | null;
};
