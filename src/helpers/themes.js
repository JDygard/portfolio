export const minimalistTheme = {
    name: "minimalist",
    primaryFont: "Montserrat",
    primaryColor: "#fbf8f2",
    secondaryColor: "#3a3d48;",
    background: "",
    gridTemplate: `
      "details details details pic pic pic pic pic portfolio portfolio portfolio"
      "contacts contacts contacts pic pic pic pic pic skills skills skills"
    `,

    personalDetails: {
        textAlign: 'right',
        justifyContent: 'end',
        flexDirection: 'column-reverse',
    },

    contactLinks: {
        justifyContent: 'end',
    },

    profilePicture: {
        width: "100%",
        height: "auto",
        svgWidth: "100%",
        svgHeight: "auto",
        animation: `
          @keyframes draw {
            to {
              stroke-dashoffset: 0;
            }
          }
        `,
        animationName: "draw",
        animationDuration: "4s",
        animationFillMode: "forwards",
    },
};

export const groovyTheme = {
    name: "Technical",
    primaryFont: "'GroovyFont', sans-serif",
    primaryColor: "purple",
    secondaryColor: "gold",
    background: "url('path_to_groovy_background.jpg')",
    gridTemplate: `
      "details details details pic pic pic pic pic portfolio portfolio portfolio"
      "contacts contacts contacts pic pic pic pic pic skills skills skills"
    `,

    profilePicture: {
        width: "auto",
        height: "auto",
        svgWidth: "auto",
        svgHeight: "auto",
    },
    contactLinks: {
        justifyContent: 'end',
    },
};

export const artsyTheme = {
    name: "artsy",
    primaryFont: "'ArtsyFont', sans-serif",
    primaryColor: "pink",
    secondaryColor: "navy",
    background: "url('path_to_artsy_background.jpg')",

    profilePicture: {
        width: "140px",
        height: "210px",
        svgWidth: "100%",
        svgHeight: "100%",
    },
    contactLinks: {
        justifyContent: 'end',
    },
};
