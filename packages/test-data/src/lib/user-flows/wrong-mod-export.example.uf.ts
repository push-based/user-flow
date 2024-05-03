export const WRONG_MOD_EXPORT_USERFLOW_NAME = 'wrong-ext.example.uf.ts';
export const WRONG_MOD_EXPORT_USERFLOW_TITLE = WRONG_MOD_EXPORT_USERFLOW_NAME.slice(0, -3);
export const WRONG_MOD_EXPORT_USERFLOW_CONTENT = `
export default {
  interactionas: async (ctx: Record<string, any>): Promise<void> => {
    return Promise.reject();
  }
};
`;
