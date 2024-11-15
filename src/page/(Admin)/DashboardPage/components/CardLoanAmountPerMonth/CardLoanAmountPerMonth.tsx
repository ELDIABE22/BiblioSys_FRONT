import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Separator } from '@/components/ui/separator';
import React from 'react';
import { CardLoanAmountPerMonthProps } from './cardLoanAmountPerMonth.type';

const chartConfig = {
  total: {
    label: 'Total',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

const CardLoanAmountPerMonth: React.FC<CardLoanAmountPerMonthProps> = ({
  loanAmountPerMonth,
}) => {
  return (
    <Card className="shadow-lg">
      <CardHeader className="items-center">
        <CardTitle className="uppercase font-bold text-md sm:text-2xl">
          Cantidad Prestamos Por Mes
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-full max-h-[450px]"
        >
          <BarChart
            accessibilityLayer
            data={loanAmountPerMonth}
            margin={{
              top: 30,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="mes"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="total" radius={8}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default CardLoanAmountPerMonth;
