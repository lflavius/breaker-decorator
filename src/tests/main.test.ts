import { withBreaker } from "../functionDecorator";
import { Errors } from "./ErrorTypes";

import { ApiService } from "./apiService";

interface IService {
  timeout: number;
}

const callService = (time: number) => new Promise((res) => {
  setTimeout(() => {
    res("YAHMAN!!");
  }, time);
});

(async () => {
  const api = new ApiService();
  try {
    const data = await api.callTheApi({ age: 1500, name: "Flavius" });
    console.log("DATA", data);
    const data2 = await api.callTheApi({ age: 1500, name: "Flavius" });
    console.log("DATA", data2);

    const serviceBreaker = withBreaker<IService, string>({ 
      timeout: 4000, 
      errorThresholdPercentage: 50, 
      resetTimeout: 10000,
    },
    () => Promise.reject(Errors.ServiceDown)
    )(callService);
    const data3 = await serviceBreaker({ timeout: 1500 });
    console.log("DATAAA", data3);

  } catch (error) {
    console.log("ER", error);
  }
})();