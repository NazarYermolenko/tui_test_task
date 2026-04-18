import { test } from '@playwright/test';
import { logger, loggerContext } from './Logger';

interface ParamInfo {
    name: string;
    defaultValue?: string;
}

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

export type StepMessageCallback<T = any> = (instance: T, ...args: any[]) => string | Promise<string>;

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
