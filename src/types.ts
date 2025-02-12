import { User } from "@prisma/client";
import { Request as HttpRequest } from "express";

export type AuthRequest = HttpRequest & { user: User };
