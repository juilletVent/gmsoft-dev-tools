import { FormInstance } from "antd";
import { useCallback, useEffect, useState } from "react";
import MessageUtils from "../../utils/message";
import { ExtensionsStorageUtils } from "../../utils/storage";
import { ConfigItem } from "../Options/components/ConfigBlock";

export function useSwitch(form: FormInstance<any>) {
  const [configs, setConfig] = useState<ConfigItem[]>([]);
  const onValuesChange = useCallback((cvals: any, vals: any) => {
    ExtensionsStorageUtils.setConfig(vals);
    MessageUtils.sendMessage({
      type: "switch",
      data: vals,
    });
  }, []);

  useEffect(() => {
    if (form) {
      const { setFieldsValue } = form;
      ExtensionsStorageUtils.getConfig().then((config) => {
        setConfig(config.configs);
        setFieldsValue({
          target: config.target,
          open: config.open ?? false,
        });
      });
    }
  }, [form]);

  return { onValuesChange, configs };
}
