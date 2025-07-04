import React, { useState } from "react";

import { createFileRoute } from "@tanstack/react-router";

import { Filter, Heart, ChevronRight, ListFilter, Users, Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import { TalentCard, TalentCardSkeleton } from "@/components/talent-card";

import { usePaginatedQuery } from "convex/react";
import { api } from "convex/_generated/api";

export const Route = createFileRoute("/talents/")({
  component: SearchComponent,
});

function SearchComponent() {
  const [search, setSearch] = useState("");
  const {
    results: talent,
    status,
    loadMore,
  } = usePaginatedQuery(
    api.talents.getTalent,
    { talents: search },
    { initialNumItems: 5 }
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const isLoading = status === "LoadingFirstPage";

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="ex: react native developer with 4 years of experience and a passion for startups."
                className="w-full pl-10 pr-4 py-2 text-base rounded-full"
                value={search}
                onChange={handleSearchChange}
              />
            </div>
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2">
                <Button variant="outline" className="gap-2">
                  <Filter className="w-4 h-4" />
                  <span>Filters</span>
                </Button>
                <Button variant="outline" className="gap-2">
                  <ListFilter className="w-4 h-4" />
                  <span>Sort by</span>
                </Button>
              </div>
              <Button variant="ghost" className="gap-2">
                <Heart className="w-4 h-4" />
                <span>View favorites</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="px-4 lg:px-6">
            <div className="flex flex-col gap-3">
              {isLoading &&
                Array.from({ length: 5 }).map((_, i) => <TalentCardSkeleton key={i} />)}

              {!isLoading && talent.length === 0 && (
                <EmptyState
                  icon={Users}
                  title="No results found"
                  description="Try adjusting your search or filters to find what you're looking for."
                  actionLabel="Clear search"
                  onAction={() => setSearch("")}
                />
              )}

              {talent.map((t) => (
                <TalentCard key={t._id} talent={t} />
              ))}

              {status === "CanLoadMore" && (
                <Button variant="outline" className="w-full" onClick={() => loadMore(5)}>
                  Load More
                </Button>
              )}
              {status === "LoadingMore" && (
                <Button variant="outline" className="w-full" disabled>
                  Loading...
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
