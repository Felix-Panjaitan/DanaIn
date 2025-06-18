import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";
import { User } from "../../users/schemas/user.schema";

export enum PaymentMethodType {
  CREDIT_CARD = "CREDIT_CARD",
  DEBIT_CARD = "DEBIT_CARD",
  BANK_ACCOUNT = "BANK_ACCOUNT",
}

@Schema({ timestamps: true })
export class PaymentMethod extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "User", required: true })
  userId: User;

  @Prop({ required: true, enum: PaymentMethodType })
  type: PaymentMethodType;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  lastFour: string;

  @Prop()
  expiryDate: string;

  @Prop({ default: false })
  isDefault: boolean;
}

export const PaymentMethodSchema = SchemaFactory.createForClass(PaymentMethod);
