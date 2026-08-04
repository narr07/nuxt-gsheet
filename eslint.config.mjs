// @ts-check
import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

// Run `npx @eslint/config-inspector` to inspect the resolved config interactively
export default createConfigForNuxt({
	features: {
		// Rules for module authors
		tooling: true,
		// Rules for formatting aligning with user stylistic preferences
		stylistic: {
			indent: 'tab',
			quotes: 'single',
			semi: false,
			commaDangle: 'never'
		}
	},
	dirs: {
		src: [
			'./playground'
		]
	}
})
	.append({
		rules: {
			// Allow console statements
			'no-console': 'off',
			// Disable tabs block rule to allow tab characters
			'@stylistic/no-tabs': 'off',
			// Disable strict typescript explicit-any warnings
			'@typescript-eslint/no-explicit-any': 'off',
			// Disable ts-ignore warnings
			'@typescript-eslint/ban-ts-comment': 'off',
			// Disable useless assignment warnings
			'no-useless-assignment': 'off',
			// Disable empty block statement warnings
			'no-empty': 'off'
		}
	})
