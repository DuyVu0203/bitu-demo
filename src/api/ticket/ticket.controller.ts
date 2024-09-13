import { NextFunction, Request, Response } from 'express';
import { IGetTicketByTime } from '@common/ticket/ticket.interface';
import { TicketService } from '@common/ticket/ticket.service';
import { statusCode } from '@config/errors';
import { APIError } from '@common/error/api.error';

export class TicketController {
    public static getAllTicket = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const listTicket = await TicketService.getAllTicket(req.body as IGetTicketByTime);

            if (listTicket) {
                res.sendJson({
                    data: listTicket,
                });
            }

            throw new APIError({
                message: 'Tickets are sold out',
                status: statusCode.SERVER_AUTH_ERROR,
                errorCode: statusCode.SERVER_AUTH_ERROR,
            });
        } catch (err) {
            next(err);
        }
    };
}
