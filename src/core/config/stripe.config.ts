import { ConfigService } from '@nestjs/config'

import { TypeStripeOptions } from '@/src/modules/libs/stripe/types/stripe.types'

export function getStripeConfig(
	configService: ConfigService
): TypeStripeOptions {
	return {
		apiKey: configService.getOrThrow<string>('STRIPE_SECRET_KEY'),
		config: {
			apiVersion: '2025-02-24.acacia'
		}
	}
}
// This file is used to define the configuration for the Stripe module. 
// It exports a function `getStripeConfig` that takes a `ConfigService` as an argument and returns an object
// of type `TypeStripeOptions`. This object contains the API key for Stripe, which is retrieved from the environment 
// variables using the `ConfigService`, and a configuration object that specifies the API version to use.