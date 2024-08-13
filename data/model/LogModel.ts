import * as fields from '@keystone-6/core/fields';
import * as access from '@keystone-6/core/access';
import * as core from '@keystone-6/core';
import { BaseListTypeInfo } from "@keystone-6/core/src/types";
import { Label } from "../../common/Label";

/**
 * 로그 모델
 */
export const LogModel: core.ListConfig<BaseListTypeInfo> = core.list(
    {
        // 접근 권한
        access: {
            operation: {
                query: access.allowAll,
                create: access.allowAll,
                update: access.allowAll,
                delete: access.allowAll,
            }
        },
        // 관리자페이지 UI
        ui: {
            listView: {
                initialColumns: [
                    'user',
                    'device',
                    'body',
                    'createdAt',
                ],
                initialSort: { field: 'createdAt', direction: 'DESC' }
            },
            label: Label.LOG
        },
        hooks: {
            beforeOperation: async ({ operation, listKey, inputData }) => {
                console.log('bLog: ', operation, inputData, new Date(), listKey);
            },
            afterOperation: async ({ operation, listKey, inputData, item }) => {
                console.log('aLog: ', operation, inputData, new Date(), listKey, item?.id);
            }
        },
        // 필드 선언
        fields: {

            // 사용자
            user: fields.text({
                validation: {
                    isRequired: false,
                },
                label: Label.USERNAME,
            },
            ),

            // 내용
            device: fields.text({
                validation: {
                    isRequired: false,
                },
                label: Label.DEVICE,
            },
            ),

            // 내용
            body: fields.json({
                label: Label.BODY,
            },
            ),

            // 내용
            content: fields.text({
                validation: {
                    isRequired: false,
                },
                label: Label.CONTENT,
            },
            ),

            // 라우트
            route: fields.text({
                validation: {
                    isRequired: false,
                },
                label: Label.ROUTE
            },
            ),

            // 생성일
            createdAt: fields.timestamp({
                defaultValue: {
                    kind: 'now',
                },
                label: Label.CREATED_AT,
            },
            ),
            // 생성일
            updatedAt: fields.timestamp({
                db: {
                    updatedAt: true,
                },
                defaultValue: {
                    kind: 'now',
                },
                label: Label.UPDATED_AT,
            },
            ),
        }
    }
);