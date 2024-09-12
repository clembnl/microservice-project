import mongoose, { Schema, Document } from 'mongoose';

export interface Product extends Document {
  name: string;
  price: number;
  description?: string;
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String }
});

const ProductModel = mongoose.model<Product>('Product', ProductSchema);

export { ProductModel };