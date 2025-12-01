import { Request, Response } from 'express';
export declare const getAllGuests: (req: Request, res: Response) => Promise<void>;
export declare const getGuestById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createGuest: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateGuest: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteGuest: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=guests.controller.d.ts.map