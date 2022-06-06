module.exports = {
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/config/**',
    '!<rootDir>/src/modules/**/dtos/**/*.ts',
    '!<rootDir>/src/**/*.module.ts',
  ],
  roots: ['<rootDir>/src', '<rootDir>/test'],
  transform: {
    '\\.ts': 'ts-jest',
  },
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  clearMocks: true,
};
