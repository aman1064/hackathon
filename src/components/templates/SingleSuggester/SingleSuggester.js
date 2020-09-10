import React from "react";
import debounce from "debounce";
import services from "../../../utils/services";
import { getUrl } from "../../../utils/getUrl";
import ReactSuggestor from "../../templates/ReactSuggestor/ReactSuggestor";
import { sortByKey } from "../../../utils/pureFns";
import { handleCustomFieldError } from "../Form/Validate";
import globalConfig from "../../../configs/globalConfig";
class SingleSuggester extends React.Component {
  state = {
    selectedValue: "",
    suggestions: [],
    typedValue: ""
  };
  static getDerivedStateFromProps(nextProps) {
    if (nextProps.input && nextProps.input.value) {
      return { selectedValue: nextProps.input.value.name };
    }
    return "";
  }

  getApiData = (dataUrl, inputValue, showAll) => {
    dataUrl = getUrl(dataUrl);
    const url = dataUrl.replace("{input}", inputValue || "");
    if ((inputValue && inputValue.length >= 1) || showAll) {
      services.get(url).then(res => {
        this.setState({
          suggestions: res.data || []
        });
      });
    } else {
      this.setState({ suggestions: [] });
    }
  };

  getApiDataWithDebounce = debounce((dataUrl, inputValue, showAll) => {
    this.getApiData(dataUrl, inputValue, showAll);
  }, 100);

  handleSuggestionsFetchRequested = value => {
    const { dataUrl, showAll, data } = this.props;
    if (data) {
      this.getFilterOptionsData(value);
    } else if (dataUrl) {
      if (!value || (value && value.length < 3)) {
        this.getApiData(dataUrl, value, showAll);
      } else if (value.length >= 3 && value.length < 100) {
        this.getApiDataWithDebounce(dataUrl, value, showAll);
      }
    }
  };
  getFilterOptionsData = value => {
    const { data } = this.props;
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    const filteredData =
      inputLength === 0
        ? data
        : data.filter(option => option.name.toLowerCase().includes(inputValue));
    this.setState({ suggestions: filteredData });
  };

  handleSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };
  handleFocus = () => {
    const { showAll, data } = this.props;
    if (data) {
      this.setState({ suggestions: data });
    } else if (showAll) {
      this.handleSuggestionsFetchRequested();
    }
  };

  handleChange = (event, newValue) => {
    const data = this.state.suggestions;

    if (this.props.allowCreate || newValue.trim() === "") {
      this.props.input.onChange("");
      this.setState({
        selectedValue: newValue,
        typedValue: newValue
      });
    } else if (newValue.length < 100) {
      let selectedData = data && data.find(item => item.name === newValue);
      selectedData = selectedData
        ? selectedData
        : {
            name: newValue,
            id: null
          };
      this.props.input.onChange(selectedData);
      this.setState({
        selectedValue: newValue,
        typedValue: newValue
      });
    }
  };

  handleKeyDown = event => {
    if (event.keyCode === 13) {
      event.preventDefault();
    }
  };
  handleBlur = event => {
    if (
      !event.relatedTarget ||
      (event.relatedTarget && event.relatedTarget.type != "submit")
    ) {
      this.setState({
        selectedValue: "",
        typedValue: ""
      });
      if (
        this.props.input &&
        !this.props.input.value &&
        this.props.input.name &&
        (this.props.allowCreate ||
          (!this.props.allowCreate && event.target.value == "")) &&
        this.props.form
      ) {
        let error = {};
        error[this.props.input.name] = globalConfig.mandatoryValueMissing;
        handleCustomFieldError(this.props.form, error, null, true);
      }
    } else {
      this.props.input.onChange({
        name: event.target.value,
        id: null
      });
      this.setState({
        selectedValue: event.target.value,
        typedValue: ""
      });
    }
  };
  onSelectItem(item) {
    this.props.input.onChange({
      name: item.name,
      id: item.id
    });
    this.setState({
      typedValue: ""
    });
  }

  render() {
    const {
      placeholder,
      customClass,
      threshold,
      id,
      showAll,
      allowCreate,
      separateOptionsThreshold,
      separateOptionsLabel,
      meta,
      input,
      labelClass
    } = this.props;
    const { typedValue } = this.state;
    return (
      <div
        className={`${customClass} ${threshold ? "autosuggest_maxHeight" : ""}`}
      >
        <ReactSuggestor
          inputProps={{
            className: `autosuggest_blue_grey_label`,
            labelClassName: { labelClass },
            placeholder: { placeholder },
            id: id,
            touched: meta.touched,
            error:
              meta.error && typeof meta.error === "string" ? meta.error : false,
            name: input.name
          }}
          onChange={this.handleChange}
          value={this.state.selectedValue}
          fetchData={this.handleSuggestionsFetchRequested}
          dataItems={[
            ...sortByKey(
              this.state.suggestions.splice(0, separateOptionsThreshold),
              "name"
            ),
            ...sortByKey(this.state.suggestions, "name")
          ]}
          onSelect={this.onSelectItem.bind(this)}
          dataLimit={10000}
          shouldListOpenOnFocus={showAll ? true : false}
          onFocus={this.handleFocus}
          allowCreate={allowCreate}
          onBlur={this.handleBlur.bind(this)}
          separateOptionsThreshold={separateOptionsThreshold}
          separateOptionsLabel={separateOptionsLabel}
          typedValue={typedValue}
          onKeyDown={this.handleKeyDown}
        />
        {meta.error && <p className="formError inline_error">{meta.error}</p>}
      </div>
    );
  }
}

export default SingleSuggester;
