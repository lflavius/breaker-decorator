import "mocha";

import chai, { expect } from "chai";
import cAP from "chai-as-promised";
chai.use(cAP);
import { useBreaker, withBreaker } from "../src";

class MockService {
  @useBreaker({
    timeout: 2000,
  }, () => Promise.reject("TIME"))
  public async getSomeJob(time: number): Promise<string> {
    return new Promise((res) => {
      setTimeout(() => {
        res("Hello");
      }, time);
    });
  }
}

class MockService2 {
  @useBreaker({
    timeout: 2000,
    resetTimeout: 3000
  }, () => Promise.reject("TIME"))
  public async getSomeJob(time: number): Promise<string> {
    return new Promise((res) => {
      setTimeout(() => {
        res("Hello");
      }, time);
    });
  }
}

class MockService3 {
  @useBreaker({
    timeout: 2000,
    resetTimeout: 3000
  })
  public async getSomeJob(time: number): Promise<string> {
    return new Promise((res) => {
      setTimeout(() => {
        res("Hello");
      }, time);
    });
  }
}

describe("Breaker Decorator", () => {
  it("Breaker Opens when timeout is reached", async function () {
    this.timeout(5000);
    const service = new MockService();
    return expect(service!.getSomeJob(2500)).to.be.rejectedWith("TIME");
  });
  it("Breaker Does Not Open", async () => {
    const service = new MockService2();
    return expect(await service!.getSomeJob(10)).to.equal("Hello");
  });
  it("Still works without fallback", async () => {
    const service = new MockService3();
    return expect(await service!.getSomeJob(10)).to.equal("Hello");
  });
});

describe("Breaker Clojure", () => {
  it("Breaker Opens when timeout is reached", async function () {
    this.timeout(5000);
    const service = (time: number) => new Promise((res) => {
      setTimeout(() => {
        res("HEY!")
      }, time);
    });
    const wB = withBreaker<number, string>({ timeout: 2000, resetTimeout: 3000}, () => Promise.reject("TIME"))(service);
    return expect(wB(2500)).to.be.rejectedWith("TIME");
  });
  it("Breaker Does Not Open", async () => {
    const service = (time: number) => new Promise((res) => {
      setTimeout(() => {
        res("Hello")
      }, time);
    });
    const wB = withBreaker<number, string>({ timeout: 2000, resetTimeout: 3000}, () => Promise.reject("TIME"))(service);
    return expect(await wB(10)).to.equal("Hello");
  });
});