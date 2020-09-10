const config = {
  name: "profilePrivacyPage",
  formFields: {
    id: "jobSearchStatus",
    name: "jobSearchStatus",
    ariaLabel: "job Search",
    labelPlacement: "start",
    wrapperClass: "fullWidth",
    className: "RadioCard__Flat",
    radioList: [
      {
        type: "radioItem",
        value: "ACTIVELY_LOOKING",
        label:
          '<div> <p class="radioGroupLabel">Actively looking, ready for interview</p></div>'
      },
      {
        type: "radioItem",
        value: "UNDERGOING_INTERVIEW",
        label:
          '<div> <p class="radioGroupLabel">Already in interview process(es)</p></div>'
      },
      {
        type: "radioItem",
        value: "NOT_ACTIVELY_LOOKING",
        label:
          '<div> <p class="radioGroupLabel">Not actively looking but open to opportunities</p></div>'
      },
      {
        type: "radioItem",
        value: "EXPLORING_PRODUCT",
        label:
          '<div> <p class="radioGroupLabel">Just exploring the product</p></div>'
      }
    ]
  }
};

export default config;
