const getGALabelFromFormFieldName = (formFieldName = "") => {
  const fieldName = formFieldName.split("$")[0];
  let gaLabel;
  switch (fieldName) {
    case "latestCompanyDetails":
      gaLabel = "company_details";
      break;
    case "latestEducationDetails":
      gaLabel = "highest_education";
      break;
    case "company":
    case "location":
      gaLabel = "update_application_screen";
      break;
    case "specialization":
      gaLabel = "domain_experience";
      break;
    default:
      gaLabel = "";
      break;
  }
  return gaLabel;
};

export default getGALabelFromFormFieldName;
