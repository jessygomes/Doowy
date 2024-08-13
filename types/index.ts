// ====== USER PARAMS
export type CreateUserParams = {
  clerkId: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  photo: string;
  departement: string;
  role: string;
};

export type UpdateUserParams = {
  userId: string;
  user: {
    firstName: string;
    lastName: string;
    description?: string;
    // photo: string;
    instagram?: string;
    twitter?: string;
    tiktok?: string;
  };
  path: string;
};

export type GetUserParams = {
  firstName: string;
  lastName: string;
  username: string;
  photo: string;
  description: string;
  instagram: string;
  twitter: string;
  tiktok: string;
  followers: string[];
  following: string[];
  role: string;
};

// ====== EVENT PARAMS

export type CreateEventParams = {
  userId?: string;
  event: {
    title: string;
    description: string;
    location: string;
    departement: string;
    imageUrl: string;
    startDateTime: Date;
    endDateTime: Date;
    category: string;
    price: string;
    isFree: boolean;
    url: string;
  };
  path: string;
};

export type UpdateEventParams = {
  userId?: string;
  event: {
    id: string;
    title: string;
    imageUrl: string;
    description: string;
    location: string;
    departement: string;
    startDateTime: Date;
    endDateTime: Date;
    category: string;
    price: string;
    isFree: boolean;
    url: string;
  };
  path: string;
};

export type DeleteEventParams = {
  eventId: string;
  path: string;
};

export type DeleteUserParams = {
  userId: string;
  path: string;
};

export type GetAllEventsParams = {
  query: string;
  category: string;
  departement: string;
  limit: number;
  page: number;
  nbFav: number;
};

export type GetEventsByUserParams = {
  userId?: string;
  limit?: number;
  page: number;
};

export type GetRelatedEventsByCategoryParams = {
  categoryId?: string;
  departementId: string;
  eventId: string;
  limit?: number;
  page: number | string;
  nbFav?: number;
};

export type GetFavoriteEvent = {
  userId: string;
  eventId: string;
  limit?: number;
  page: number | string;
};

export type GetSuscriptionEvent = {
  userId: string;
  limit?: number;
  page: number | string;
};

export type Event = {
  id: string;
  title: string;
  description?: string;
  price: string | null;
  isFree: boolean;
  imageUrl: string;
  location: string;
  departement?: string;
  startDateTime: Date;
  endDateTime: Date;
  url?: string | null;
  organizer?: string;
  category?: string | null;
  nbFav: number;
  Category: {
    name?: string;
  } | null;
  Organizer: {
    id?: string;
    organizationName?: string;
    name?: string;
  };
  updatedAt?: Date;
};

// ====== CATEGORY PARAMS
export type CreateCategoryParams = {
  categoryName: string;
};

// ====== ORDER PARAMS
export type CheckoutOrderParams = {
  eventTitle: string;
  eventId: string;
  price: string;
  isFree: boolean;
  buyerId: string;
};

export type CreateOrderParams = {
  stripeId: string;
  eventId: string;
  buyerId: string;
  totalAmount: string;
  createdAt: Date;
};

export type GetOrdersByEventParams = {
  eventId: string;
  searchString: string;
};

export type GetOrdersByUserParams = {
  userId: string | null;
  limit?: number;
  page: string | number | null;
};

// ====== URL QUERY PARAMS
export type UrlQueryParams = {
  params: string;
  key: string;
  value: string | null;
};

export type RemoveUrlQueryParams = {
  params: string;
  keysToRemove: string[];
};

export type SearchParamProps = {
  page?: number;
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};
