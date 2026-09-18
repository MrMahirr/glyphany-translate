"use client";

import { useState, useEffect, useCallback } from "react";
import { getJobStatus, cancelJob } from "../api/jobApi";
import type { JobStatusResponse, JobStatus } from "@/domain/job/jobDomains";
import { toast } from "react-hot-toast";

interface UseJobStatusPollingProps {
  jobId: string;
  intervalMs?: number;
}

export function useJobStatusPolling({ jobId, intervalMs = 2000 }: UseJobStatusPollingProps) {
  const [jobData, setJobData] = useState<JobStatusResponse | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isPolling, setIsPolling] = useState(true);

  const fetchStatus = useCallback(async () => {
    try {
      const data = await getJobStatus(jobId);
      setJobData(data);
      
      // Stop polling if the job reached a terminal state
      if (
        data.progress.status === "completed" || 
        data.progress.status === "failed" || 
        data.progress.status === "canceled"
      ) {
        setIsPolling(false);
      }
    } catch (err: any) {
      setError(err);
      setIsPolling(false);
    }
  }, [jobId]);

  useEffect(() => {
    // Initial fetch
    fetchStatus();

    // Polling interval
    let intervalId: NodeJS.Timeout;
    if (isPolling) {
      intervalId = setInterval(() => {
        fetchStatus();
      }, intervalMs);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [fetchStatus, isPolling, intervalMs]);

  const handleCancelJob = async () => {
    try {
      await cancelJob(jobId);
      setIsPolling(false);
      // Optimistically update the state to canceled
      if (jobData) {
        setJobData({
          ...jobData,
          progress: {
            ...jobData.progress,
            status: "canceled"
          }
        });
      }
    } catch (err: any) {
      console.error("Failed to cancel job", err);
      toast.error("Failed to cancel translation. Please try again.");
    }
  };

  return {
    jobData,
    error,
    isPolling,
    cancelJob: handleCancelJob,
  };
}
