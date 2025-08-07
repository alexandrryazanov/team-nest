export interface JwtPayload {
  sub: number; // userId
  iat?: number;
  exp?: number;
  type: string;
}
