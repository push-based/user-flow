import { confirmToProcess } from './confirm-to-process';
import { RcJson } from '../../types';
import prompt = require('./prompt');

jest.mock('./prompt');

describe('confirmToProcess', () => {
  const EMPTY_CONTEXT = {} as RcJson;
  const mockPrompt = 'Confirm should process?';
  const promptParamSpy = jest.spyOn(prompt, 'promptParam');
  const mockProcess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  })

  it('should check if precondition is met if one is given', async () => {
    const mockPrecondition = jest.fn();
    await confirmToProcess({
      prompt: mockPrompt,
      process: mockProcess,
      precondition: mockPrecondition,
    })(EMPTY_CONTEXT);
    expect(mockPrecondition).toHaveBeenCalled();
  });

  it('should not prompt if precondition is not met', async () => {
    await confirmToProcess({
      prompt: mockPrompt,
      process: mockProcess,
      precondition: () => false,
    })(EMPTY_CONTEXT);
    expect(promptParamSpy).not.toHaveBeenCalled();
  });

  it('should prompt if precondition is met', async () => {
    await confirmToProcess({
      prompt: mockPrompt,
      process: mockProcess,
      precondition: () => true,
    })(EMPTY_CONTEXT);
    expect(promptParamSpy).toHaveBeenCalled();
  });

  it('should prompt if no precondition is passed', async () => {
    await confirmToProcess({
      prompt: mockPrompt,
      process: mockProcess,
    })(EMPTY_CONTEXT);
    expect(promptParamSpy).toHaveBeenCalled();
  });

  it('should not process if prompt is denied', async () => {
    promptParamSpy.mockResolvedValue(false);
    await confirmToProcess({
      prompt: mockPrompt,
      process: mockProcess,
    })(EMPTY_CONTEXT);
    expect(mockProcess).not.toHaveBeenCalled();
  });

  it('should process if prompt is accepted', async () => {
    promptParamSpy.mockResolvedValue(true);
    await confirmToProcess({
      prompt: mockPrompt,
      process: mockProcess,
    })(EMPTY_CONTEXT);
    expect(mockProcess).toHaveBeenCalled();
  });
})
