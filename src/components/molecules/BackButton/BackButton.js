import React from "react";

import Button from "../../atoms/Button";
import { BackButtonIcon } from "../../atoms/Icon/icons";

function BackButton({ action, customClass }) {
  return (
    <Button
      type="link"
      onClick={action}
      size="small"
      className={`inherit_styles ${customClass}`}
    >
      <BackButtonIcon />
    </Button>
  );
}

export default BackButton;
