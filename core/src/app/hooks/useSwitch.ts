import { FormInstance } from "antd";
import { useCallback, useEffect } from "react";
import { ExtensionsStorageUtils } from "../../utils/storage";

export function useSwitch(form: FormInstance<any>) {
  const onValuesChange = useCallback((cvals: any, vals: any) => {
    ExtensionsStorageUtils.setConfig(vals);
  }, []);

  useEffect(() => {
    if (form) {
      const { setFieldsValue } = form;
      ExtensionsStorageUtils.getConfig().then((config) => {
        setFieldsValue(config);
      });
    }
  }, [form]);

  return { onValuesChange };
}
