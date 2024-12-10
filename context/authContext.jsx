'use client'
import LoadingSpinner from "@/components/LoadingSpinner";
import { provider, auth } from "@/utils/firebase";
import { useRouter } from "next/navigation";
import React, { useContext, createContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { onAuthStateChanged, signInWithPopup } from "firebase/auth";
import { BACKEND_URL } from "@/constant/configuration";
import { getCookie } from "@/utils/util";
import { toast } from "react-toastify";

const AuthContext = createContext(null);

export const AuthContextProvider = ({ children }) => {
    const router = useRouter()
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false)

    const handleLogin = async () => {
      setLoading(true);
      try {
        const result = await signInWithPopup(auth, provider);
        const idToken = await result.user.getIdToken();
  
        const response = await fetch(`${BACKEND_URL}/auth/google`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken }),
          credentials: "include",
        });
  
        if (response.ok) {
          const data = await response.json();

          Cookies.set("name", data.user.name);
          Cookies.set("email", data.user.email);
          Cookies.set("picture", data.user.picture);
          Cookies.set("token", idToken);

          setUser({
            name: data.user.name,
            email: data.user.email,
            photoUrl: data.user.picture
          })
  
          toast.success("Login Successful");
        } else {
          toast.error("Login failed");
        }
      } catch (error) {
        toast.error("An error occurred during login.");
      } finally {
        setLoading(false);
      }
    };
  
    const handleLogout = async () => {
      await auth.signOut();

      Cookies.remove("name");
      Cookies.remove("email");
      Cookies.remove("picture");
      Cookies.remove("token")

      setUser(null);
    
      router.push("/");
    
      await fetch(`${BACKEND_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });
    };
    
    // useEffect(() => {
    // const name = Cookies.get("name");
    // const email = Cookies.get("email");
    // const picture = Cookies.get("picture");
    // 
    // if (!!name && !!email) {
    //   setUser({
    //     name: name,
    //     email: email,
    //     photoUrl: picture,
    //   });
    //   }
    // }, []);

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
        if (authUser) {
          setLoading(true);
          const idToken = await authUser.getIdToken();

          await fetch(`${BACKEND_URL}/auth/google`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idToken }),
            credentials: "include",
          });

          Cookies.set("name", authUser.displayName);
          Cookies.set("email", authUser.email);
          Cookies.set("picture", authUser.photoURL);
          Cookies.set("token", idToken);

          setUser({
            name: authUser.displayName,
            email: authUser.email,
            photoUrl: authUser.photoURL,
          });
          setLoading(false);
        } else {
          Cookies.remove("name");
          Cookies.remove("email");
          Cookies.remove("picture");
          Cookies.remove("token")
          
          setUser(null);

          await fetch(`${BACKEND_URL}/logout`, {
            method: "POST",
            credentials: "include",
          });
        }
      });
  
      return () => unsubscribe();
    }, []);

    return (
      <AuthContext.Provider value={{ user, handleLogin, handleLogout }}>
        {loading && <LoadingSpinner overlay/>}
        {children}
      </AuthContext.Provider>
    );
};

export const UserAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
      throw new Error("useAuth must be used within an AuthContextProvider");
    }
    return context;
};