import { prompt } from 'enquirer';

export async function promptParam<T>(cfg: {initial?: T, skip?: boolean, message: string, type?: string, [key: string]: any}): Promise<T> {
  let {initial, skip, type, message} = cfg;
  type = type || 'input';
  const { param } = await prompt<{ param: T }>([
    {
      name: 'param',
      type,
      message,
      initial,
      skip
    }
  ]);

  return param;
}
