import CircuitBreaker, { 
  Options 
} from "opossum";


export interface IBreakerHooks {
  onOpen?: () => void;
  onClosed?: () => void;
  onHalfOpen?: () => void;
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

export const withBreaker = <T, K>(breakerOptions: CircuitBreaker.Options, fallback?: any, hooks?: IBreakerHooks) => {
  return (callback: any) => {
    const breaker = new CircuitBreaker<unknown[],K>(callback, breakerOptions);

    if(fallback)
      breaker.fallback(fallback);

    if(hooks) {

      if(hooks.onOpen)
        breaker.on("open", hooks.onOpen);

      if(hooks.onHalfOpen)
        breaker.on("halfOpen", hooks.onHalfOpen);

      if(hooks.onClosed) 
        breaker.on("close", hooks.onClosed);
    } 

    return (args: T): Promise<K> => breaker.fire(args);
  }
}