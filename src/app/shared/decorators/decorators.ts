export function Memorize(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalGet = descriptor.get;

    descriptor.get = function () {
        if (!this.hasOwnProperty('__memorized__')) {
            Object.defineProperty(this, '__memorized__', {
                value: new Map(),
            });
        }

        return this.__memorized__.has(propertyKey) ?
            this.__memorized__.get(propertyKey) :
            (() => {
                const value = originalGet.call(this);
                this.__memorized__.set(propertyKey, value);
                return value;
            })();
    };
}
