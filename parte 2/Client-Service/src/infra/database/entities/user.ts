import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<UserModel>;

@Schema({ collection: 'user' })
export class UserModel {
  constructor(userModel: UserDocument) {
    Object.keys(userModel).map((key) => (this[key] = userModel[key]));

    this._id = userModel.id;
  }

  @Prop()
  _id?: string;

  @Prop({ _id: true })
  id: string;

  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  password_hash: string;

  @Prop()
  createdAt: Date;
  @Prop()
  updatedAt?: Date;

  @Prop()
  deletedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(UserModel);
