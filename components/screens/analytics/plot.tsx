"use client";

import { createTimeSeries } from "@/components/plot/timeseries";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

interface TimeSeriesPlotProps {
  data: { date: string; count: number }[];
  title: string;
}

const TimeSeriesPlot: React.FC<TimeSeriesPlotProps> = ({ data, title }) => {
  const plotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (plotRef.current && data.length > 0) {
      createTimeSeries(data, plotRef.current);
    }
  }, [data]);

  return (
    <div
      className={cn(
        "border border-gray-800 rounded-md p-2 md:p-3 lg:p-4 col-span-2",
        "h-fit relative hidden md:block",
      )}
    >
      <p>{title}</p>
      <div ref={plotRef} />
    </div>
  );
};

export default TimeSeriesPlot;
