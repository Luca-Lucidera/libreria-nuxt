import {User} from "@prisma/client";





export type UserVM = Omit<User, "password" | "jwt">