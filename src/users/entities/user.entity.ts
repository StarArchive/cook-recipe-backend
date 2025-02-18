import { Role, User } from "@prisma/client";
import { Exclude } from "class-transformer";

export class UserEntity implements User {
  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }

  id: number;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  email: string;
  @Exclude()
  password: string;
  roles: Role[] = [];
}
