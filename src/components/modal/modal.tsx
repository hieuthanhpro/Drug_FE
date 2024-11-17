import React, { Fragment, useEffect, useRef, useState } from "react";
import { Portal } from "react-overlays";
import Button from "./../button/button";
import Icon from "components/icon";
import { IActionModal } from "model/OtherModel";
import "./modal.scss";
import { fadeOut } from "utils/common";
import { useOnClickOutside } from "utils/hookCustom";

interface ModalProps {
  isOpen: boolean;
  children: React.ReactElement | React.ReactElement[];
  toggle: () => void;
  staticBackdrop?: boolean;
  className?: string;
  isCentered?: boolean;
  isFade?: boolean;
  size?: "xl" | "md" | "sm";
}

export default function Modal(props: ModalProps) {
  const { isOpen, children, toggle, staticBackdrop, className, isCentered, isFade,size="sm" } = props;

  const refModal = useRef();
  const refBackdrop = useRef();
  const refDialog = useRef();
  useOnClickOutside(refDialog, () => toggle(), [
    "modal-dialog",
    "dialog",
    "dialog-backdrop",
    "react-datepicker-popper",
    "popover",
    ...(staticBackdrop ? ["modal-backdrop"] : []),
  ]);

  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      document.getElementsByTagName("body")[0].style.overflow = "hidden";
      setIsOpenModal(isOpen);
    } else {
      document.getElementsByTagName("body")[0].style.overflow = "";
      if (refModal?.current && isFade) {
        fadeOut(refModal.current);
        if (refBackdrop?.current) {
          fadeOut(refBackdrop.current);
        }
        setTimeout(() => {
          setIsOpenModal(isOpen);
        }, 200);
      } else {
        setIsOpenModal(isOpen);
      }
    }
  }, [isOpen]);

  return (
    isOpenModal && (
      <Portal container={document.getElementsByTagName("body")[0]}>
        <Fragment>
          <div className={`modal${className ? ` ${className}` : ""} show`} ref={refModal}>
            <div className={`modal-dialog${isCentered ? " modal-dialog--centered" : ""} ${size==="xl"?"modal-dialog--xl":""}`} ref={refDialog}>
              <div className="modal-content">{children}</div>
            </div>
            <div className={`modal-backdrop show`} ref={refBackdrop}></div>
          </div>
        </Fragment>
      </Portal>
    )
  );
}

interface ModalHeaderProps {
  title: React.ReactElement | string;
  toggle: () => void;
  className?: string;
}

export function ModalHeader(props: ModalHeaderProps) {
  const { title, toggle, className } = props;
  return (
    <div className={`modal-header${className ? ` ${className}` : ""}`}>
      <h4>{title}</h4>
      {toggle && (
        <Button onClick={() => toggle()} type="button" className="btn-close" color="transparent" onlyIcon={true}>
          <Icon name="Times" />
        </Button>
      )}
    </div>
  );
}

interface ModalBodyProps {
  children: React.ReactElement | React.ReactElement[];
  className?: string;
}

export function ModalBody(props: ModalBodyProps) {
  const { children, className } = props;
  return <div className={`modal-body${className ? ` ${className}` : ""}`}>{children}</div>;
}

interface ModalFooterProps {
  actions?: IActionModal;
  className?: string;
}

export function ModalFooter(props: ModalFooterProps) {
  const { actions, className } = props;
  return (
    <div className={`modal-footer${className ? ` ${className}` : ""}`}>
      <div className="modal-footer__actions modal-footer__actions--left">
        {actions?.actions_left?.buttons &&
          actions?.actions_left?.buttons.length > 0 &&
          actions?.actions_left?.buttons.map((action, index) => (
            <Button
              type="button"
              variant={action.variant}
              color={action.color ? action.color : "primary"}
              onClick={() => action.callback()}
              disabled={action.disabled}
              key={index}
            >
              {action.title}
            </Button>
          ))}
        {!actions?.actions_left?.buttons && actions?.actions_left?.text ? actions?.actions_left?.text : ""}
      </div>
      <div className="modal-footer__actions modal-footer__actions--right">
        {actions?.actions_right?.buttons &&
          actions?.actions_right?.buttons.length > 0 &&
          actions?.actions_right?.buttons.map((action, index) => (
            <Button
              type={action.type ?? "button"}
              variant={action.variant}
              color={action.color ? action.color : "primary"}
              onClick={() => action.callback && action.callback()}
              disabled={action.disabled}
              key={index}
            >
              {action.title}
              {action.is_loading && <Icon name="Loading" />}
            </Button>
          ))}
        {!actions?.actions_right?.buttons && actions?.actions_right?.text ? actions?.actions_right?.text : ""}
      </div>
    </div>
  );
}
