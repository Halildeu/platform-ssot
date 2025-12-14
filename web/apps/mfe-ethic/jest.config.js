module.exports = {
  testEnvironment: 'jsdom',
  // Test ortamı kurulduktan sonra bu dosyayı çalıştır.
  // Bu satırı güncelliyoruz.
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^mfe_shell/logic$': '<rootDir>/src/__mocks__/mfe-shell.ts',
  },
};