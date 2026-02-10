import { ObjectId } from "mongodb";

export interface GlobalStyleSettings {
    _id?: ObjectId | string;
    key?: string;
    tenantId?: ObjectId | string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    value?: {
        siteName?: string;
        tagline?: string;
    };
    globalStyle?: string;
}
