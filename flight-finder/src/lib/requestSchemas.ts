import { z } from "zod";

export const isoDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "YYYY-MM-DD形式で指定してください");

export const dateFlexibilitySchema = z
  .object({
    departDate: isoDateSchema,
    returnDate: isoDateSchema,
    departFlexDays: z.number().int().min(0).max(14),
    returnFlexDays: z.number().int().min(0).max(14),
    minStayDays: z.number().int().min(1).max(90).optional(),
    maxStayDays: z.number().int().min(1).max(90).optional(),
  })
  .refine((value) => value.departDate < value.returnDate, {
    message: "帰国日は出発日より後の日付を指定してください",
  });

export const passengerConditionsSchema = z.object({
  adults: z.number().int().min(1).max(9),
  cabinClass: z.enum(["economy", "premium_economy", "business", "first"]),
  checkedBaggage: z.enum(["unspecified", "required"]),
});

export const exploreRequestSchema = z.object({
  originIata: z.string().length(3),
  flex: dateFlexibilitySchema,
  currency: z.string().default("jpy"),
  maxDestinations: z.number().int().min(1).max(100).default(40),
});

export const detailRequestSchema = z.object({
  originIata: z.string().length(3),
  destinationIata: z.string().length(3),
  destinationCity: z.string().min(1),
  destinationCountry: z.string().min(1),
  flex: dateFlexibilitySchema,
  passengers: passengerConditionsSchema,
  currency: z.string().default("jpy"),
  maxDateCandidates: z.number().int().min(1).max(10).default(5),
});

export type ExploreRequest = z.infer<typeof exploreRequestSchema>;
export type DetailRequest = z.infer<typeof detailRequestSchema>;
