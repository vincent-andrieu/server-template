import { Permissions, Role, User } from "core";

export function checkUserPermissions(user: User, permissions: Array<Permissions>): boolean {
    if (!user.auth || user.auth.roles.some((role) => !(role instanceof Role)))
        throw "Invalid roles instances";
    const roles = (user.auth.roles as Array<Role>).sort((a, b) => a.weight - b.weight);
    const userPermissions: Set<Permissions> = new Set();

    roles.forEach((role) => {
        role.permissions.forEach((rolePerm) => {
            if (!rolePerm.startsWith("-"))
                userPermissions.add(rolePerm);
            else
                userPermissions.delete(rolePerm.slice(1));
        });
    });

    return permissions.every((perm) => userPermissions.has(perm));
}