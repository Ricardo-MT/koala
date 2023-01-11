import { IStock } from '../interfaces/IStock';
import Stock from '../models/stock.model';

class StockService {
    constructor() { }

    public getStock = async (): Promise<IStock[]> => {
        try {
            let err, stock = await Stock.find();
            if (err) throw err;
            return stock;
        } catch (e) {
            throw e;
        }
    }

    public createStock = async ({ type, weight }: { type: "natural" | "synthetic", weight: number }) => {
        try {
            let stock = await Stock.findOne({ type });
            if (stock) {
                stock.weight += weight;
                await stock.save();
            }
            else {
                stock = new Stock({ type, weight, price: 20 });
                await stock.save();
            }
            return stock;
        } catch (e) {
            throw e;
        }
    }
}

export default new StockService();