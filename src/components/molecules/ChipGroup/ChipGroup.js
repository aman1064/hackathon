import React, { PureComponent } from "react";

import getKey from "../../../utils/getKey";
import { getUrl } from "../../../utils/getUrl";
import services from "../../../utils/services";

import Chip from "../../../ui-components/Chip";
import { TagPlusIcon } from "../../atoms/Icon/icons";
import Loading from "../../atoms/Loading";
import tracker from "../../../analytics/tracker";
import "./ChipGroup.scss";

class ChipGroup extends PureComponent {
  state = {
    chipList: [],
    variant: "outlined",
    selectedChipObj: null,
    selectedVariant: "default",
    selectedColor: "secondary",
    selectedChipsArr: []
  };

  static getDerivedStateFromProps = nextProps => {
    const { isMultiSelect, input } = nextProps,
      addToNextState = {};
    let { chipList } = nextProps;
    if (chipList && chipList.length) {
      if (chipList[0].id === "others" && chipList.length === 1) {
        chipList = [];
      }
      addToNextState.chipList = chipList;
    }
    if (input && input.value) {
      if (isMultiSelect) {
       
        addToNextState.selectedChipsArr = [];
        input.value.forEach((chip) => {
          if(chip.id && chip.name){
            addToNextState.selectedChipsArr.push(chip);
          }
        })
      
      } else {
        addToNextState.selectedChipObj = input.value;
      }
    }
    // if (input && input.value) {
    //   if (isMultiSelect) {
    //     addToNextState.selectedChipsArr = input.value;
    //   } else {
    //     addToNextState.selectedChipObj = input.value;
    //   }
    // }
    if (isMultiSelect) {
      addToNextState.isMultiSelect = isMultiSelect;
    }
    return addToNextState;
  };

  componentDidMount() {
    let { chipListUrl } = this.props;
    const { chipList } = this.props;
    if (chipListUrl) {
      chipListUrl = getUrl(chipListUrl);
      // TODO
      services.get(chipListUrl, { apiLabel: chipListUrl }).then(res => {
        this.setState({ chipList: res.data });
      });
    } else {
      this.setState({ chipList: chipList || [] });
    }
  }

  onClick = (id, name) => () => {
    const { input } = this.props;

    tracker().on("event", {
      hitName: `${input.name}$${id}`
    });
    if (this.state.isMultiSelect) {
      const selectedChipsArrCopy = this.state.selectedChipsArr.slice();
      selectedChipsArrCopy.push({ id, name });

      this.props.input.onChange(selectedChipsArrCopy);
      if (typeof this.props.onChipChange === "function") {
        this.props.onChipChange(selectedChipsArrCopy);
      }
      this.setState({ selectedChipsArr: selectedChipsArrCopy });
    } else {
      this.props.input.onChange({ id, name });
      if (typeof this.props.onChipChange === "function") {
        this.props.onChipChange({ id, name });
      }
      this.setState({ selectedChipObj: { id, name } });
    }
  };

  onDelete = id => () => {
    const {
      input,
      formfieldChange,
      listToDelete,
      reduxfieldChange,
      form,
      onChipChange,
      onChipDelete
    } = this.props;
    tracker().on("event", {
      hitName: `${input.name}$${id}`
    });
    if (this.state.isMultiSelect) {
      const selectedChipsArrCopy = this.state.selectedChipsArr.slice();
      selectedChipsArrCopy.splice(
        this.getChipIndexById(selectedChipsArrCopy, id),
        1
      );
      input.onChange(selectedChipsArrCopy.length ? selectedChipsArrCopy : []);
      //onChipChange(selectedChipsArrCopy, "delete");
      this.setState({ selectedChipsArr: selectedChipsArrCopy });
    } else {
      input.onChange("");
      this.setState({
        selectedChipObj: null
      });
    }
    if (listToDelete && (formfieldChange || reduxfieldChange)) {
      for (let i = 0; i < listToDelete.length; i++) {
        if (formfieldChange) {
          formfieldChange(listToDelete[i], null);
        } else if (reduxfieldChange) {
          reduxfieldChange({
            form,
            fieldName: listToDelete[i],
            value: "",
            touched: true
          });
        }
      }
    }
    if (typeof onChipDelete === "function") {
      onChipDelete();
    }
  };

  isChipSelected = chipData => {
    if (this.state.isMultiSelect) {
      for (let i = 0; i < this.state.selectedChipsArr.length; i++) {
        if (
          this.state.selectedChipsArr[i].id === chipData.id ||
          this.state.selectedChipsArr[i].name === chipData.name
        ) {
        
          this.state.selectedChipsArr[i].hasApiMatch = true;
          return true;
        }
      }
      return false;
    } else {
      return (
        this.state.selectedChipObj &&
        (this.state.selectedChipObj.id === chipData.id ||
          this.state.selectedChipObj.name === chipData.name)
      );
    }
  };

  getChip = (
    chipData,
    isSelected = false,
    showDelete = false,
    showIcon = false
  ) => (
    <Chip
      key={getKey()}
      label={showIcon ? this.addIcon(chipData.name) : chipData.name}
      variant={isSelected ? this.state.selectedVariant : this.state.variant}
      onClick={
        this.props.onClick
          ? this.props.onClick(chipData)
          : !isSelected
          ? this.onClick(chipData.id, chipData.name)
          : undefined
      }
      className={`chipItem ${this.props.childClass} ${
        isSelected ? "selected" : ""
      }`}
      appearance={isSelected ? this.state.selectedColor : undefined}
      color={isSelected ? this.state.selectedColor : undefined}
      onDelete={showDelete ? this.onDelete(chipData.id) : undefined}
      classes={{ label: "chipLabel" }}
      labelClassName={this.props.labelClassName}
      onIconClick={showDelete ? this.onDelete(chipData.id) : undefined}
    />
  );

  getSelectedChipEl = chipList => {
    let selectedChipList = chipList.filter(
      chipData =>
        chipData.id === this.state.selectedChipObj.id ||
        chipData.name === this.state.selectedChipObj.name
    );
    if (chipList.length && !selectedChipList.length && this.props.defaultName) {
      selectedChipList = chipList.filter(
        chipData => chipData.name === this.props.defaultName
      );
      this.props.input.onChange({ id: null, name: this.props.defaultName });
    }
    if (!selectedChipList.length && this.state.selectedChipObj) {
      selectedChipList.push(this.state.selectedChipObj);
    }
    return selectedChipList.map(selectedChipData =>
      this.getChip(selectedChipData, true, this.props.isEditable)
    );
  };

  getAllChipEl = chipList => {
    const chipListDom = chipList.map(chipData =>
      this.isChipSelected(chipData)
        ? this.getChip(chipData, true, this.state.isMultiSelect)
        : this.getChip(chipData, false, false, this.state.isMultiSelect)
    );
    return chipListDom.concat(
      this.state.selectedChipsArr.length > 0 &&
        this.state.selectedChipsArr
          .filter(chipData => !chipData.hasApiMatch)
          .map(chipData =>
            this.getChip(chipData, true, this.state.isMultiSelect)
          )
    );
  };

  addIcon = name => (
    <span className="spreadHr_center">
      <span className="paddingRight_4">{name}</span>
      <TagPlusIcon className="chipAddIcon" size={12} />
    </span>
  );

  getChipIndexById = (chipList, id) => {
    let chipIndex;
    chipList.every((chipObj, index) => {
      if (chipObj.id === id) {
        chipIndex = index;
        return false;
      } else {
        return true;
      }
    });
    return chipIndex;
  };
  render() {
    const { chipList } = this.state;
    const { meta ,fieldType} = this.props;
    return chipList && chipList.length ? (
      <div>
      <div
        className={`chipListWrapper ${this.props.chipGroupClass}`}
        id={(this.props.input && this.props.input.name) || `chipListWrapper`}
      >
        {this.state.selectedChipObj && this.props.hideUnselected 
          ? this.getSelectedChipEl(chipList)
          : this.getAllChipEl(chipList)}
      </div>
      {(!fieldType || fieldType !="ChipWithModal") && meta && meta.error &&  <p className="formError inline_error">{meta.error}</p>}
      </div>
    ) : (
      <Loading variant="isSmall" />
    );
  }
}

export default ChipGroup;
