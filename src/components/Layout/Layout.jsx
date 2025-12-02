import styles from "./Layout.module.css";
// import Sidebar from "../Sidebar";
// import Navbar from "../Navbar";

export default function Layout({ children }) {
  return (
    <div className={styles.container}>
      {/* <Navbar /> */}
      <div className={styles.body}>
        {/* <Sidebar /> */}
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}
