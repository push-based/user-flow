import { describe, expect, it, beforeEach, vi } from 'vitest';
import { confirmToProcess } from './confirm-to-process.js';
import { RcJson } from '../../types.js';
import * as prompt from './prompt.js';

vi.mock('./prompt');

describe('confirmToProcess', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  })

  it('should check if precondition is met if one is given', async () => {
    const mockPrecondition = vi.fn();
    await confirmToProcess({
      prompt: 'Confirm should process?',
      process: vi.fn(),
      precondition: mockPrecondition,
    })({} as RcJson);
    expect(mockPrecondition).toHaveBeenCalled();
  });

  it('should not prompt if precondition is not met', async () => {
    const promptParamSpy = vi.spyOn(prompt, 'promptParam');
    await confirmToProcess({
      prompt: 'Confirm should process?',
      process: vi.fn(),
      precondition: () => false,
    })({} as RcJson);
    expect(promptParamSpy).not.toHaveBeenCalled();
  });

  it('should prompt if precondition is met', async () => {
    const promptParamSpy = vi.spyOn(prompt, 'promptParam');
    await confirmToProcess({
      prompt: 'Confirm should process?',
      process: vi.fn(),
      precondition: () => true,
    })({} as RcJson);
    expect(promptParamSpy).toHaveBeenCalled();
  });

  it('should prompt if no precondition is passed', async () => {
    const promptParamSpy = vi.spyOn(prompt, 'promptParam');
    await confirmToProcess({
      prompt: 'Confirm should process?',
      process: vi.fn(),
    })({} as RcJson);
    expect(promptParamSpy).toHaveBeenCalled();
  });

  it('should not process if prompt is denied', async () => {
    vi.spyOn(prompt, 'promptParam').mockResolvedValue(false);
    const processSpy = vi.fn();
    await confirmToProcess({
      prompt: 'Confirm should process?',
      process: processSpy,
    })({} as RcJson);
    expect(processSpy).not.toHaveBeenCalled();
  });

  it('should process if prompt is accepted', async () => {
    vi.spyOn(prompt, 'promptParam').mockResolvedValue(true);
    const processSpy = vi.fn();
    await confirmToProcess({
      prompt: 'Confirm should process?',
      process: processSpy,
    })({} as RcJson);
    expect(processSpy).toHaveBeenCalled();
  });
})
