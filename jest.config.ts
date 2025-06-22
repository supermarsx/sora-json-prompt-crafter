import type { Config } from 'jest'

const config: Config = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'jsdom',
  setupFiles: ['./jest.setup.ts'],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.app.json',
    },
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.app.json',
    },
  },
}

export default config
