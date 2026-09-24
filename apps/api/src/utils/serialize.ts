import type { Types } from "mongoose";

// Converts a Mongo document (or lean object) into a plain object with `id`
// instead of `_id`, and strips Mongoose's internal `__v` field. Frontend
// types consistently expect `id`, so every controller response is shaped
// through this before being sent.
export function toClient<T extends Record<string, unknown>>(
  doc: (T & { _id: Types.ObjectId | string; __v?: number }) | null
): (Omit<T, never> & { id: string }) | null {
  if (!doc) return null;
  const obj = typeof (doc as any).toObject === "function" ? (doc as any).toObject() : { ...doc };
  const { _id, __v, ...rest } = obj;
  return { id: String(_id), ...rest } as any;
}

export function toClientList<T extends Record<string, unknown>>(
  docs: (T & { _id: Types.ObjectId | string; __v?: number })[]
) {
  return docs.map((d) => toClient(d)!);
}
