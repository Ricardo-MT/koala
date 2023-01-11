import { randomBytes } from 'crypto';
import argon2 from 'argon2';
import { IUser } from '../interfaces/IUser';
import mongoose from 'mongoose';
import mongooseHistory from 'mongoose-history'

var Schema = mongoose.Schema;
var usuarioSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 3,
    trim: true,
    select: false
  },
  salt: {
    type: Buffer,
    required: true,
    select: false
  },
  updated_for: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
  }
}, { versionKey: '_version' });

usuarioSchema.plugin(mongooseHistory);

usuarioSchema.methods.encryptPassword = async function (password: string): Promise<{ salt: Buffer, hashedPassword: string }> {
  try {
    const salt = randomBytes(32);
    const hashedPassword = await argon2.hash(password, { salt })

    return { salt, hashedPassword };
  } catch (err) {
    throw err;
  }

};

usuarioSchema.methods.validPassword = async function (password: string): Promise<Boolean> {
  return await argon2.verify((this as any).password, password);
};
export default mongoose.model<IUser & mongoose.Document>('Usuario', usuarioSchema);