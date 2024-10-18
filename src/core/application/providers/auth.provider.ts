export interface IAuthProvider {
  generateToken(data: object): string;
  decodeToken<T>(token: string): T;
}
