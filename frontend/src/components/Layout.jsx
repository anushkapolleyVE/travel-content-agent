import Navbar from "./Navbar";

function Layout({ children }) {
  return (
    <>
      <Navbar />

      <div className="container">{children}</div>
    </>
  );
}

export default Layout;
