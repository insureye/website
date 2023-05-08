import { multispectral, deeplearning, smartcontract, teampics } from "../assets";

export const navLinks = [
  {
    id: "home",
    title: "Home",
  },
  {
    id: "features",
    title: "Features",
  },
  {
    id: "contactus",
    title: "Contact Us",
  },
];

export const hero = {
  title1: "Geospatial Intelligence",
  title2: "for the Insurance World",
  content: "  We use Earth Observation data to develop tailored Natural risk models. We define whether a property is exposed to risk and assess post event damage for insurance companies."
};

export const features = {
  title: "Physically based risk models for insurances",
  multispectral: {
    icon: multispectral,
    title: "Hyperspectral",
    content:
      "We use multisource EO data to extract environmental variables and parameters.",
  },
  deeplearning: {
    icon: deeplearning,
    title: "Deep learning",
    content:
      "Our machine learning fuses datasets to obtain enhanced spatial & spectral information fed to the risk model.",
  },
  smartcontract: {
    icon: smartcontract,
    title: "Smart contract",
    content:
      "Post event analysis assesses damage and triggers smart contract notifying the insurance.",
  },
};

export const cdescription = {
  title: "A complete product for insurance companies",
  content: "  We provide simple model output interpretation, represented as a risk map. Daily data update provides risk trend and monitoring capabilities. Immediate event acknowledgement starts the property damage assessment, reporting to the insurance company and client the percentage of loss.",
};

export const workflow = {
  title: "Our Eye's products",
  content: "Our activities can be subscribed as a package or singularly, depending on your needs. The complete workflow provides unmatched automatization and work streamlining.",
  step: [
    "Historical Analysis of risk variables in an area",
    "Evolution of risk exposition of tracked assets",
    "Catastrophe analysis for damages and claim settlement",
  ]
};

export const cta = {
  title: "Eager to take a share of the space economy",
  content: "We are a growing company making the most out of Earth Observation data for a better monitoring of Human-Earth interactions; help us grow investing on our capabilities and upcoming products:"
};

export const team = {
  title: "Team",
  content1: "Different backgrounds make us a stellar team.",
  content2: "Our experts will provide tailored solutions to your needs.",
  members: {
    'Daniele Francario': {
      image: teampics.francario,
      description: "Geodata Scientist, \nMsc Thesis on LEO-GEO Fusion for Aerosol Monitoring."
    },
    'Rabindranath Andujar': {
      image: teampics.ra,
      description: "Computer researcher, \nPhD Computational Physics."
    },
    'Giacomo Lazzeri': {
      image: teampics.giacomo,
      description: "Geoscientist, \nPhD candidate on Multi- and Hyper-spectral data fusion."
    },
    'Francisco Cardeñoso': {
      image: teampics.francisco,
      description: "Developer, Master student in physics."
    },
    'Daniele Franchi': {
      image: teampics.franchi,
      description: "Product designer."
    },
  }
}
