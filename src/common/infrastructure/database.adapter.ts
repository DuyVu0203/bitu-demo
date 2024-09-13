import mongoose from 'mongoose';
import { MONGODB_URL } from '@config/environment';
import logger from '@common/logger';

export class DatabaseAdapter {
    public static async connection(): Promise<void> {
        try {
            await mongoose.connect(MONGODB_URL, {});
            logger.info('ConnectDB :: Sucess');
        } catch (err) {
            logger.info('Disconnect from mongodb successfully!');
            logger.error('ConnectDB:: Err', err);
        }
    }

    public static async disconnect(): Promise<void> {
        try {
            await mongoose.disconnect();
        } catch (err) {
            logger.error('DisconnectDB:: Err', err);
        }
    }
}
