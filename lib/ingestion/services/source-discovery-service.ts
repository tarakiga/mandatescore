export type DiscoveredSource = {
  readonly sourceRegistryId: string;
  readonly sourceUrl: string;
  readonly sourcePublishedAt: string;
};

export class SourceDiscoveryService {
  public async discover(seedUrls: readonly string[]): Promise<readonly DiscoveredSource[]> {
    const now = new Date().toISOString();
    return seedUrls.map((url, index) => ({
      sourceRegistryId: `registry-${index + 1}`,
      sourceUrl: url,
      sourcePublishedAt: now
    }));
  }
}
