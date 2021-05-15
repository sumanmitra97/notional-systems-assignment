import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { titleCase } from 'title-case';

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: true })
  phone: string;

  @Prop({ required: true, unique: true })
  password: string;

  @Prop({ required: true })
  name: string;

  @Prop(raw({ name: { type: String }, data: { type: String } }))
  profileImage: Record<string, string>;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', function (this: User, next) {
  this.email = this.email.toLowerCase();
  this.name = titleCase(this.name);
  next();
});

export type UserDocument = User & Document;
