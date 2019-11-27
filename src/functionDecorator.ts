import CircuitBreaker, { 
  Options 
} from "opossum";


export interface IBreakerHooks {
    onOpen?: () => void;
    onClosed?: () => void;
    onHalfOpen?: () => void;
    onTimeout?: (err?: Error) => void;
}

export const useBreaker = <T, K>(breakerOptions: Options, fallback?: Function, hooks?: IBreakerHooks) => {
  return function (t: any, p: any, descriptor: any) {
    const breaker = new CircuitBreaker<unknown[], K>(descriptor.value, breakerOptions);
    if(fallback)
      breaker.fallback(e => fallback(e));
    
    if(hooks) {

      if(hooks.onOpen)
        breaker.on("open", hooks.onOpen);

      if(hooks.onHalfOpen)
        breaker.on("halfOpen", hooks.onHalfOpen);

      if(hooks.onClosed) 
        breaker.on("close", hooks.onClosed);
    }  

    descriptor.value = function (args: T): Promise<K> {
      return breaker.fire(args);
    };
  }
}



export const withBreaker = <T, K>(breakerOptions: Options, fallback?: () => void, hooks?: IBreakerHooks) => {

    // this is a known issue in Typescript (https://github.com/microsoft/TypeScript/issues/1805). 
    // In order to get rid of it we should either have to write all possible overloads for callback
    // or disable the linter for this specific line
    // tslint:disable-next-line: no-any
    return (callback: (...arg: Array<any>) => Promise<K>) => {
        const breaker = new CircuitBreaker<Array<T>, K>(callback, breakerOptions);
        if (fallback)
            breaker.fallback(fallback);

        if (hooks) {
            if (hooks.onOpen)
                breaker.on("open", hooks.onOpen);

            if (hooks.onHalfOpen)
                breaker.on("halfOpen", hooks.onHalfOpen);

            if (hooks.onClosed)
                breaker.on("close", hooks.onClosed);

            if (hooks.onTimeout)
                breaker.on("timeout", hooks.onTimeout);

        }

        return (args: T): Promise<K> => breaker.fire(args);
    };
};
