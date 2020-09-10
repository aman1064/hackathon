import React from "react";

import "./FreeInputHint.scss";

const FreeInputHint = ({ fieldLabel }) => (
  <div className="FIHint">
    <h3 className="FIHint_title">No matches found</h3>
    <ul className="FIHint_list">
      <li>Make sure the {fieldLabel} name is spelled correctly</li>
      <li>
        It can also be that your {fieldLabel} name is not in our list in which
        case you can tap the tick button
      </li>
    </ul>
  </div>
);

export default FreeInputHint;
