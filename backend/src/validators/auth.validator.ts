import { z } from 'zod';

const deviceTypeEnum = z.enum(['ANDROID', 'IOS', 'WEB']);

export const registerSchema = z
  .object({
    firstName: z
      .string({ message: 'First name is required.' })
      .trim()
      .min(1, 'First name is required.')
      .max(50, 'First name must not exceed 50 characters.'),

    lastName: z
      .string({ message: 'Last name is required.' })
      .trim()
      .min(1, 'Last name is required.')
      .max(50, 'Last name must not exceed 50 characters.'),

    email: z
      .string({ message: 'Email is required.' })
      .trim()
      .toLowerCase()
      .email('Invalid email address.')
      .max(255, 'Email must not exceed 255 characters.'),

    password: z
      .string({ message: 'Password is required.' })
      .min(8, 'Password must be at least 8 characters.')
      .max(128, 'Password must not exceed 128 characters.')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter.')
      .regex(/[0-9]/, 'Password must contain at least one number.')
      .regex(
        /[^A-Za-z0-9]/,
        'Password must contain at least one special character.',
      ),

    confirmPassword: z.string({
      message: 'Confirm password is required.',
    }),

    countryId: z
      .number({ message: 'Country must be a number.' })
      .int('Country must be an integer.')
      .positive('Invalid country.')
      .optional(),

    stateId: z
      .number({ message: 'State must be a number.' })
      .int('State must be an integer.')
      .positive('Invalid state.')
      .optional(),

    lgaId: z
      .number({ message: 'LGA must be a number.' })
      .int('LGA must be an integer.')
      .positive('Invalid LGA.')
      .optional(),

    cityId: z
      .number({ message: 'City must be a number.' })
      .int('City must be an integer.')
      .positive('Invalid city.')
      .optional(),

    townId: z
      .number({ message: 'Town must be a number.' })
      .int('Town must be an integer.')
      .positive('Invalid town.')
      .optional(),

    neighborhoodId: z
      .number({ message: 'Neighborhood must be a number.' })
      .int('Neighborhood must be an integer.')
      .positive('Invalid neighborhood.')
      .optional(),

    latitude: z
      .number()
      .min(-90, 'Latitude must be between -90 and 90.')
      .max(90, 'Latitude must be between -90 and 90.')
      .optional(),

    longitude: z
      .number()
      .min(-180, 'Longitude must be between -180 and 180.')
      .max(180, 'Longitude must be between -180 and 180.')
      .optional(),

    notificationEnabled: z.boolean().optional(),

    deviceName: z
      .string()
      .max(100, 'Device name must not exceed 100 characters.')
      .optional(),

    deviceType: deviceTypeEnum.optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  })
  .superRefine((data, ctx) => {
    const hasFullHierarchy =
      data.stateId !== undefined &&
      data.lgaId !== undefined &&
      data.cityId !== undefined &&
      data.townId !== undefined &&
      data.neighborhoodId !== undefined;

    const hasCoordinates =
      data.latitude !== undefined && data.longitude !== undefined;

    if (!hasFullHierarchy && !hasCoordinates) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          'Provide either the full location hierarchy (stateId, lgaId, cityId, townId, neighborhoodId) or GPS coordinates (latitude, longitude).',
        path: ['stateId'],
      });
    }

    if (hasFullHierarchy && hasCoordinates) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          'Provide either location IDs or GPS coordinates, not both.',
        path: ['latitude'],
      });
    }
  });

export type RegisterInput = z.infer<typeof registerSchema>;
