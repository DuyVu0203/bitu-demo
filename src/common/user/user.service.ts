import { statusCode } from '@config/errors';
import eventbus from '@common/eventbus';
import bcrypt from 'bcrypt';
import { IUserResponse, IUserLogin, IUserRegister, IUserForgorPassword, IUserOTP } from './user.interface';
import { UserModel } from './user.model';
import { QueueService } from '@common/queue/queue.service';
import { EventContant } from '@common/contstant/event.contant';
import { JobContant } from '@common/contstant/job.contant';
import { APIError } from '@common/error/api.error';

export class UserService {
    public static login = async (data: IUserLogin): Promise<IUserResponse> => {
        try {
            const { phone, password } = data;
            if (phone && password) {
                const user = await UserModel.findOne({ phone });

                if (user) {
                    const checkPass = await bcrypt.compare(password, user.password);
                    if (checkPass) {
                        return user.transform();
                    } else {
                        throw new APIError({
                            message: 'Password Faild',
                            status: statusCode.AUTH_ACCOUNT_NOT_FOUND,
                            errorCode: statusCode.AUTH_ACCOUNT_NOT_FOUND,
                        });
                    }
                }
            }

            throw new APIError({
                message: 'Login Faild',
                status: statusCode.AUTH_ACCOUNT_NOT_FOUND,
                errorCode: statusCode.AUTH_ACCOUNT_NOT_FOUND,
            });
        } catch (err) {
            throw err;
        }
    };

    public static register = async (data: IUserRegister): Promise<IUserResponse> => {
        try {
            const { phone, username, password, email } = data;
            if (phone && username && password) {
                const user = await UserModel.findOne({
                    $or: [{ phone }, { email }],
                });

                if (!user) {
                    const slat = await bcrypt.genSalt(10);
                    const genderPass = await bcrypt.hash(password, slat);
                    const newUser = await UserModel.create({
                        phone,
                        username,
                        password: genderPass,
                        email,
                    });
                    await newUser.save();
                    return newUser.transform();
                }
            }

            throw new APIError({
                message: 'Register Faild',
                status: statusCode.REQUEST_NOT_FOUND,
                errorCode: statusCode.REQUEST_NOT_FOUND,
            });
        } catch (err) {
            throw err;
        }
    };

    public static forgotPassword = async (data: IUserForgorPassword): Promise<boolean> => {
        try {
            const user = await UserModel.findOne({ email: data.email });
            if (user) {
                eventbus.emit(EventContant.FORGOT_PASSWORD, { email: user.email, ip: data.ip } as IUserForgorPassword);
                return true;
            }
            return false;
        } catch (err) {
            throw err;
        }
    };

    public static verifyOTP = async (data: IUserOTP): Promise<unknown> => {
        try {
            const { otp, email, ip } = data;
            if (otp && ip && email) {
                const queue = await QueueService.getQueue(JobContant.JOB_FORGOT_PASSWORD);
                const idJob = email + '-' + ip;
                const job = await queue.getJob(idJob);

                if (job && job.data) {
                    if (job.data.otp === otp) {
                        const user = (await UserModel.findOne({ email })).transform();
                        if (user) {
                            await job.remove();
                            return user;
                        }
                    }
                }
            }
            return false;
        } catch (err) {
            throw err;
        }
    };
}
