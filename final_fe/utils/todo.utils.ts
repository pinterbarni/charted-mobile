/**
 * Placeholder function for unimplemented callbacks. Logs a TODO message to the console when called.
 * @param name - Name of the callback to implement
 * @returns A function that logs a TODO message
 * @example
 * onPress={todo('onPress')}
 */
export const todo = (name: string) => () => console.log(`TODO: implement ${name}`);

export const todoDumb = () => console.log('TODO: implement this');
