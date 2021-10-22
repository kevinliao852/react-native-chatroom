import React, { createContext, useState } from "react";
export const UserContext = createContext({});

export interface User {
  uid: string;
  email: string;
}

export const UserProvider = ({ children }: any) => {
  const [user, setUser] = useState<User>();

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
