import mongoose from 'mongoose';
import mongooseHistory from 'mongoose-history'
import { IStock } from '../interfaces/IStock';

var Schema = mongoose.Schema;
var stockSchema = new Schema({
  weight: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ["natural", "synthetic"],
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
}, { versionKey: '_version' });

stockSchema.plugin(mongooseHistory);

export default mongoose.model<IStock & mongoose.Document>('Stock', stockSchema);