const config = {
  name: "profilePrivacyPage",
  formFields: {
    id: "profilePrivacy",
    name: "profilePrivacy",
    ariaLabel: "privacy policy",
    labelPlacement: "start",
    wrapperClass: "fullWidth",
    className: "RadioCard__Flat",
    radioList: [
      {
        label:
          '<div> <p class="radioGroupLabel">Let companies view my full profile</p><p class="radioGroupSubLabel">Recommended</p></div>',
        type: "radioItem",
        value: "public",
        isDefault: false,
        className: "RadioCard__Flat"
      },
      {
        type: "radioItem",
        value: "anonymous",
        label: `<div>
                 <p class="radioGroupLabel">Only companies I apply to can see 
              my profile</p>
                  <p class="radioGroupSubLabel">You will not be listed on recruiter platform</p>
                  <p class="radioGroupSubLabel">No incoming interest from recruiters</p>
              </div>`,
        className: "RadioCard__Flat"
      }
    ]
  }
};

export const configForCreateJs = {
  name: "profilePrivacyPage",
  formFields: {
    id: "profilePrivacy",
    name: "profilePrivacy",
    ariaLabel: "privacy policy",
    labelPlacement: "start",
    wrapperClass: "fullWidth",
    className: "RadioCard__Flat",
    radioList: [
      {
        label:
          '<div> <p class="radioGroupLabel">Let companies view my full profile</p><p class="radioGroupSubLabel">Recommended</p></div>',
        type: "radioItem",
        value: "public",
        isDefault: false,
        className: "RadioCard__Flat"
      },
      {
        type: "radioItem",
        value: "anonymous",
        label: `<div>
                 <p class="radioGroupLabel">Only companies I apply to can see 
              my profile</p>
                  <p class="radioGroupSubLabel">You will not be listed on recruiter platform</p>
                  <p class="radioGroupSubLabel">No incoming interest from recruiters</p>
              </div>`,
        className: "RadioCard__Flat"
      }
    ]
  }
};

export const profilePrivacyConfig = {
  formFields: {
    ariaLabel: "privacy policy",
    labelPlacement: "start",
    wrapperClass: "fullWidth",
    className: "RadioCard__Flat",
    radioList: [
      {
        label: `<div> <p class="radioGroupLabel">Actively looking, ready for interview</p></div>`,
        type: "radioItem",
        value: "ACTIVELY_LOOKING",
        isDefault: false,
        className: "RadioCard__Flat"
      },
      {
        label: `<div> <p class="radioGroupLabel">Already in interview process(es)</p></div>`,
        type: "radioItem",
        value: "UNDERGOING_INTERVIEW",
        isDefault: false,
        className: "RadioCard__Flat"
      },
      {
        label:
          '<div> <p class="radioGroupLabel">Not actively looking but open to opportunities</p></div>',
        type: "radioItem",
        value: "NOT_ACTIVELY_LOOKING",
        isDefault: false,
        className: "RadioCard__Flat"
      },
      {
        label:
          '<div> <p class="radioGroupLabel">Just exploring the product</p></div>',
        type: "radioItem",
        value: "EXPLORING_PRODUCT",
        isDefault: false,
        className: "RadioCard__Flat"
      }
    ]
  },
  name: "jobSearchStatus"
};

export default config;
