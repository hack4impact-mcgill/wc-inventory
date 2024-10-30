import { type LucideIcon } from 'lucide-react';
import { type FC } from 'react';

interface DashboardTileProps {
    icon: LucideIcon;
    title: string;
    bgColor: string;
    hoverColor: string;
}

const DashboardTile: FC<DashboardTileProps> = ({
    icon: Icon,
    title,
    bgColor,
    hoverColor
}) => {
    return (
        <div className={`${bgColor} cursor-pointer rounded-lg shadow-lg flex flex-col items-center justify-center p-6 ${hoverColor} transition-colors`}>
            <Icon className="w-20 h-20 text-white mb-4" />
            <span className="text-2xl font-bold text-white">{title}</span>
        </div>
    );
};

export default DashboardTile;