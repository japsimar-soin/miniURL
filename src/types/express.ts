/// <reference types="express" />

declare global {
  namespace Express {
    interface Request {
      userId?: import('mongoose').Types.ObjectId;
    }
  }
}

export {};
