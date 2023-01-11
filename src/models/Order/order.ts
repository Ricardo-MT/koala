import { ITYPE } from "../Drink/drink";

export interface IOrder {
    user: number;
    type: ITYPE;
    timestamp: number;
};
