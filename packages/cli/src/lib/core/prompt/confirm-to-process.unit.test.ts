import { confirmToProcess } from './confirm-to-process';
import { RcJson } from '../../types';
import prompt = require('./prompt');

jest.mock('./prompt');

describe('confirmToProcess', () => {
  const EMPTY_CONTEXT = {} as RcJson;
  const mockPrompt = 'Confirm should process?';
  const promptParamSpy = jest.spyOn(prompt, 'promptParam');
  const mockProcess = jest.fn();
  const mockPrecondition = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  })

  it('should check if precondition is met', async () => {
    mockPrecondition.mockResolvedValue(false);
    await confirmToProcess({
      prompt: mockPrompt,
      process: mockProcess,
      precondition: mockPrecondition,
    })(CONTEXT);
    expect(mockPrecondition).toHaveBeenCalled();
  });

  it('should not prompt if precondition is not met', async () => {
    mockPrecondition.mockResolvedValue(false);
    await confirmToProcess({
      prompt: mockPrompt,
      process: mockProcess,
      precondition: mockPrecondition,
    })(CONTEXT);
    expect(mockPrecondition).toHaveBeenCalled();
    expect(promptParamSpy).not.toHaveBeenCalled();
  });

  it('should prompt if precondition is met', async () => {
    mockPrecondition.mockResolvedValue(true);
    await confirmToProcess({
      prompt: mockPrompt,
      process: mockProcess,
      precondition: mockPrecondition,
    })(CONTEXT);
    expect(mockPrecondition).toHaveBeenCalled();
    expect(promptParamSpy).toHaveBeenCalled();
  });

  it('should not process if prompt is denied', async () => {
    mockPrecondition.mockResolvedValue(true);
    promptParamSpy.mockResolvedValue(false);
    await confirmToProcess({
      prompt: mockPrompt,
      process: mockProcess,
      precondition: mockPrecondition,
    })(CONTEXT);
    expect(mockProcess).not.toHaveBeenCalled();
  });

  it('should process if prompt is accepted', async () => {
    mockPrecondition.mockResolvedValue(true);
    promptParamSpy.mockResolvedValue(false);
    await confirmToProcess({
      prompt: mockPrompt,
      process: mockProcess,
      precondition: mockPrecondition,
    })(CONTEXT);
    expect(mockProcess).not.toHaveBeenCalled();
  });
})
