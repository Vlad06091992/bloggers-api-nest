import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, HydratedDocument, Model } from 'mongoose';
import { pagination } from 'src/utils';

export type CatDocument = HydratedDocument<User>;

@Schema()
export class RegistrationData {
  @Prop({ required: true })
  confirmationCode: string;

  @Prop({ required: true })
  registrationData: string;

  @Prop({ required: true })
  isConfirmed: boolean;
}

export const RegistrationDataSchema =
  SchemaFactory.createForClass(RegistrationData);

@Schema()
export class User {
  @Prop()
  _id: Types.ObjectId;

  @Prop()
  id: string;

  @Prop()
  email: string;

  @Prop()
  login: string;

  @Prop()
  createdAt: string;

  @Prop()
  password: string;

  @Prop({ default: {}, required: true, type: RegistrationData })
  registrationData: RegistrationData;

  // static pagination = pagination;
}

interface UserStatics {
  pagination: (params: any, projection: any) => any;
}

export const UserSchema = SchemaFactory.createForClass(User);
//
//
UserSchema.statics = {
  pagination: pagination,
};
//
export type UserModel = Model<User> & UserStatics;
