import { useCallback, useEffect, useState } from "react";
import { ConfigLayout, ContentLayout, NavLayout, OptionLayout } from "./style";
import OptionHeader from "./components/OptionHeader";
import SwitchBlock from "./components/SwitchBlock";
import ConfigNavBlock from "./components/ConfigNavBlock";
import ConfigBlock, { ConfigItem, RuleItem } from "./components/ConfigBlock";
import { message } from "antd";
import { cloneDeep, get, mapKeys, uniqueId } from "lodash";
import { ExtensionsStorageUtils } from "../../utils/storage";
import PasswordConfigBlock from "./components/PasswordConfigBlock";
import { alertError, toastSucc } from "../../components/popup";

function getConfigFile() {
  const input = document.createElement("input");
  input.type = "file";
  input.hidden = true;
  document.body.appendChild(input);

  const result = new Promise<any>((res) => {
    input.onchange = () => {
      const file = get(input, "files[0]");
      if (file) {
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = () => {
          document.body.removeChild(input);
          res(reader.result);
        };
      }
    };
    input.click();
  });

  return result;
}

function Options() {
  const [configs, setConfigs] = useState<ConfigItem[]>([]);
  const [currentConfig, setCurrentConfig] = useState<ConfigItem>();
  const onConfigAdd = useCallback(() => {
    const newConfig: ConfigItem = {
      key: `config-${Date.now()}`,
      title: "新建配置",
      cookiesPettern: [],
      rules: [
        {
          key: `item-${Date.now()}-${uniqueId()}`,
          domain: "",
          pattern: [],
          replaceParams: [],
        },
      ],
    };
    setConfigs([...configs, newConfig]);
    setCurrentConfig(newConfig);

    toastSucc("添加成功");
  }, [configs]);

  const onCopy = useCallback(
    (targetItem: ConfigItem) => {
      const newConfig: ConfigItem = cloneDeep(targetItem);
      newConfig.key = `config-${Date.now()}`;
      newConfig.title = targetItem.title + "-copy";

      const targetIndex = configs.findIndex((i) => i.key === targetItem.key);
      const nextConfig = [...configs];
      nextConfig.splice(targetIndex + 1, 0, newConfig);

      setConfigs(nextConfig);
      setCurrentConfig(newConfig);

      toastSucc("复制成功");
    },
    [configs]
  );
  const onConfigDel = useCallback(
    (targetItem: ConfigItem) => {
      // if (configs.length <= 1) {
      //   message.info("一条配置都没得，玩儿个锤子");
      //   return;
      // }
      const newConfigs = configs.filter((item) => item.key !== targetItem.key);
      setConfigs(newConfigs);
      if (targetItem.key === currentConfig?.key) {
        setCurrentConfig(newConfigs[0]);
      }

      toastSucc("删除成功");
    },
    [configs, currentConfig?.key]
  );
  const onConfigImport = useCallback(() => {
    getConfigFile().then((data) => {
      try {
        const newConfigs = JSON.parse(data) as ConfigItem[];
        const newKeys = configs.map((i) => i.key);
        const targetConfig = [
          ...configs.filter((i) => !newKeys.includes(i.key)),
          ...newConfigs,
        ];
        setConfigs(targetConfig);
        message.success("导入成功");
      } catch (error) {
        alertError("导入失败：JSON反序列化失败，请检查您的配置文件");
        return;
      }
    });
  }, [configs]);
  const onConfigExport = useCallback(() => {
    const data = new Blob([JSON.stringify(configs)], { type: "text/json" });
    const url = URL.createObjectURL(data);
    const fileName = "gmsoft-dev-tools-config.json";
    const aTag = document.createElement("a");
    aTag.href = url;
    if (fileName) {
      aTag.download = fileName;
    }
    aTag.style.display = "none";
    document.body.appendChild(aTag);
    aTag.click();
    document.body.removeChild(aTag);
  }, [configs]);
  const onConfigSave = useCallback(
    (configVals: any) => {
      const rules: RuleItem[] = [];
      mapKeys(configVals.rules, (v, k) => {
        rules.push({
          key: k,
          domain: v.domain.trim(),
          pattern: (v.pattern || []).map((i: string) => i.trim()),
          replaceParams: (v.replaceParams || []).map((i: string) => i.trim()),
        });
      });
      const newConfig: ConfigItem = {
        ...configVals,
        rules,
      };
      const newConfigs = configs.map((item) => {
        if (item.key === newConfig.key) {
          return newConfig;
        }
        return item;
      });
      message.success("保存成功");
      setConfigs(newConfigs);
    },
    [configs]
  );

  useEffect(() => {
    ExtensionsStorageUtils.setConfig({
      configs,
    });
  }, [configs]);
  useEffect(() => {
    ExtensionsStorageUtils.getConfig().then((config) => {
      const configs = config.configs || [];
      setConfigs(configs);
      setCurrentConfig(configs[0]);
    });
  }, []);

  return (
    <OptionLayout>
      <OptionHeader />
      <ContentLayout>
        <NavLayout>
          <SwitchBlock configs={configs} />
          <ConfigNavBlock
            configs={configs}
            currentKey={currentConfig?.key}
            onConfigAdd={onConfigAdd}
            onCopy={onCopy}
            onConfigEdit={setCurrentConfig}
            onConfigDel={onConfigDel}
            onConfigImport={onConfigImport}
            onConfigExport={onConfigExport}
          />
          <PasswordConfigBlock />
        </NavLayout>
        <ConfigLayout>
          <ConfigBlock config={currentConfig} onConfigSave={onConfigSave} />
        </ConfigLayout>
      </ContentLayout>
    </OptionLayout>
  );
}

export default Options;
