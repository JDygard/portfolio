import SvgFace from './face';

const contactLinks = [
  { type: "Email", value: "jdygard@gmail.com" },
  { type: "Phone", value: "+46-709933660" },
  { type: "LinkedIn", value: "https://www.linkedin.com/in/joel-dygard/" },
  { type: "GitHub", value: "https://github.com/JDygard/" },
];

export const content = {
  SvgComponent: SvgFace,
  personalDetails: {
    name: "Joel Dygard",
    role: "ambitious development.",
    about: "Passionate design, "
  },
  contactLinks,
};
