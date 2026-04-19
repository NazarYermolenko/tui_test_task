import { test } from '@playwright/test';
import { logger, loggerContext } from './Logger';

/**
 * Information about a function parameter extracted from its string representation.
 */
interface ParamInfo {
    /** The name of the parameter as defined in the source code. */
    name: string;
    /** The default value of the parameter as a string, if present. */
    defaultValue?: string;
}

/**
 * Parses a function's string representation to extract parameter names and their default values.
 * Used to resolve {paramName} placeholders in @Step decorator messages.
 * 
 * @param func - The function to inspect.
 * @returns An array of ParamInfo objects describing the function's parameters.
 */
function getParams(func: Function): ParamInfo[] {
    const str = func.toString();
    const paramsStart = str.indexOf('(');
    const paramsEnd = str.indexOf(')');
    if (paramsStart === -1 || paramsEnd === -1) return [];
    
    const paramsStr = str.slice(paramsStart + 1, paramsEnd);
    return paramsStr.split(',').filter(p => p.trim()).map(p => {
        const [namePart, ...rest] = p.split('=');
        const name = (namePart || '').trim();
        const defaultValue = rest.length > 0 ? rest.join('=').trim().replace(/^['"](.*)['"]$/, '$1') : undefined;
        return { name, defaultValue };
    });
}

/**
 * A callback function that dynamically generates a step message based on the method execution context.
 * Useful for building complex messages that require access to the instance or specific arguments.
 * 
 * @template T - The type of the class instance the method belongs to.
 * @param instance - The instance of the class (the 'this' context).
 * @param args - The actual arguments passed to the decorated method.
 * @returns A string representing the step message, or a Promise that resolves to one.
 */
export type StepMessageCallback<T = any> = (instance: T, ...args: any[]) => string | Promise<string>;

/**
 * A decorator that wraps a method call in a Playwright `test.step` block and logs its execution.
 * 
 * The decorator handles both synchronous and asynchronous methods, and provides rich logging
 * by automatically resolving parameter placeholders in the message string.
 * 
 * Message resolution rules:
 * 1. If `message` is a function, it is called with (this, ...args) and its result is used.
 * 2. If `message` is a string, placeholders like `{0}` are replaced with the argument at that index.
 * 3. Named placeholders like `{paramName}` are replaced with the value of the parameter with that name.
 * 4. If a parameter is undefined but has a default value (e.g., `func(url = 'loc')`), the default is used.
 * 5. If no message is provided, it defaults to "Executing [methodName]".
 * 
 * @param message - An optional string template or a callback to generate the step message.
 * 
 * @example
 * ```typescript
 * class SearchPage {
 *   // 1. Positional argument placeholder
 *   @Step('Search for "{0}"') 
 *   async search(query: string) { ... }
 * 
 *   // 2. Named parameter placeholder
 *   @Step('Navigate to {url}') 
 *   async navigate(url: string) { ... }
 * 
 *   // 3. Default value resolution (uses 'home' if url is undefined)
 *   @Step('Open {url}') 
 *   async open(url: string = 'home') { ... }
 * 
 *   // 4. Multiple placeholders
 *   @Step('Fill form for {name} ({age} y.o.)') 
 *   async fill(name: string, age: number) { ... }
 * 
 *   // 5. Dynamic callback for complex logic
 *   @Step((instance, user) => `Login as ${user.name} (Role: ${user.role})`)
 *   async login(user: {name: string, role: string}) { ... }
 * 
 *   // 6. No message (defaults to "Executing methodName")
 *   @Step()
 *   async logout() { ... }
 * }
 * ```
 */
export function Step(message?: string | StepMessageCallback) {
    return function (originalMethod: any, context: any) {
        const methodName = String(context.name);
        const params = getParams(originalMethod);
        
        async function replacementMethod(this: any, ...args: any[]) {
            const className = typeof this === 'function' ? this.name : this.constructor.name;
            let msg: string;

            if (typeof message === 'function') {
                msg = await message(this, ...args);
            } else if (message) {
                msg = message.replace(/{(\w+)}/g, (match, key) => {
                    const index = parseInt(key, 10);
                    if (!isNaN(index) && index >= 0 && index < args.length) {
                        return String(args[index]);
                    }
                    
                    const paramIndex = params.findIndex(p => p.name === key);
                    if (paramIndex !== -1) {
                        const info = params[paramIndex];
                        const val = args[paramIndex];
                        if (val !== undefined) return String(val);
                        if (info && info.defaultValue !== undefined) return info.defaultValue;
                    }
                    return match;
                });
            } else {
                msg = `Executing ${methodName}`;
            }
            
            const stepName = `${className}.${methodName}: ${msg}`;
            
            return await test.step(stepName, async () => {
                logger.info(msg, { context: className, method: methodName });
                return await loggerContext.run({ context: className, method: methodName }, async () => {
                    return await originalMethod.apply(this, args);
                });
            });
        }

        return replacementMethod;
    };
}
