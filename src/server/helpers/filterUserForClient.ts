import type { User } from "@clerk/nextjs/server";
export const filterUserForClient = (user: User) => {
    const username = user?.username || (user?.firstName && user?.lastName ? `${user.firstName}_${user.lastName}` : 'unknown');
    return { id: user.id, username, profileImageUrl: user.profileImageUrl}
};