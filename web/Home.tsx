import { type User } from "./types"
interface HomeProps {
  onPathChange: (path: string) => void,
  user: User | null,
  onUserChange: (user: User) => void,
}
export default function Home({ onPathChange, user, onUserChange }: HomeProps) {
  // if (user == null) {
  //   onPathChange("login");
  //   return null;
  // }
  return (
    <h1>Welcome {user.firstname}</h1>
  )
}

