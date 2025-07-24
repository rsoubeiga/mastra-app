import { weatherAgent } from './weather-agent';
import { config } from '../../config';

// Mock external dependencies
jest.mock('@ai-sdk/google', () => ({
  google: jest.fn(() => ({})),
}));

// Mock the actual classes and their constructors
const mockAgentConstructor = jest.fn();
const mockMemoryConstructor = jest.fn();
const mockLibSQLStoreConstructor = jest.fn();

jest.mock('@mastra/core/agent', () => ({
  Agent: jest.fn().mockImplementation((...args) => {
    mockAgentConstructor(...args);
    return {
      // Mock any methods that weatherAgent might call on Agent instance
    };
  }),
}));

jest.mock('@mastra/memory', () => ({
  Memory: jest.fn().mockImplementation((...args) => {
    mockMemoryConstructor(...args);
    return {
      // Mock any methods that Agent might call on Memory instance
    };
  }),
}));

jest.mock('@mastra/libsql', () => ({
  LibSQLStore: jest.fn().mockImplementation((...args) => {
    mockLibSQLStoreConstructor(...args);
    return {
      // Mock any methods that Memory might call on LibSQLStore instance
    };
  }),
}));

jest.mock('../tools/weather-tool', () => ({
  weatherTool: {
    description: 'mock weather tool',
    parameters: {},
    execute: jest.fn(),
  },
}));

jest.mock('../../config', () => ({
  config: {
    llm: { model: 'mock-model' },
    database: { url: 'mock-url' },
  },
}));

describe('weatherAgent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAgentConstructor.mockClear();
    mockMemoryConstructor.mockClear();
    mockLibSQLStoreConstructor.mockClear();
  });

  it('should be initialized with correct properties', () => {
    // Re-import weatherAgent to ensure mocks are applied before instantiation
    // This is necessary because weatherAgent is instantiated at module load time
    jest.resetModules();
    require('./weather-agent');

    expect(mockAgentConstructor).toHaveBeenCalledTimes(1);
    expect(mockAgentConstructor).toHaveBeenCalledWith({
      name: 'Weather Agent',
      instructions: expect.any(String),
      model: expect.any(Object),
      tools: { weatherTool: expect.any(Object) }, // Use expect.any(Object) for weatherTool
      memory: expect.any(Object), // Use expect.any(Object) for memory
    });

    expect(mockMemoryConstructor).toHaveBeenCalledTimes(1);
    expect(mockMemoryConstructor).toHaveBeenCalledWith({
      storage: expect.any(Object), // Use expect.any(Object) for storage
    });

    expect(mockLibSQLStoreConstructor).toHaveBeenCalledTimes(1);
    expect(mockLibSQLStoreConstructor).toHaveBeenCalledWith({
      url: 'mock-url',
    });
  });
});
