import { Link } from "react-router";

function Sidebar() {
  return (
    <div className="bg-black w-50 text-white flex flex-col justify-between  ">
      <div className="">
        <Link to={"/admin/videos"}>
          <div className="">videos</div>
        </Link>
        <Link to={"/admin/details"}>
          <div className="">details</div>
        </Link>
      </div>
      <div className="">logout</div>
    </div>
  );
}

export default Sidebar;
