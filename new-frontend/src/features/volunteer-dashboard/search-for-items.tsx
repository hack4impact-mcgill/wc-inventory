import { useNavigate } from 'react-router-dom';
import { PackageSearch, PackageMinus, Shirt } from 'lucide-react';
import DashboardTile from "./components/dashboard-tile";

const SearchForItems = () => {
  const navigate = useNavigate();

  const tiles = [
    {
      icon: Shirt,
      title: "Locate an Item",
      bgColor: "bg-orange-500",
      hoverColor: "hover:bg-orange-600",
    },
    {
      icon: PackageSearch,
      title: "Locate a Box by ID",
      bgColor: "bg-gray-600",
      hoverColor: "hover:bg-gray-700",
      onClick: () => navigate("/box-search"),
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
            onClick={tile.onClick}
          />
        ))}
      </div>
    </div>
  );
};

export default SearchForItems;