export interface JwtPayload {
  sub: string; // userId
  iat?: number;
  exp?: number;
  type: string;
}
