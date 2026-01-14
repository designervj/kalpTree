import { ObjectId } from "mongodb";

export interface LLMModel{
    _id?:string| ObjectId;
    tenantId?:string;
    websiteId?:string;
    name?:string
    secreteKey?:string;
    isActive?:boolean
    model?:string
}


export const GPTModels = [
    "gpt-4o-mini-realtime-preview",
    "gpt-4o-mini-2024-07-18",
    "gpt-4-turbo",
    "gpt-4.1",
    "gpt-4",
    "gpt-5.1-2025-11-13",
    "gpt-5.2-pro",
    "gpt-5.1-codex-mini",
    "gpt-5.1-codex",
    "gpt-5.2-pro-2025-12-11",
    "gpt-5.1-codex-max",
    "gpt-5.1",
    "gpt-5.2-2025-12-11",
    "gpt-5.2",
    "gpt-5.1-chat-latest",
    "gpt-5.2-chat-latest"
] as const;

export type GPTModel = typeof GPTModels[number];