import { afterEach, describe, expect, test, vi } from "vitest";

const ORIGINAL_DATA_SOURCE = process.env.NEXT_PUBLIC_MANDATESCORE_DATA_SOURCE;
const ORIGINAL_BASE_URL = process.env.NEXT_PUBLIC_MANDATESCORE_API_BASE_URL;

afterEach(() => {
  if (ORIGINAL_DATA_SOURCE === undefined) {
    delete process.env.NEXT_PUBLIC_MANDATESCORE_DATA_SOURCE;
  } else {
    process.env.NEXT_PUBLIC_MANDATESCORE_DATA_SOURCE = ORIGINAL_DATA_SOURCE;
  }

  if (ORIGINAL_BASE_URL === undefined) {
    delete process.env.NEXT_PUBLIC_MANDATESCORE_API_BASE_URL;
  } else {
    process.env.NEXT_PUBLIC_MANDATESCORE_API_BASE_URL = ORIGINAL_BASE_URL;
  }

  vi.resetModules();
});

describe("officials API repository selection", () => {
  test("defaults to mock repository when env is not set", async () => {
    delete process.env.NEXT_PUBLIC_MANDATESCORE_DATA_SOURCE;
    delete process.env.NEXT_PUBLIC_MANDATESCORE_API_BASE_URL;

    const api = await import("../officials");
    const { MockOfficialsRepository } = await import("../../repositories/mock-officials-repository");
    expect(api.getOfficialsRepository()).toBeInstanceOf(MockOfficialsRepository);
  });

  test("selects real repository when env data source is real", async () => {
    process.env.NEXT_PUBLIC_MANDATESCORE_DATA_SOURCE = "real";
    process.env.NEXT_PUBLIC_MANDATESCORE_API_BASE_URL = "https://api.example.test";

    const api = await import("../officials");
    const { RealOfficialsRepository } = await import("../../repositories/real-officials-repository");
    expect(api.getOfficialsRepository()).toBeInstanceOf(RealOfficialsRepository);
  });
});
