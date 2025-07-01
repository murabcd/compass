import { createFileRoute } from "@tanstack/react-router";

import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";

import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "../../../convex/_generated/api";

export const Route = createFileRoute("/dashboard/")({
  component: Dashboard,
});

function Dashboard() {
  const { data: metrics, isLoading: metricsLoading } = useQuery(
    convexQuery(api.dashboard.getDashboardMetrics, {})
  );

  const { data: candidates, isLoading: candidatesLoading } = useQuery(
    convexQuery(api.candidates.getRecentCandidates, {})
  );

  const { data: chartData, isLoading: chartLoading } = useQuery(
    convexQuery(api.dashboard.getChartData, {})
  );

  // Transform candidates data for the table
  const tableData =
    candidates?.map((candidate: any) => ({
      _id: candidate._id,
      name: candidate.name,
      email: candidate.email,
      phone: candidate.phone,
      status: candidate.status,
      jobTitle: candidate.jobTitle,
    })) || [];

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards metrics={metrics || null} isLoading={metricsLoading} />
          <div className="px-4 lg:px-6">
            <ChartAreaInteractive data={chartData} isLoading={chartLoading} />
          </div>
          <DataTable data={tableData} isLoading={candidatesLoading} />
        </div>
      </div>
    </div>
  );
}
