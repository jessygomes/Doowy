// import { createContext, useContext, useState, useEffect } from "react";
// import { auth } from "@/auth";

// const AuthContext = createContext(null);

// interface AuthProviderProps {
//   children?: React.ReactNode;
// }

// export const AuthProvider = ({ children }: AuthProviderProps) => {
//   const [session, setSession] = useState(null);

//   useEffect(() => {
//     const fetchSession = async () => {
//       const session = await auth();
//       setSession(session);
//     };

//     fetchSession();
//   }, []);

//   const updateSession = async () => {
//     const session = await auth();
//     setSession(session);
//   };

//   return (
//     <AuthContext.Provider value={{ session, updateSession }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);
