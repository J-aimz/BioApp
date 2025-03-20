export type BioDataForm = {
  firstName: string;
  lastName: string;
  otherNames: string;
  dateOfBirth: string;
  stateOfOrigin: string;
  lga: string;
  ward: string;
  address: string;
  contact: string;
  passportPhoto?: string;
  votersCard: string;
  nin?: string;
  email: string;
  gender: string;
  selectedSkillCategory: string;
  selectedSkill: string;
  meansOfIdentification: string;
  otherMeansOfIdentification?: string;
  IdCardPhoto: string;
};

export type BioDataFormUpload = {
  firstName: string;
  lastName: string;
  otherNames: string;
  dateOfBirth: string;
  stateOfOrigin: string;
  lga: string;
  ward: string | undefined;
  address: string;
  contact: string;
  passportPhoto?: string;
  votersCard: string;
  nin?: string;
  email: string;
  gender: string;
  selectedSkillCategory: string;
  selectedSkill: string | undefined;
  meansOfIdentification: string;
  otherMeansOfIdentification?: string;
  IdCardPhoto: string;
  isUploaded?: boolean;
};

export type ModalComponentProps = {
  visible: boolean;
  onClose: () => void;
  success?: boolean;
};
