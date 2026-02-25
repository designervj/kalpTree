"use client";

import { Puck } from "@puckeditor/core";
import "@puckeditor/core/puck.css";
import { config } from "../puckconfig/config";
import { newconfig } from "../puckconfig/newconfig";

// Describe the initial data
const initialData = {};

// Save the data to your database
const save = (data: any) => {
  console.log(data);
};

// Render Puck editor
export function Editor() {
  return <Puck config={newconfig} data={initialData} onPublish={save} />;
}
