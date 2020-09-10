import React from "react";
import Button from "../../Button";
import { ModalCrossIcon } from "../../../components/atoms/Icon/icons";
import "./index.scss";

const Title = props => {
  const { children, className, handleClose } = props;
  return (
    <div className={`${className} modalTitle`}>
      {children}
      {handleClose ? (
        <Button
          buttonType="button"
          type="link hasHover"
          className={"modalCross"}
          onClick={handleClose}
        >
          <ModalCrossIcon size={14} />
        </Button>
      ) : null}
    </div>
  );
};

export default Title;
