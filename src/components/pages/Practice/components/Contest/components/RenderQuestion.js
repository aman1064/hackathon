import React from "react";
import PropTypes from "prop-types";

import RadioGroup from "../../../../../molecules/RadioGroup";
import ReduxField from "../../../../../organisms/Field";
import { RENDER_FIELD_TYPE } from "../constants";

const renderRadioGroup = props => (
  <RadioGroup radioList={props.options} {...props} />
);

renderRadioGroup.propTypes = {
  options: PropTypes.array
};

renderRadioGroup.defaultProps = {
  options: []
};

const RenderQuestion = props => {
  const { form, questionType, options, id } = props;
  switch (questionType) {
    case RENDER_FIELD_TYPE.MCQ_SINGLE_SELECT:
      return (
        <ReduxField
          key={id}
          name="answer"
          component={renderRadioGroup}
          options={options}
          labelKey="text"
          valueKey="id"
          form={form}
          className="radio-question"
        />
      );

    default:
      return null;
  }
};

RenderQuestion.propTypes = {
  form: PropTypes.object,
  questionType: PropTypes.string,
  options: PropTypes.array,
  id: PropTypes.string
};

RenderQuestion.defaultProps = {
  form: {},
  id: "",
  questionType: "MCQ_SINGLE_SELECT",
  options: []
};

export default RenderQuestion;
