import { Request, Response } from 'express';
export declare const getAllRoomTypes: (req: Request, res: Response) => Promise<void>;
export declare const getRoomTypeById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createRoomType: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateRoomType: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteRoomType: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=roomTypes.controller.d.ts.map