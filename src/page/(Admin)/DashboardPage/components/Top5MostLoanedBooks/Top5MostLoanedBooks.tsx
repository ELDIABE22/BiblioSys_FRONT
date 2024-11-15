import { Pie, PieChart } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Separator } from '@/components/ui/separator';
import React from 'react';
import { Top5MostLoanedBooksProps } from './top5MostLoanedBooks.type';

const chartConfig = {
  prestamos: {
    label: 'Prestamos',
  }
} satisfies ChartConfig;

const Top5MostLoanedBooks: React.FC<Top5MostLoanedBooksProps> = ({
  top5MostLoanedBooks,
}) => {
  return (
    <Card className="flex flex-col shadow-lg w-full">
      <CardHeader className="items-center pb-5">
        <CardTitle className="uppercase font-bold text-md sm:text-2xl">
          Top 5 Libros Más Prestados
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] pt-3"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent nameKey="total" hideLabel />}
            />
            <Pie
              data={top5MostLoanedBooks}
              dataKey="total"
              labelLine={false}
              nameKey="libro"
              label={({ payload, ...props }) => {
                return (
                  <text
                    cx={props.cx}
                    cy={props.cy}
                    x={props.x}
                    y={props.y}
                    textAnchor={props.textAnchor}
                    dominantBaseline={props.dominantBaseline}
                    fill="hsla(var(--foreground))"
                  >
                    {payload.total}
                  </text>
                );
              }}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default Top5MostLoanedBooks;
