import { TrendingDown, TrendingUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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
  metrics: {
    openPositions: number;
    activeCandidates: number;
    averageTimeToHire: number;
    interviewSuccessRate: number;
  } | null;
  isLoading?: boolean;
}

function MetricCardSkeleton() {
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>
          <Skeleton className="h-4 w-24" />
        </CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          <Skeleton className="h-8 w-16" />
        </CardTitle>
        <CardAction>
          <Skeleton className="h-6 w-16 rounded-full" />
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="text-muted-foreground">
          <Skeleton className="h-4 w-48" />
        </div>
      </CardFooter>
    </Card>
  );
}

export function SectionCards({ metrics, isLoading = false }: SectionCardsProps) {
  const getMetricsData = (): MetricCardProps[] => {
    if (!metrics) {
      return [
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
    }

    return [
      {
        title: "Open positions",
        value: metrics.openPositions,
        change: metrics.openPositions > 0 ? "+2" : "0",
        isPositive: true,
        description:
          metrics.openPositions === 0 ? "No open positions" : "Active job postings",
        subtitle: "Positions waiting to be filled",
      },
      {
        title: "Active candidates",
        value: metrics.activeCandidates,
        change: metrics.activeCandidates > 0 ? "+5" : "0",
        isPositive: true,
        description:
          metrics.activeCandidates === 0
            ? "No active candidates"
            : "Candidates in pipeline",
        subtitle: "Total candidates in pipeline",
      },
      {
        title: "Time to hire",
        value: `${metrics.averageTimeToHire} days`,
        change: "−2 days",
        isPositive: false,
        description:
          metrics.averageTimeToHire > 0 ? "Average hiring time" : "No hiring data",
        subtitle: "Average time from application to offer",
      },
      {
        title: "Interview success",
        value: `${metrics.interviewSuccessRate}%`,
        change: "+5%",
        isPositive: true,
        description:
          metrics.interviewSuccessRate > 0 ? "Success rate" : "No interview data",
        subtitle: "Interviews leading to offers",
      },
    ];
  };

  const metricsData = getMetricsData();

  if (isLoading) {
    return (
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <MetricCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {metricsData.map((metric, index) => (
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
