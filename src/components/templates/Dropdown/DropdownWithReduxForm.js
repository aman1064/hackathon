import React, { Component } from "react";
import "./Dropdown.scss";
import services from "../../../utils/services";
import { getUrl } from "../../../utils/getUrl";
import { DropdownIcon } from "../../atoms/Icon/icons";
import Title from "../../../ui-components/Modal/Title";
import Modal from "../../../ui-components/Modal/Modal";

class DropdownWithReduxForm extends Component {
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
      nextProps.input.value.name
    ) {
      return { selectedValue: nextProps.input.value.name };
    } else if (nextProps.input && nextProps.input.value) {
      nextProps.input.onChange(nextProps.jobRoleData);
      return { selectedValue: nextProps.jobRoleData.name };
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
    this.setState({ selectedValue: e.target.dataset.name });
    const selectedData = {
      name: e.target.dataset.name,
      id: e.target.dataset.id
    };
    this.props.input.onChange(selectedData);
    this.closeModal();
  };
  render() {
    const { customClass, title } = this.props,
      { optionsData, selectedValue } = this.state;
    const label = selectedValue ? selectedValue : title;
    return (
      <div>
        <div
          onClick={this.openModal}
          className={`modalButton ${customClass}`}
          id="jobRoleDropdown"
        >
          <span className="fontWight_500">{label}</span>
          <DropdownIcon size={10} />
        </div>
        <Modal
          className="qaModal"
          open={this.state.showModal}
          onClose={this.closeModal}
          animate={false}
        >
          <Title handleClose={this.closeModal}>
            <p>{title}</p>
          </Title>
          <div className="modalContent">
            <ul className="selector_list" id="jobRoleOptions">
              {this.getList(optionsData)}
            </ul>
          </div>
        </Modal>
      </div>
    );
  }
}

export default DropdownWithReduxForm;
