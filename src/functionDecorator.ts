import CircuitBreaker, { 
  Options 
} from "opossum";

export const useBreaker = <T, K>(breakerOptions: Options, fallback?: Function) => {
  return function (t: any, p: any, descriptor: any) {
    const breaker = new CircuitBreaker<unknown[], K>(descriptor.value, breakerOptions);
    if(fallback)
      breaker.fallback(e => fallback(e));
    
    breaker.on("open", () => console.log("breaker Opened"));
    breaker.on("halfOpen", () => console.log("breaker halfOpen"));
    breaker.on("close", () => console.log("breaker Closed"));
    descriptor.value = function (args: T): Promise<K> {
      return breaker.fire(args);
    };
  }
}

export const withBreaker = <T, K>(breakerOptions: CircuitBreaker.Options, fallback?: any) => {
  return (callback: any) => {
    const breaker = new CircuitBreaker<unknown[],K>(callback, breakerOptions);
    breaker.fallback(fallback);
    return (args: T): Promise<K> => breaker.fire(args);
  }
}