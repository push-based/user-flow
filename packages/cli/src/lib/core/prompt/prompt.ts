import Enquirer from 'enquirer';

export async function promptParam<T>(cfg: {initial?: T, skip?: boolean, message: string, type?: string, result?: (value: string) => string}): Promise<T> {
  const { type, initial, message, skip, result } = cfg;

  const { param } = await Enquirer.prompt<{ param: T }>([{
    name: 'param',
    type: type || 'input',
    initial,
    message,
    skip,
    result
  }]);

  return param;
}
