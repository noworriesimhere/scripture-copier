module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    globals: {
      chrome: {
        runtime: {}
      }
    }
  };
  