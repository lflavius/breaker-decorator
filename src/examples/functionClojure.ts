import { withBreaker, IBreakerHooks } from "..";

const sleep = (time: number): Promise<void> => new Promise((res) => {
  setTimeout(() => {
    res();
  }, time);
});

const hooks: IBreakerHooks = {
  onOpen() {
    console.log("Breaker Is OPEN NOW!");
  },
  onClosed() {
    console.log("Breaker Is CLOSED NOW!");
  },
  onHalfOpen() {
    console.log("Breaker Is HALF OPENED NOW!");
  }
};

const getSomeJob = (time: number): Promise<string> => {
  return new Promise((res) => {
    setTimeout(() => {
      res("SERVICE OK! :D");
    }, time);
  });
}

(async () => {

    const jobWithBreaker = withBreaker<number, string>({ timeout: 2000, resetTimeout: 5000 }, () => Promise.reject("BIG ERRORR!"), hooks)(getSomeJob);

    console.log("BEGIN CALLING THE API!");
    const data = await jobWithBreaker(2500).catch(e => e);
    console.log("DATA: ", data);

    await sleep(3000);
    const data2 = await jobWithBreaker(1000).catch(e => e);
    console.log("DATA2: ", data2);

    await sleep(3500);
    const data3 = await jobWithBreaker(1000).catch(e => e);
    console.log("DATA3: ", data3);

    const data4 = await jobWithBreaker(2500).catch(e => e);
    console.log("DATA3: ", data4);

    const data5 = await getSomeJob(1000);
    console.log("DATA5: ", data5);
    

})();