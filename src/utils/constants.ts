const ACCESS_TOKEN_SECRET: string | undefined = process.env.ACCESS_TOKEN_SECRET!;
export function getAccessSecret(): string {
  if (!ACCESS_TOKEN_SECRET || ACCESS_TOKEN_SECRET.length === 0) {
    throw new Error('The environment variable JWT_SECRET_KEY is not set.');
  }

  return ACCESS_TOKEN_SECRET;
}
