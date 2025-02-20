import {
  PackageMinus,
  PackageOpen,
  PackagePlus,
  PackageSearch,
} from "lucide-react";
import DashboardTile from "./components/dashboard-tile";

const VolunteerDashboard = () => {
  const tiles = [
    {
      icon: PackageSearch,
      title: "Search for items",
      bgColor: "bg-green-500",
      hoverColor: "hover:bg-green-600",
    },
    {
      icon: PackageMinus,
      title: "Move Box",
      bgColor: "bg-blue-500",
      hoverColor: "hover:bg-blue-600",
    },
    {
      icon: PackageOpen,
      title: "Open / Move Box Upstairs",
      bgColor: "bg-purple-500",
      hoverColor: "hover:bg-purple-600",
    },
    {
      icon: PackagePlus,
      title: "Create box",
      bgColor: "bg-red-500",
      hoverColor: "hover:bg-red-600",
    },
  ];

  return (
    <div className="p-4 h-[calc(100vh-120px)]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
        {tiles.map((tile, index) => (
          <DashboardTile
            key={index}
            icon={tile.icon}
            title={tile.title}
            bgColor={tile.bgColor}
            hoverColor={tile.hoverColor}
          />
        ))}
      </div>
    </div>
  );
};

export default VolunteerDashboard;
