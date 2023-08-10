export default interface User {
  id: string;
  name: string;
  email: string;
}

export const defaultUser: User = {
  id: "",
  name: "",
  email: "",
};
