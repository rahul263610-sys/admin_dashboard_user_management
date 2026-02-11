export interface User {
  _id: string;
  name: string;
  email: string;
  latitude: number | null;
  longitude: number | null;
  device?: string | null;
  about: string;
  role: string;
  bio: string;
  contactNumber: string;
  avatar: string;
  status: string;
  createdAt: Date;
  user?: { name: string };
}
