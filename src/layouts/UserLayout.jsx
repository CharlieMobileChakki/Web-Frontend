import React from "react";
import Header from "../components/user/Header";
import Footer from "../components/user/Footer";
import WhatsAppButton from "../components/user/WhatsAppButton";

const UserLayout = ({ children }) => {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  );
};

export default UserLayout;
