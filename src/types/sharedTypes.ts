import { IUser } from "./userTypes";

declare global {
  namespace Express {
    interface Request {
      user: IUser;
    }
  }
}
export interface IAnyObject {
  [key: string]: any;
}

export interface IError extends Error {
  statusCode?: number;
  status?: string;
  code?: number;
  isOperational?: boolean;
}

export interface ICheckoutSessionRequest {
  cartItems: {
    menuItemId: string;
    name: string;
    quantity: string;
  }[];
  deliveryDetails: {
    email: string;
    name: string;
    addressLine1: string;
    city: string;
  };
  restaurantId: string;
}
