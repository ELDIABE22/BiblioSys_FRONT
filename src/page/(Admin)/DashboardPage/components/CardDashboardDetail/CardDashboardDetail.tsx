import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { CardDashboardDetailType } from './cardDashboardDetail.type';

const CardDashboardDetail: React.FC<CardDashboardDetailType> = ({ item }) => {
  return (
    <Card className="w-full border-l-4 shadow-lg" style={{ borderLeftColor: item.color }}>
      <CardContent className="flex justify-between items-center p-4">
        <div className="flex flex-col">
          <p className="font-bold text-gray-800 uppercase">{item.title}</p>
          <span className="text-xl font-bold" style={{ color: item.color }}>
            {item.total}
          </span>
          <Link
            to={item.href}
            className="uppercase hover:underline"
            style={{ color: item.color }}
          >
            Ver detalles
          </Link>
        </div>
        <div
          className="p-4 rounded-full shadow-lg"
          style={{ backgroundColor: item.color }}
        >
          <item.icon color="#FFFFFF" size={24} />
        </div>
      </CardContent>
    </Card>
  );
};

export default CardDashboardDetail;
