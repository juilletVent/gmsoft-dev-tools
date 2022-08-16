class ExtensionsStorageUtils {
  static getConfig() {
    const getConfigProcess = new Promise<any>((resolve, reject) => {
      try {
        chrome.storage.sync.get("config", (res) => {
          resolve(res.config || {});
        });
      } catch (error) {
        const config = JSON.parse(
          window.localStorage.getItem("config") || "{}"
        );
        resolve(config);
      }
    });
    return getConfigProcess;
  }

  static setConfig(configObj: any) {
    ExtensionsStorageUtils.getConfig()
      .then((config) => {
        const targetConfig = { ...config, ...configObj };
        chrome.storage.sync.set({ config: targetConfig });
      })
      .catch(() => {
        ExtensionsStorageUtils.getConfig().then((config) => {
          const targetConfig = { ...config, ...configObj };
          window.localStorage.setItem("config", JSON.stringify(targetConfig));
        });
      });
  }
}

export { ExtensionsStorageUtils };
