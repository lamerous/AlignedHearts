export const API_ROUTES = {
  auth: {
    register: '/auth/register',
    login: '/auth/login',
    googleLogin: '/auth/google/login',
    logout: '/auth/logout',
  },
  rooms: {
    create: '/rooms/create',
    connect: '/rooms/connect',
    cancel: '/rooms/cancel',
  },
  profile: {
    me: '/profile/me',
    history: '/profile/history',
    changeName: '/profile/change_name',
    changeSex: '/profile/change_sex',
    changePassword: '/profile/change_password',
    changeAvatar: '/profile/change_avatar',
  },
} as const;
