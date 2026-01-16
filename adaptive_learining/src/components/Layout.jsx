import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div>
      <Navbar />
      <div style={{ padding: 20 }}>{children}</div>
    </div>
  );
}
