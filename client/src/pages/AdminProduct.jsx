import { Link } from "react-router-dom";

const AdminLink = ({ isMobile = false }) => (
  <Link
    to="/ventas"
    className={`${
      isMobile ? "block px-3 py-2" : ""
    } text-green-600 hover:text-green-700 font-medium tracking-wide transition-colors duration-200`}
  ></Link>
);

export default AdminLink;
