import { TrendingDown, TrendingUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface MetricCardProps {
  title: string;
  value: string | number;
  change: string;
  isPositive: boolean;
  description: string;
  subtitle: string;
}

interface SectionCardsProps {
  metrics?: MetricCardProps[];
}

const defaultMetrics: MetricCardProps[] = [
  {
    title: "Open positions",
    value: "0",
    change: "0",
    isPositive: true,
    description: "Loading...",
    subtitle: "Positions waiting to be filled",
  },
  {
    title: "Active candidates",
    value: "0",
    change: "0",
    isPositive: true,
    description: "Loading...",
    subtitle: "Total candidates in pipeline",
  },
  {
    title: "Time to hire",
    value: "0 days",
    change: "0",
    isPositive: false,
    description: "Loading...",
    subtitle: "Average time from application to offer",
  },
  {
    title: "Interview success",
    value: "0%",
    change: "0",
    isPositive: true,
    description: "Loading...",
    subtitle: "Interviews leading to offers",
  },
];

export function SectionCards({ metrics = defaultMetrics }: SectionCardsProps) {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {metrics.map((metric, index) => (
        <Card key={index} className="@container/card">
          <CardHeader>
            <CardDescription>{metric.title}</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {metric.value}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                {metric.isPositive ? <TrendingUp /> : <TrendingDown />}
                {metric.change}
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              {metric.description}{" "}
              {metric.isPositive ? (
                <TrendingUp className="size-4" />
              ) : (
                <TrendingDown className="size-4" />
              )}
            </div>
            <div className="text-muted-foreground">{metric.subtitle}</div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
