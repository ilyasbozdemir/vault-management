import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import { Box } from "@chakra-ui/react";
import Loader from "./components/Loader";
import HorizontalMenu from "../../components/HorizontalMenu";
import { menuItems } from "../../constants/menuItems";

function AdminLayout({ children }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <>
      <div className="h-screen overflow-hidden">
        {loading ? (
          <>
            <Loader />
          </>
        ) : (
          <div className="flex flex-col h-full">
            {/* Navbar */}
            <Navbar />

            {/* Horizontal Menu */}
            <HorizontalMenu menuItems={menuItems} />

            {/* Main Content */}
            <Box as="main" zIndex={9} className="flex-1 overflow-y-auto overflow-x-hidden">
              <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                {children}
              </div>
            </Box>

            {/* Footer - Uncomment if needed */}
            {/* <Footer /> */}
          </div>
        )}
      </div>
    </>
  );
}

export default AdminLayout;
