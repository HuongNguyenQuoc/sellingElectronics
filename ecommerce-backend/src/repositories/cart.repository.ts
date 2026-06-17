import { HydratedDocument, Types } from 'mongoose';
import { Cart, ICart } from '../models/Cart';
/*
A hydratedDocument has Mongoose methods like:

cart.save();
cart.remove();
cart.validate();
*/

export class CartRepository {
  async findByUserId(userId: string) {
    return await Cart.findOne({ user: userId }).populate({
      path: 'items.product',
      select: 'title price thumbnail variants brandName',
    });
  }
  // populate means: replace product ids with actual product data.

  async findRawByUserId(userId: string): Promise<HydratedDocument<ICart> | null> {
    return await Cart.findOne({ user: userId });
  }

  async createForUser(userId: string): Promise<HydratedDocument<ICart>> {
    return await Cart.create({
      user: userId,
      items: [],
    });
  }

  async save(cart: HydratedDocument<ICart>) { // This method receives a Mongoose cart document
    return await cart.save(); // This cart has .save(); It will save the modified cart back to MongoDB
  }

  async clear(userId: string) {
    return await Cart.findOneAndUpdate(
      { user: userId }, // This is the filter, it means find the cart where user equals userId
      { $set: { items: [] } }, // $set means set a field to a new value. So it removes all products from the cart
      { new: true, upsert: true}
      /*
      { new: true } means return the updated document. Without new: true, Mongoose returns the old document before update.
      { upsert: true } means If cart exists -> update it and If not -> create. So if the user has no cart yet, this will create one with
       {
          "user": "userId",
          "items": []
       }
      */
    ).populate({
      path: 'items.product',
      select: 'title price thumbnail variants brandName',
    });
  }

  async removeItemsByIds(userId: string, itemIds: Types.ObjectId[]) {
    return await Cart.findOneAndUpdate(
      { user: userId},
      {
        $pull: {
          items: {
            _id: { $in: itemIds },
          },
        },
      },
      { new: true }
    ).populate({
      path: 'items.product',
      select: 'title price thumbnail variants brandName',
    });
  }
}
