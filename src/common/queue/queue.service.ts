import { RedisAdapter } from '@common/infrastructure/redis.adapter';
import BullQueue, { Queue } from 'bull';

export class QueueService {
    private static queues: Map<string, Queue> = new Map<string, Queue>();

    public static async getQueue<T = unknown>(jobName: string): Promise<Queue> {
        let queue = QueueService.queues.get(jobName);

        if (!queue) {
            queue = new BullQueue<T>(jobName, await RedisAdapter.getQueueOptions());

            queue.on('error', (error) => console.error(error));
            QueueService.queues.set(jobName, queue);
        }

        return queue;
    }
}
