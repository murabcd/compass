import React from "react";

import { MoreHorizontal, CheckCircle, XCircle, MapPin, Briefcase } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Id } from "convex/_generated/dataModel";

interface Talents {
  _id: Id<"talent">;
  name: string;
  initials: string;
  avatarUrl: string;
  title: string;
  experience: number;
  country: string;
  vettedSkills: string[];
  description: string;
  salaryMonth: number;
  isVerified: boolean;
  isNotRecommended: boolean;
}

interface TalentCardProps {
  talent: Talents;
}

export function TalentCard({ talent }: TalentCardProps) {
  const formatSalary = (num: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4 space-y-3">
      <div className="flex justify-between items-start">
        <div className="flex gap-4">
          <Avatar className="w-12 h-12">
            <AvatarImage src={talent.avatarUrl} alt={talent.name} />
            <AvatarFallback>{talent.initials}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">{talent.name}</h3>
              {talent.isVerified && <CheckCircle className="w-5 h-5 text-green-500" />}
              {talent.isNotRecommended && <XCircle className="w-5 h-5 text-red-500" />}
            </div>
            <p className="text-sm text-muted-foreground">{talent.title}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Briefcase className="w-3 h-3" />
              <span>Exp: {talent.experience} years</span>
              <MapPin className="w-3 h-3" />
              <span>{talent.country}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold">
            {formatSalary(talent.salaryMonth)}/month
          </p>
          <Button variant="ghost" size="icon" className="w-8 h-8">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div>
        <span className="text-sm font-medium">Vetted skills:</span>
        <div className="flex flex-wrap gap-2 mt-1">
          {talent.vettedSkills.slice(0, 3).map((skill) => (
            <Badge key={skill} variant="secondary">
              {skill}
            </Badge>
          ))}
          {talent.vettedSkills.length > 3 && (
            <Badge variant="outline">+{talent.vettedSkills.length - 3}</Badge>
          )}
        </div>
      </div>
      <p className="text-sm text-muted-foreground">{talent.description}</p>
    </div>
  );
}

export function TalentCardSkeleton() {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg border bg-gradient-to-r from-primary/5 to-card dark:bg-card">
      <div className="flex-1 min-w-0 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <Skeleton className="h-5 w-48" />
        </div>

        {/* Main content */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Skills */}
          <div className="flex flex-wrap items-center gap-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-14" />
          </div>

          {/* Job details */}
          <div className="flex flex-wrap items-center gap-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-28" />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="ml-4">
        <Skeleton className="h-8 w-8 rounded" />
      </div>
    </div>
  );
}
