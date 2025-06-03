
export class User {
  id: number;
  username: string;
  email: string;
  // password_hash: string; // In entity, we might represent password as hash. PrismaUserType has 'password'.
  password: string; // Matching PrismaUserType which includes the (hashed) password field
  names: string | null;
  createdAt: Date;
  updatedAt: Date;

  // Note: When returning user objects from services, you should still omit the password field.
}

