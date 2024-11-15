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
import { CardLoanAmountPerDayProps } from './cardLoanAmountPerDay.type';

const chartConfig = {
  total: {
    label: 'Total',
  }
} satisfies ChartConfig;

const CardLoanAmountPerDay: React.FC<CardLoanAmountPerDayProps> = ({
  loanAmountPerDay,
}) => {
  return (
    <Card className="flex flex-col shadow-lg w-full">
      <CardHeader className="items-center pb-5">
        <CardTitle className="uppercase font-bold text-md sm:text-2xl">
          Cantidad Prestamos Por Dias
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
              content={<ChartTooltipContent nameKey="prestamos" hideLabel />}
            />
            <Pie
              data={loanAmountPerDay}
              dataKey="prestamos"
              labelLine={false}
              nameKey="dia"
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
                    {payload.prestamos}
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

export default CardLoanAmountPerDay;
