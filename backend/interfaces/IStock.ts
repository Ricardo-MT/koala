export interface IStock {
    _id: string;
    weight: number;
    type: "natural" | "synthetic";
    price: number;
}
