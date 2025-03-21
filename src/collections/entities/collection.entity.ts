import { Collection } from "@prisma/client";

export class CollectionEntity implements Collection {
  id: number;
  name: string;
  description: string | null;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
}
