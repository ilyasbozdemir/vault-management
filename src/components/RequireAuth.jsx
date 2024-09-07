import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/router";
import Loader from "../layouts/Admin/components/Loader";

const RequireAuth = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      const redirectUrl = encodeURIComponent(router.asPath);
      router.replace(`/login?redirect_url=${redirectUrl}`);
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <Loader/>
  }

  return children;
};

export default RequireAuth;
