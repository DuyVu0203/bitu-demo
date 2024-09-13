import { BookingEvent } from '@common/booking/booking.event';
import { DatabaseAdapter } from '@common/infrastructure/database.adapter';
import { PORT } from '@config/environment';
import { TicketCron } from '@common/ticket/ticket.cron';
import { TickerEvent } from '@common/ticket/ticket.event';
import { UserEvent } from '@common/user/user.event';
import { ExpressServer } from '@api/server';
import { RedisAdapter } from '@common/infrastructure/redis.adapter';
import logger from '@common/logger';

export class Application {
    public static createApplication = async (): Promise<ExpressServer> => {
        await DatabaseAdapter.connection();
        await RedisAdapter.connect();

        Application.registerEvent();
        Application.registerCron();

        const expressServer = new ExpressServer();
        expressServer.setUp(PORT);

        Application.handleExit(expressServer);

        return expressServer;
    };

    public static registerEvent = () => {
        BookingEvent.register();
        TickerEvent.register();
        UserEvent.register();
    };

    public static registerCron = () => {
        TicketCron.register();
    };

    private static handleExit(express: ExpressServer) {
        process.on('uncaughtException', (err: unknown) => {
            logger.error('Uncaught exception', err);
            Application.shutdownProperly(1, express);
        });
        process.on('unhandledRejection', (reason: unknown | null | undefined) => {
            logger.error('Unhandled Rejection at promise', reason);
            Application.shutdownProperly(2, express);
        });
        process.on('SIGINT', () => {
            logger.info('Caught SIGINT, exitting!');
            Application.shutdownProperly(128 + 2, express);
        });
        process.on('SIGTERM', () => {
            logger.info('Caught SIGTERM, exitting');
            Application.shutdownProperly(128 + 2, express);
        });
        process.on('exit', () => {
            logger.info('Exiting process...');
        });
    }

    private static shutdownProperly(exitCode: number, express: ExpressServer) {
        Promise.resolve()
            .then(() => express.kill())
            .then(() => RedisAdapter.disconnect())
            .then(() => DatabaseAdapter.disconnect())
            .then(() => {
                logger.info('Shutdown complete, bye bye!');
                process.exit(exitCode);
            })
            .catch((err) => {
                logger.error('Error during shutdown', err);
                process.exit(1);
            });
    }
}
