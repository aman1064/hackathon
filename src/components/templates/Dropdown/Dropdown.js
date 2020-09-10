import React, { Component } from "react";
import "./Dropdown.scss";
import services from "../../../utils/services";
import { getUrl } from "../../../utils/getUrl";
import { DropdownIcon } from "../../atoms/Icon/icons";
import Title from "../../../ui-components/Modal/Title";
import Modal from "../../../ui-components/Modal";

class Dropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      optionsData: [],
      selectedValue: ""
    };
  }

  static getDerivedStateFromProps(nextProps) {
    if (
      nextProps.input &&
      nextProps.input.value &&
      localStorage.getItem("specializationsApiData") !== "undefined"
    ) {
      const specializationsApiData = JSON.parse(
        localStorage.getItem("specializationsApiData")
      );
      const selectedData =
        specializationsApiData &&
        specializationsApiData.find(item => item.id === nextProps.input.value);
      return { selectedValue: selectedData ? selectedData.name : "" };
    } else {
      return "";
    }
  }

  componentDidMount() {
    const { data } = this.props;
    let { dataUrl } = this.props;
    if (dataUrl) {
      dataUrl = getUrl(dataUrl);
      services.get(dataUrl).then(res => {
        this.setState({ optionsData: res.data });
        localStorage.setItem(
          "specializationsApiData",
          JSON.stringify(res.data)
        );
      });
    } else {
      this.setState({ optionsData: data || [] });
    }
  }

  openModal = e => {
    e.preventDefault();
    this.setState({ showModal: true });
  };

  closeModal = () => {
    this.setState({ showModal: false });
  };
  getList = options => {
    return options.map((option, i) => (
      <li
        key={i}
        className="list_item"
        data-name={option.name}
        data-id={option.id}
        onClick={this.handleOnClick}
      >
        {option.name}
      </li>
    ));
  };
  handleOnClick = e => {
    const selectedData = {
      name: e.target.dataset.name,
      id: e.target.dataset.id
    };
    this.setState({ selectedValue: selectedData.name });
    // eslint-disable-next-line no-lone-blocks
    {
      this.props.onSelect && this.props.onSelect(selectedData);
    }
    this.props.input.onChange(selectedData.id);

    this.closeModal();
  };
  render() {
    const { customClass, title } = this.props,
      { optionsData, selectedValue } = this.state;
    const label = selectedValue ? selectedValue : title;
    return (
      <div>
        <button
          onClick={this.openModal}
          className={`modalButton ${customClass}`}
          onKeyDown={this.handleOnKeyDown}
          id="jobRoleDropdown"
        >
          <span className="fontWight_500">{label}</span>
          <DropdownIcon size={10} />
        </button>
        <Modal
          open={this.state.showModal}
          onClose={this.closeModal}
          closeOnClickOutside={true}
        >
          <Title handleClose={this.closeModal} className="modalTitle">
            <p className="modalTitle">{title}</p>
          </Title>
          <div className="this.Modal.Content">
            <ul className="selector_list" id="jobRoleOptions">
              {this.getList(optionsData)}
            </ul>
          </div>
        </Modal>
      </div>
    );
  }
}

export default Dropdown;
