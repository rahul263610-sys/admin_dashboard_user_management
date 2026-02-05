export interface User {
  _id: string;
  name: string;
  email: string;
  about: string;
  role: string;
  bio: string;
  contactNumber: string;
  avatar: string;
  isDeleted: boolean;
  status: string;
  createdAt: Date;
  user?: { name: string };
}
