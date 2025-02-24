interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  maxSize?: number; // Maximum number of items in cache
}

interface CacheItem<T> {
  value: T;
  timestamp: number;
}

class Cache<T> {
  private cache: Map<string, CacheItem<T>>;
  private ttl: number;
  private maxSize: number;

  constructor(options: CacheOptions = {}) {
    this.cache = new Map();
    this.ttl = options.ttl || 5 * 60 * 1000; // Default 5 minutes
    this.maxSize = options.maxSize || 100;
  }

  set(key: string, value: T): void {
    this.cleanup();

    if (this.cache.size >= this.maxSize) {
      // Remove oldest item if cache is full
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      value,
      timestamp: Date.now(),
    });
  }

  get(key: string): T | undefined {
    this.cleanup();

    const item = this.cache.get(key);
    if (!item) return undefined;

    return item.value;
  }

  has(key: string): boolean {
    this.cleanup();
    return this.cache.has(key);
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > this.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

// Create cache instances for different types of data
export const queryCache = new Cache<any>({ ttl: 5 * 60 * 1000 }); // 5 minutes
export const userCache = new Cache<any>({ ttl: 30 * 60 * 1000 }); // 30 minutes
export const staticCache = new Cache<any>({ ttl: 24 * 60 * 60 * 1000 }); // 24 hours

// Cache decorator for class methods
export function cached(
  cache: Cache<any>,
  keyPrefix: string = ''
): MethodDecorator {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const key = `${keyPrefix}:${propertyKey.toString()}:${JSON.stringify(args)}`;
      
      if (cache.has(key)) {
        return cache.get(key);
      }

      const result = await originalMethod.apply(this, args);
      cache.set(key, result);
      return result;
    };

    return descriptor;
  };
}

// React hook for cached data
export function useCachedData<T>(
  key: string,
  fetchData: () => Promise<T>,
  cache: Cache<T> = queryCache
): { data: T | undefined; refresh: () => Promise<void> } {
  const [, forceUpdate] = React.useState({});

  React.useEffect(() => {
    if (!cache.has(key)) {
      fetchData().then((data) => {
        cache.set(key, data);
        forceUpdate({});
      });
    }
  }, [key, fetchData]);

  const refresh = React.useCallback(async () => {
    const data = await fetchData();
    cache.set(key, data);
    forceUpdate({});
  }, [key, fetchData]);

  return {
    data: cache.get(key),
    refresh,
  };
} 