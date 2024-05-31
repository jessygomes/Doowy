export const headerLinks = [
  {
    label: "Accueil",
    route: "/",
  },
  {
    label: "Créer un Event",
    route: "/events/create",
  },
  {
    label: "Profils",
    route: "/profils",
  },
];

export const eventDefaultValues = {
  title: "",
  description: "",
  location: "",
  city: "",
  imageUrl: "",
  startDateTime: new Date(),
  endDateTime: new Date(),
  categoryId: "",
  price: "",
  isFree: false,
  url: "",
};
