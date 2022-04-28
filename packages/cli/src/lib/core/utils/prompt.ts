import { prompt } from 'enquirer';

export async function promptParam<T>(cfg: {initial?: T, skip?: boolean, message: string, type?: any, [key: string]: any}): Promise<T> {
  let {type, initial,  message,skip,choices,result   } = cfg;
  type = type || 'input';

  const { param } = await prompt<{ param: T }>([
    {
      name: 'param',
      type,
      initial, message, skip, result
    }
  ]);

  return param;
}
