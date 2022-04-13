export const UserRole=  {
    UNCERTIFIED: 0,
    CERTIFIED: 1,
    ADMIN: 100,
}

import { SetMetadata } from "@nestjs/common";

export const Roles = (roles: number) => SetMetadata('roles', roles);