import { z } from "zod";

export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["MERCHANT", "CONSUMER"]).default("MERCHANT")
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export const storeSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
  latitude: z.number(),
  longitude: z.number(),
  hours: z.record(z.string(), z.string()).optional()
});

export const itemSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  category: z.string().optional(),
  imageUrl: z.string().url().optional()
});

export const inventorySchema = z.object({
  storeId: z.string().uuid(),
  itemId: z.string().uuid(),
  quantity: z.number().int().nonnegative()
});

export const searchSchema = z.object({
  query: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  radiusKm: z.number().optional(),
  limit: z.number().int().optional()
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type StoreInput = z.infer<typeof storeSchema>;
export type ItemInput = z.infer<typeof itemSchema>;
export type InventoryInput = z.infer<typeof inventorySchema>;
export type SearchInput = z.infer<typeof searchSchema>;
