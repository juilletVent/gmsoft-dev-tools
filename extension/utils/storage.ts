class ExtensionsStorageUtils {
  static getConfig() {
    const getConfigProcess = new Promise<any>((resolve, reject) => {
      try {
        chrome.storage.sync.get("config", (res) => {
          resolve(res.config || {});
        });
      } catch (error) {
        resolve({});
      }
    });

    return getConfigProcess;
  }

  static setConfig(configObj: any) {
    try {
      ExtensionsStorageUtils.getConfig().then((config) => {
        const targetConfig = { ...config, ...configObj };
        chrome.storage.sync.set({ config: targetConfig });
      });
    } catch (error) {
      // 静默失败
    }
  }
}

export { ExtensionsStorageUtils };
