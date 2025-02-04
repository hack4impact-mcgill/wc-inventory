

export const queryKeys = {
    activityLog: {
        all: ['activityLog'] as const,
        byUser: (userId: string) => ['activityLog', { userId }] as const,
    },
    locations: {
        all: ['locations'] as const,
        detail: (locationId: string) => [...queryKeys.locations.all, locationId] as const,
    },
    users: {
        all: ['users'] as const,
        detail: (userId: string) => [...queryKeys.users.all, userId] as const,
    },
};