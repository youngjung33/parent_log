import * as fields from '@keystone-6/core/fields';
import * as access from '@keystone-6/core/access';
import * as core from '@keystone-6/core';
import { BaseListTypeInfo } from "@keystone-6/core/src/types";
import { Label } from "../../common/Label";

/**
 * 관리자 모델
 */
export const AdminModel: core.ListConfig<BaseListTypeInfo> = core.list(
    {
        // 접근 권한
        access: {
            operation: {
                query: ({ session }) => {
                    return session?.data.authority >= 0;
                },
                create: ({ session }) => {
                    return session?.data.authority >= 4;
                },
                update: ({ session }) => {
                    return session?.data.authority >= 4;
                },
                delete: ({ session }) => {
                    return session?.data.authority >= 4;
                },
            },
        },
        hooks: {
            beforeOperation: async ({ operation, listKey, inputData }) => {
                console.log(operation, inputData, new Date(), listKey);
            },
            // afterOperation: logDatas
        },
        // 관리자페이지 UI
        ui: {
            listView: {
                initialSort: {
                    field: 'authority',
                    direction: 'DESC',
                },
                initialColumns: [
                    'username',
                    'password',
                    'name',
                    'division',
                    'position',
                    'authority',
                    'updatedAt',
                    'createdAt',
                ],
            },
            label: Label.ADMIN_USER,
        },

        // 필드 선언
        fields: {
            // 아이디
            username: fields.text({
                validation: {
                    isRequired: true,
                },
                isIndexed: 'unique',
                label: Label.USERNAME,
            },
            ),

            // 비밀번호 (변경기한???)
            password: fields.password({
                validation: {
                    isRequired: true,
                },
                label: Label.PASSWORD,
            },
            ),

            // 이름
            name: fields.text({
                validation: {
                    isRequired: false,
                },
                label: Label.NAME,
            },
            ),

            // 보안권한 (0: 뷰어, 1: 생성자, 2: 수정자, 3: 관리자, 4: 마스터)
            authority: fields.select({
                options: [
                    {
                        label: Label.LEVEL_0,
                        value: 0,
                    },
                    {
                        label: Label.LEVEL_1,
                        value: 1,
                    },
                    {
                        label: Label.LEVEL_2,
                        value: 2,
                    },
                    {
                        label: Label.LEVEL_3,
                        value: 3,
                    },
                    {
                        label: Label.LEVEL_4,
                        value: 4,
                    },
                ],
                type: 'integer',
                defaultValue: 0,
                ui: { displayMode: 'segmented-control' },
                label: Label.AUTHORITY,
            },
            ),

            // 수정일
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

            // 생성일
            createdAt: fields.timestamp({
                defaultValue: {
                    kind: 'now',
                },
                label: Label.CREATED_AT,
            },
            ),
        }
    }
);