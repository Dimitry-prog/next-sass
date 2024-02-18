export const navLinks = [
  {
    label: 'Home',
    route: '/',
    icon: '/icons/home.svg',
  },
  {
    label: 'Image Restore',
    route: '/transformations/create/restore',
    icon: '/icons/image.svg',
  },
  {
    label: 'Generative Fill',
    route: '/transformations/create/fill',
    icon: '/icons/stars.svg',
  },
  {
    label: 'Object Remove',
    route: '/transformations/create/remove',
    icon: '/icons/scan.svg',
  },
  {
    label: 'Object Recolor',
    route: '/transformations/create/recolor',
    icon: '/icons/filter.svg',
  },
  {
    label: 'Background Remove',
    route: '/transformations/create/removeBackground',
    icon: '/icons/camera.svg',
  },
];

export const navSettingLinks = [
  {
    label: 'Profile',
    route: '/profile',
    icon: '/icons/profile.svg',
  },
  {
    label: 'Buy Credits',
    route: '/credits',
    icon: '/icons/bag.svg',
  },
];

export const transformationTypes = {
  restore: {
    type: 'restore',
    title: 'Restore Image',
    subtitle: 'Refine images by removing noise and imperfections',
    config: { restore: true },
    icon: 'image.svg',
  },
  removeBackground: {
    type: 'removeBackground',
    title: 'Background Remove',
    subtitle: 'Removes the background of the image using AI',
    config: { removeBackground: true },
    icon: 'camera.svg',
  },
  fill: {
    type: 'fill',
    title: 'Generative Fill',
    subtitle: "Enhance an image's dimensions using AI outpainting",
    config: { fillBackground: true },
    icon: 'stars.svg',
  },
  remove: {
    type: 'remove',
    title: 'Object Remove',
    subtitle: 'Identify and eliminate objects from images',
    config: {
      remove: { prompt: '', removeShadow: true, multiple: true },
    },
    icon: 'scan.svg',
  },
  recolor: {
    type: 'recolor',
    title: 'Object Recolor',
    subtitle: 'Identify and recolor objects from the image',
    config: {
      recolor: { prompt: '', to: '', multiple: true },
    },
    icon: 'filter.svg',
  },
};
