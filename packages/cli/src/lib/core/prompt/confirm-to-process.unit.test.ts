import { confirmToProcess } from './confirm-to-process';
import { RcJson } from '../../types';
import prompt = require('./prompt');

jest.mock('./prompt');

describe('confirmToProcess', () => {
  const EMPTY_CONTEXT = {} as RcJson;
  const MOCK_PROMPT = 'Confirm should process?';

  beforeEach(() => {
    jest.clearAllMocks();
  })

  it('should check if precondition is met if one is given', async () => {
    const mockPrecondition = jest.fn();
    await confirmToProcess({
      prompt: MOCK_PROMPT,
      process: jest.fn(),
      precondition: mockPrecondition,
    })(EMPTY_CONTEXT);
    expect(mockPrecondition).toHaveBeenCalled();
  });

  it('should not prompt if precondition is not met', async () => {
    const promptParamSpy = jest.spyOn(prompt, 'promptParam');
    await confirmToProcess({
      prompt: MOCK_PROMPT,
      process: jest.fn(),
      precondition: () => false,
    })(EMPTY_CONTEXT);
    expect(promptParamSpy).not.toHaveBeenCalled();
  });

  it('should prompt if precondition is met', async () => {
    const promptParamSpy = jest.spyOn(prompt, 'promptParam');
    await confirmToProcess({
      prompt: MOCK_PROMPT,
      process: jest.fn(),
      precondition: () => true,
    })(EMPTY_CONTEXT);
    expect(promptParamSpy).toHaveBeenCalled();
  });

  it('should prompt if no precondition is passed', async () => {
    const promptParamSpy = jest.spyOn(prompt, 'promptParam');
    await confirmToProcess({
      prompt: MOCK_PROMPT,
      process: jest.fn(),
    })(EMPTY_CONTEXT);
    expect(promptParamSpy).toHaveBeenCalled();
  });

  it('should not process if prompt is denied', async () => {
    jest.spyOn(prompt, 'promptParam').mockResolvedValue(false);
    const processSpy = jest.fn();
    await confirmToProcess({
      prompt: MOCK_PROMPT,
      process: processSpy,
    })(EMPTY_CONTEXT);
    expect(processSpy).not.toHaveBeenCalled();
  });

  it('should process if prompt is accepted', async () => {
    jest.spyOn(prompt, 'promptParam').mockResolvedValue(true);
    const processSpy = jest.fn();
    await confirmToProcess({
      prompt: MOCK_PROMPT,
      process: processSpy,
    })(EMPTY_CONTEXT);
    expect(processSpy).toHaveBeenCalled();
  });
})
