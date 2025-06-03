import { createContext } from "react";
import { type User } from "./types";
import type { SetState } from "./types";

export type InitialContextType = [SetState<string | null> | null, SetState<User | null> | null]
export const SetInitialContext = createContext<InitialContextType>([null, null]);

