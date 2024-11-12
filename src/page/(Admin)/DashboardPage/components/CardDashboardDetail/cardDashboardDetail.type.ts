import { LucideProps } from 'lucide-react';

export type CardDashboardDetailType = {
  item: {
    title: string;
    total: number | undefined;
    href: string;
    color: string;
    icon: React.ForwardRefExoticComponent<
      Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
    >;
  };
};