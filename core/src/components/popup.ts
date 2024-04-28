/* eslint-disable max-params */
import { notification, message, Modal } from "antd";
import { get } from "lodash";

/** 弹层类型 */
export enum ModalType {
  SUCCESS = "success",
  ERROR = "error",
  WARNING = "warning",
  CONFIRM = "confirm",
  INFO = "info",
}

export enum MessageType {
  SUCCESS = "success",
  ERROR = "error",
  WARNING = "warning",
  WARN = "warn",
  LOADING = "loading",
  INFO = "info",
}

export enum NotificationType {
  SUCCESS = "success",
  ERROR = "error",
  WARNING = "warning",
  WARN = "warn",
  OPEN = "open",
  INFO = "info",
}

// type success,error,info,warning,warn
const notificationPop = (
  type: NotificationType = NotificationType.ERROR,
  title: string = "错误",
  describe?: React.ReactNode,
  onlyKey?: any,
  durationTime: number = 3,
  onClose: () => void = () => {}
) => {
  notification[type]({
    key: onlyKey,
    message: title,
    description: describe,
    duration: durationTime,
    onClose,
  });
};

/**
 emit(methodName,message, cb, title, width, height)
 @parame  alert,warning,success,confirm,error   对应antd的 type
*/
const messagePop = (
  type: MessageType = MessageType.SUCCESS,
  content: React.ReactNode = "成功",
  onClose?: () => void,
  duration: number = 4
) => {
  message[type](content, duration, onClose);
};

const modalPop = (
  type: ModalType = ModalType.SUCCESS,
  title: string = "成功",
  content: React.ReactNode = "操作成功",
  onOk?: () => void,
  onCancel?: () => void,
  okText?: string,
  cancelText?: string,
  zIndex?: number
) => {
  Modal[type]({
    onOk,
    content,
    title,
    onCancel,
    okText: okText || "确认",
    cancelText: cancelText || "取消",
    zIndex,
  });
};

const popError = (
  err: Error | string,
  prefix = "非常抱歉，发生了一些错误："
) => {
  notificationPop(
    NotificationType.ERROR,
    "错误",
    `${prefix}${get(err, "message", err)}`
  );
};

const popMessage = (content: string) => {
  notificationPop(NotificationType.INFO, "温馨提醒", content);
};

const popSuccess = (content: string) => {
  notificationPop(NotificationType.SUCCESS, "成功", content);
};

const toastInfo = (content: string) => {
  messagePop(MessageType.INFO, content);
};
const toastSucc = (content: string) => {
  messagePop(MessageType.SUCCESS, content);
};
const toastError = (content: string) => {
  messagePop(MessageType.ERROR, content);
};

const alertMessage = (content: string, cb?: () => void) => {
  modalPop(ModalType.INFO, "温馨提醒", content, cb);
};
const alertSuccess = (content: string, cb?: () => void) => {
  modalPop(ModalType.SUCCESS, "成功", content, cb);
};
const alertError = (content: string | Error, cb?: () => void) => {
  if (typeof content === "string") {
    modalPop(ModalType.ERROR, "错误", content, cb);
  } else {
    modalPop(ModalType.ERROR, "错误", content.message || "未知错误", cb);
  }
};

export {
  messagePop,
  modalPop,
  popError,
  popMessage,
  popSuccess,
  toastInfo,
  toastSucc,
  toastError,
};
export { alertMessage, alertSuccess, alertError };
export default notificationPop;
