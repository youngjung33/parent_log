import * as crypto from 'crypto';
import * as auth from '@keystone-6/auth';
import * as core_session from '@keystone-6/core/session';
import * as core from '@keystone-6/core';
// @ts-ignore
import * as type from '.keystone/types';
import dotenv from 'dotenv';
import bodyParser from "body-parser";
import { AdminModel } from "./data/model/AdminModel";
import { LogModel } from "./data/model/LogModel";
import { allLogApi } from './presenter/AllLogApi';

/**
 * 환경변수 설정
 */
dotenv.config();

/**
 * 모델 정의
 */
// @ts-ignore
export const modelList: type.Lists = {
    /**
     * 사용자 관련
     */
    // @ts-ignore
    AdminModel: AdminModel,  // @ts-ignore
    /**
     * 로그 관련
     */
    // @ts-ignore
    LogModel: LogModel,
}

/**
 * Session 관련 정의
 */
let sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret && process.env.NODE_ENV !== 'production') {
    sessionSecret = crypto.randomBytes(32).toString('hex');
}

const sessionMaxAge = 60 * 60 * 24 * 30;

const session = core_session.statelessSessions({
    maxAge: sessionMaxAge,
    secret: sessionSecret!,
});

/**
 * DataBase 유저 인증 정의
 */
const { withAuth } = auth.createAuth({
    listKey: 'AdminModel',
    identityField: 'username',
    sessionData: 'id,authority',
    secretField: 'password',
    initFirstItem: {
        fields: [
            'name',
            'username',
            'password',
            'authority',
        ],
    },
});

/**
 * KeystoneJS 설정
*/
export default withAuth(
    core.config({
        db: {
            // @ts-ignore
            provider: process.env.DB_TYPE,
            // @ts-ignore
            url: process.env.DB_URL,
            onConnect: async context => {
                console.log(new Date(), "DB Connected");
            },
            // enableLogging: true,
        },
        graphql: {
            debug: true,
            path: process.env.GRAPHQL,
            playground: process.env.PRODUCTION == 'true' ? true : false,
            apolloConfig: {
                formatError: (err) => {
                    if (err.message != 'Access denied') {
                        console.error(new Date(), 'Apollo Query Error: ', err);
                    }
                    return err;
                }
            }
        },
        storage: {
            imageStorage: {
                kind: 'local',
                type: 'image',
                generateUrl: path => `/images/${path}`,
                storagePath: 'public/images',
                serverRoute: {
                    path: '/images',
                }
            },
            fileStorage: {
                kind: 'local',
                type: 'file',
                generateUrl: path => `/school/${path}`,
                storagePath: 'public/school',
                serverRoute: {
                    path: '/school',
                }
            }
        },
        lists: (modelList),
        session: session,
        server: {
            options: {
                host: process.env.SERVER_HOST || 'localhost',
            },
            cors: { origin: ['*'], credentials: true },
            // @ts-ignore
            port: Number(process.env.SERVER_PORT),
            maxFileSize: 200 * 1024 * 1024 * 1024,

            extendExpressApp: (app, commonContext) => {
                app.use(bodyParser.json({ limit: "50mb" }));
                app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

                // Log 기록 Api
                allLogApi(app, commonContext);

                // 에러 핸들링
                app.use((err: any, req: any, res: any, next: any) => {
                    console.error(new Date(), err);

                    res.status(err.status || 500);
                    return res.json({ message: 'Error', error: err.message });
                });
            },

        },
    })
);
