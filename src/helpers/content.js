import SvgFace from './face';
import replaceVector from '../assets/Poseidon/replacevector.png'
import appStore from '../assets/Poseidon/appstore.svg'
import resize from '../assets/Poseidon/resize.png'

export const skillsCommon = {
  "React": 100,
  "HTML/CSS": 100,
  "UX design": 90,
  "Adobe Illustrator": 85,
  "TypeScript": 80,
  "Node.JS": 70,
  "Python/Django": 50,
  "C#/ASP.net": 40,
};

// These contain a "content" key that is a JSX function and can be returned in the modal directly. 
export const commonPortfolioItems = [{
  name: "EVO",
  Content: () => (
    <div>
      <img src="https://github.com/JDygard/EVO/raw/main/assets/images/readme/menu-screen.png" alt="EVO" style={{ width: "100%", height: "auto" }} />
      <img src="https://github.com/JDygard/EVO/raw/main/assets/images/readme/gameplay-screen.png" alt="EVO" style={{ width: "100%", height: "auto" }} />
      <h2>Overview</h2>
      <p><strong>Evo</strong> is an evolution-themed game where players advance through stages by eating food and defeating competitors. The goal is to reach round 4 and evolve the 'size' upgrade. Created by Joel Dygard using Phaser 3 and JavaScript.</p>

      <h2>Process</h2>
      <p>The development process began with establishing the game's structure, followed by iterative improvements and feature additions. The game was built with a focus on creating a challenging yet enjoyable experience, incorporating feedback mechanisms and visual rewards.</p>

      <h2>Key Features</h2>
      <ul>
        <li>Player Movement: Smooth controls and responsive physics.</li>
        <li>Scrolling Scene: Dynamic camera following the player.</li>
        <li>Collectible Food: Items to gather for evolution points.</li>
        <li>Enemy AI: Competitors with unique behaviors.</li>
        <li>Upgrades: Various evolution paths for player customization.</li>
        <li>Rounds System: Arcade-style progression through levels.</li>
      </ul>

      <h2>Technologies Used</h2>
      <ul>
        <li>Phaser 3: Game development framework.</li>
        <li>JavaScript: Core programming language.</li>
        <li>GIMP: Graphics and animation creation.</li>
        <li>HTML5 & CSS: Structuring and styling the game interface.</li>
        <li>GitHub Pages: Deployment platform.</li>
      </ul>

      <h2>Fun Factor</h2>
      <p>Evo is designed to be both challenging and fun. Players can explore different evolution strategies, enjoy smooth animations, and experience a rewarding gameplay loop. The game includes various upgrades and rounds to keep the gameplay engaging and dynamic.</p>

      <h2>Play and Explore</h2>
      <p>Experience Evo by playing it directly in your browser. Dive into the evolutionary journey and see how far you can evolve!</p>

      <div style={{ display: "block", marginBottom: "10px" }}>
        <a href="https://jdygard.github.io/EVO/">Play the game</a>
      </div>
      <div>
        <a href="https://github.com/JDygard/EVO">View the code/readme</a>
      </div>
    </div>
  )
},
{
  name: "CTP",
  Content: () => (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <p> Note: Due to a non-disclosure agreement, I am unable to share details or images specific to the platform. </p>
      <h1>Combine Technology Platform</h1>
      <h3>Summary</h3>
      <p> My work on the CTP is a full-stack, generalized HMI dashboard for quickly producing bespoke data science, machine learning and LLM solutions to customers.</p>
      <p> Having a generalized dashboard interface for the platform was my idea and responsibility. I produced design documents and concepts that lead to multiple funded prototypes and sales.</p>
      <p> For each customer, we were able to build more generalized components and capabilities, accelerating prototyping and finished products for future iterations.</p>
      <h3>Technologies Used</h3>
      <ul>
        <li>React/Redux: Central framework of the application</li>
        <li>Websockets</li>
        <li>Node.js/Express: Backend server</li>
        <li>Adobe Illustrator/Photoshop: Producing visual elements</li>
        <li>D3.js: Bespoke charts and data visualizations</li>
        <li>Figma: Producing design documents</li>
      </ul>
    </div>
  )
},
{
  name: "Reef Poseidon",
  Content: () => (
    <div>
      <h1>Poseidon Diving Systems</h1>
      <p>Reef is a full-stack app available for Mac, iOS, PC, and Android. I was brought on during the development life of the project to take over the development, maintenance, and client communication for the project.</p>
      <a href='https://play.google.com/store/apps/details?id=com.poseidon.reef&hl=en&gl=US&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1'><img style={{ margin: "0px 20px 20px", height: "55px", width: "auto" }} alt='Get it on Google Play' src='https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png' /></a>
      <a href="https://apps.apple.com/se/app/poseidon-reef/id1581432645?platform=ipad"><img style={{ margin: "0px 0px 28px 40px", height: "40px", width: "auto" }} src={appStore} alt='Download on the Mac app store'></img></a>

      <h3>Summary</h3>
      <p>My central goals upon inheriting the project were to increase accessibility, optimize the code for efficiency, and finish administrating the development, testing, and release of the latest version of the software.</p>

      <h3>Design Upgrades</h3>
      <div style={{ display: 'flex' }}>
        <figure style={{ flexShrink: 0, marginLeft: "0px", marginRight: "20px", width: "50%" }}>
          <img src={replaceVector} alt="Vector upgrade" style={{ maxWidth: "100%" }} />
          <figcaption>M28 Dive Computer graphic replaced with vector art.</figcaption>
        </figure>
        <div style={{ flexShrink: 0, maxWidth: "45%", marginRight: "20px" }}>
          <p>I created new vector art to replace placeholder images that remained in the app.</p>
          <p>I also overhauled many neglected components with new functionality, fine-tuned responsiveness for common devices, and much more.</p>
        </div>
      </div>

      <h3>Accessibility</h3>
      <div style={{ display: 'flex' }}>
        <ul style={{ flexShrink: 0, width: "50%", marginRight: '10px' }}>
          <li>I spearheaded a text-size adjustment functionality that provides responsive accessibility for visually impaired users, which included the refactoring of multiple visual components to accommodate the variable text. Shown below is standard vs. extra-large texts.</li>
        </ul>
        <figure style={{ flexShrink: 0, width: "25%", marginRight: "10px" }}>
          <img src={resize} style={{ height: "auto" }} alt="Accessibility" />
          <figcaption style={{ justifySelf: "center" }}>Tank configuration graphic in normal (top) and xlarge (bottom) text sizes.</figcaption>
        </figure>

      </div>


      <h3>Technologies Used</h3>
      <ul>
        <li>Adobe Photoshop/Illustrator: Used for vector images</li>
        <li>React/Redux: Central framework of the application</li>
        <li>Ionic: Enables hybrid development across multiple platforms</li>
        <li>Capacitor: Enables native mobile functionalities and cross-platform deployment from a single codebase.</li>
      </ul>
    </div>
  )
},
{
  name: "Redemptor Project",
  link: "",
  Content: () => (
    <div>
      <h1>Special System “Redemptor”</h1>
      <p><strong>Note:</strong> Due to the confidential nature of the work done on “Redemptor,” I cannot share images or specific details of the project.</p>

      <h2>Summary</h2>
      <p>During my tenure with the Redemptor project, I was privileged to play a pivotal role in the development and enhancement of the software. My primary responsibilities centered around:</p>

      <h3>Innovative Troubleshooting</h3>
      <p>I spearheaded the development of a troubleshooting component that empowers field personnel to resolve issues autonomously. This initiative will significantly reduce the dependency on support, streamlining operations and ensuring faster resolution times for our clients.</p>

      <h3>Optimization & Efficiency</h3>
      <p>With an eye for efficiency, I sought out areas within the Redemptor project that could benefit from optimization. My efforts led to enhanced performance, faster response times, and an overall more efficient user experience.</p>

      <h3>Design & Restructuring</h3>
      <p>Recognizing the evolving needs of our users and the industry landscape, I undertook comprehensive design overhauls to ensure the Redemptor complied with modern UX expectations, responsiveness, and efficiency. This involved restructuring various software components for better usability and adaptability.</p>

      <p>In all my endeavors with the Redemptor project, I maintained a staunch commitment to confidentiality and adhered strictly to the non-disclosure agreements in place. My work has always been focused on adding value, driving efficiency, and ensuring the best possible user experience for our clients.</p>

      <h2>Technology used</h2>
      <ul>
        <li><strong>Adobe Photoshop/Illustrator:</strong> Used in making vector graphics SVGs used to illustrate design schematics.</li>
        <li><strong>React/Redux:</strong> The central framework for the web app.</li>
      </ul>
    </div>
  )
}
];

const commonContactLinks = [
  { type: "Email", value: "joel.dygard@combine.se" },
  { type: "Phone", value: "+46-709933660" },
  { type: "LinkedIn", value: "https://www.linkedin.com/in/joel-dygard/" },
  { type: "GitHub", value: "https://github.com/JDygard/" },
];

const commonSkills = ["React", "JavaScript", "CSS", "Web Design"];

export const minimalistContent = {
  SvgComponent: SvgFace,
  personalDetails: {
    name: "Joel Dygard",
    role: "ambitious development.",
    about: "Passionate design, "
  },
  portfolioItems: commonPortfolioItems,
  contactLinks: commonContactLinks,
  skills: commonSkills
};

export const professionalContent = {
  SvgComponent: SvgFace,
  personalDetails: {
    name: "Joel Dygard",
    role: "Frontend Developer & Designer",
    about: "Passionate designer, ambitious developer."
  },
  portfolioItems: commonPortfolioItems,
  contactLinks: commonContactLinks,
  skills: commonSkills
};

export const technicalContent = {
  SvgComponent: SvgFace,
  personalDetails: {
    name: "Joel Dygard",
    role: "Frontend Developer & Designer",
    about: "Passionate designer, ambitious developer."
  },
  portfolioItems: commonPortfolioItems,
  contactLinks: commonContactLinks,
  skills: commonSkills
};
