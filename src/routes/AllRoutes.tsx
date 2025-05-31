import { Route, Routes } from "react-router-dom";
import ScatterData from "../pages/ScatterData";
import TreeData from "../pages/TreeData";

const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ScatterData />} />
      <Route path="/tree" element={<TreeData />} />
    </Routes>
  );
};

export default AllRoutes;
