import { User } from "@prisma/client";


export interface RegisterResponse {
    user?: User
}


export interface loginResponse {
    user?: User
}