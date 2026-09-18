export interface IQueueService {
  pushJob(queueName: string, jobData: any): Promise<void>;
}
