import { 
  useBreaker 
} from "../functionDecorator";

import {
  Errors
} from "./ErrorTypes";

export class ApiService {
  
  @useBreaker({ 
      timeout: 2000, 
      errorThresholdPercentage: 50, 
      resetTimeout: 10000,
    },
    () => Promise.reject(Errors.ServiceDown)
  )
  async callTheApi({ age, name }: { age: number, name: string }) {
    return new Promise((resolve, rej) => {
      setTimeout(() => {
        resolve("HelloWorld!!!");
      }, age);
    });
  }

}

