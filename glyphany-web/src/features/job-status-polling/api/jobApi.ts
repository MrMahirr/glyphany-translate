import { apiClient } from "../../../lib/http";
import { JobApiMethod } from "../../../constant/MethodNames";
import type { JobStatusResponse } from "../../../domain/job/jobDomains";

/**
 * Job API fonksiyonları.
 * Polling işlemi ve job iptal etme.
 */

export async function getJobStatus(jobId: string): Promise<JobStatusResponse> {
  const response = await apiClient.get<JobStatusResponse>(
    JobApiMethod.GET_STATUS.replace("{id}", jobId)
  );
  return response.data;
}

export async function cancelJob(jobId: string): Promise<void> {
  await apiClient.post(JobApiMethod.CANCEL.replace("{id}", jobId));
}
