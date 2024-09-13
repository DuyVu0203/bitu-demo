import {
    IBooking,
    IBookingIdUser,
    ICancelBooking,
    IConfirmBooking,
    IResponseBookingUser,
} from '@common/booking/booking.interface';
import { BookingService } from '@common/booking/booking.service';
import { NextFunction, Request, Response } from 'express';
import { APIError } from '@common/error/api.error';
import { statusCode } from '@config/errors';

export class BookingController {
    public static bookingTicket = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
        try {
            const booking = await BookingService.bookingTicket(req.body as IBooking);

            if (booking) {
                return res.sendJson({
                    data: booking,
                });
            }

            throw new APIError({
                message: 'Booking ticket missing',
                status: statusCode.SERVER_AUTH_ERROR,
                errorCode: statusCode.SERVER_AUTH_ERROR,
            });
        } catch (err) {
            next(err);
        }
    };

    public static confirmBooking = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
        try {
            const booking = await BookingService.confirmBooking(req.body as IConfirmBooking);
            if (booking) {
                return res.sendJson({
                    data: booking,
                });
            }

            throw new APIError({
                message: 'Confirm booking missing',
                status: statusCode.SERVER_AUTH_ERROR,
                errorCode: statusCode.SERVER_AUTH_ERROR,
            });
        } catch (err) {
            next(err);
        }
    };

    public static cancelBooking = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
        try {
            const booking = await BookingService.cancelBooking(req.body as ICancelBooking);

            if (booking) {
                return res.sendJson({
                    data: booking,
                });
            }

            throw new APIError({
                message: 'Cancel booking missing',
                status: statusCode.SERVER_AUTH_ERROR,
                errorCode: statusCode.SERVER_AUTH_ERROR,
            });
        } catch (err) {
            next(err);
        }
    };

    public static allBookingByUser = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
        try {
            const listBookingTicket = await BookingService.allBookingByUser(req.body as IBookingIdUser);

            if (listBookingTicket) {
                return res.sendJson({
                    data: listBookingTicket,
                });
            }

            throw new APIError({
                message: 'Something went wrong',
                status: statusCode.SERVER_AUTH_ERROR,
                errorCode: statusCode.SERVER_AUTH_ERROR,
            });
        } catch (err) {
            next(err);
        }
    };
}
