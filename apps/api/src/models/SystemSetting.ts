import { Schema, model } from "mongoose";

const systemSettingSchema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    value: { type: String, required: true },
  },
  { timestamps: true }
);

export const SystemSetting = model("SystemSetting", systemSettingSchema);
