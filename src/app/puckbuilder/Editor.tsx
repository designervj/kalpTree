"use client";

import { Puck } from "@puckeditor/core";
import "@puckeditor/core/puck.css";
import { config } from "../puckconfig/config";

// Describe the initial data
const initialData = {};

// Save the data to your database
const save = (data: any) => {};

// Render Puck editor
export function Editor() {
  return <Puck config={config} data={initialData} onPublish={save} />;
}
