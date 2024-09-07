import React, { createContext, useContext, useState, useEffect } from "react";
import {
  onAuthStateChanged,
  getIdToken,
  signInWithCustomToken,
  signOut,
} from "firebase/auth";
import { auth } from "../../firebase";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import Loader from "../layouts/Admin/components/Loader";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUser = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      return { uid, ...userDoc.data() };
    } catch (error) {
      console.error("User fetch error:", error);
      return null;
    }
  };

  const initializeAuth = async () => {
    const token = Cookies.get("token");
    if (token) {
      try {
        const userCredential = await signInWithCustomToken(auth, token);
        const user = await fetchUser(userCredential.user.uid);
        setUser(user);
      } catch (error) {
        console.error("Token authentication error:", error);
        Cookies.remove("token");
        setUser(null);
      }
    } else {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          try {
            const token = await getIdToken(user);
            Cookies.set("token", token, { expires: 7 });
            const fetchedUser = await fetchUser(user.uid);
            setUser(fetchedUser);
          } catch (error) {
            console.error("Error getting ID token:", error);
            setUser(null);
          }
        } else {
          Cookies.remove("token");
          setUser(null);
        }
        setLoading(false);
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    initializeAuth();
  }, []);

  useEffect(() => {
    if (!loading && !user && router.pathname !== "/login" && router.pathname !== "/setup") {
      const redirectUrl = encodeURIComponent(router.asPath);
      router.replace(`/login?redirect_url=${redirectUrl}`);
    } else if (!loading && user && router.query.redirect_url) {
      const redirectUrl = decodeURIComponent(router.query.redirect_url);
      router.replace(redirectUrl);
    }
  }, [user, loading, router]);

  // Add a new effect to monitor user state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        Cookies.remove("token");
        setUser(null);
        if (router.pathname !== "/login") {
          router.replace("/login");
        }
      } else {
        const token = await getIdToken(firebaseUser);
        Cookies.set("token", token, { expires: 7 });
      }
    });

    return () => unsubscribe();
  }, [router]);

  const loginUser = async (customToken) => {
    setLoading(true);
    try {
      const userCredential = await signInWithCustomToken(auth, customToken);
      const user = await fetchUser(userCredential.user.uid);
      const token = await getIdToken(userCredential.user);
      Cookies.set("token", token, { expires: 7 });
      setUser(user);

      if (router.query.redirect_url) {
        const redirectUrl = decodeURIComponent(router.query.redirect_url);
        router.replace(redirectUrl);
      } else {
        router.replace("/");
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      Cookies.remove("token");
      setUser(null);
      router.replace("/login");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <AuthContext.Provider value={{ user, setUser, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
export const useAuth = () => useContext(AuthContext);
