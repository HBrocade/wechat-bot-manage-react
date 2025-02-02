interface StorageData<T> {
  value: T;
  expires?: number;
}

export class LocalStorage {
  /**
   * 设置localStorage数据
   * @param key 键名
   * @param value 值
   * @param expires 过期时间（秒），不传则永不过期
   */
  static set<T>(key: string, value: T, expires?: number): void {
    const data: StorageData<T> = {
      value,
      expires: expires ? new Date().getTime() + expires * 1000 : undefined
    };
    localStorage.setItem(key, JSON.stringify(data));
  }

  /**
   * 获取localStorage数据
   * @param key 键名
   * @returns 存储的数据，如果已过期则返回null
   */
  static get<T>(key: string): T | null {
    const data = localStorage.getItem(key);
    if (!data) return null;

    try {
      const parsed = JSON.parse(data) as StorageData<T>;
      if (parsed.expires && new Date().getTime() > parsed.expires) {
        this.remove(key);
        return null;
      }
      return parsed.value;
    } catch {
      return null;
    }
  }

  /**
   * 移除localStorage数据
   * @param key 键名
   */
  static remove(key: string): void {
    localStorage.removeItem(key);
  }

  /**
   * 清空所有localStorage数据
   */
  static clear(): void {
    localStorage.clear();
  }

  /**
   * 获取所有未过期的数据
   * @returns 键值对对象
   */
  static getAll(): Record<string, any> {
    const result: Record<string, any> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = this.get(key);
        if (value !== null) {
          result[key] = value;
        }
      }
    }
    return result;
  }

  /**
   * 清除所有过期的数据
   */
  static clearExpired(): void {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        this.get(key); // 获取时会自动清除过期数据
      }
    }
  }
}