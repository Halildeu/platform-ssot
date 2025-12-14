export interface UsersDictionary {
  pages: {
    users: {
      title: string;
      description: string;
    };
  };
}

export const usersDictionary: UsersDictionary = {
  pages: {
    users: {
      title: 'Kullanıcı Yönetimi',
      description: 'Kullanıcı rolleri, izinleri ve modül erişimlerini yönetin.',
    },
  },
};

export default usersDictionary;
