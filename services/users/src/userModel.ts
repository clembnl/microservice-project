import mongoose, { Schema, Document } from 'mongoose';

interface User extends Document {
  name: string;
  email: string;
  order_ids: string[];
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  order_ids: [{ type: String }]
});

const UserModel = mongoose.model<User>('User', UserSchema);

export { UserModel, User };