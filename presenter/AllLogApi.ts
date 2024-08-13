import express from 'express';
import { BaseKeystoneTypeInfo, KeystoneContext } from "@keystone-6/core/types";

/**
 * Rest Api Log 기록
 */
export const allLogApi = async (app: express.Express, context: KeystoneContext<BaseKeystoneTypeInfo>) => {
    app.post('/api/log', async (req, res) => {
        try {
            const { user, device, body, content, route, createdAt } = req.body;

            await context.db.LogModel.createOne({
                data: {
                    user: user,
                    device: device,
                    body: body,
                    content: content,
                    route: route,
                    createdAt: createdAt,
                }
            })
            res.status(201).send('create log');
        } catch (error) {
            console.error(new Date(), error);
            return res.status(400).send('Invalid request');
        }
    })
}