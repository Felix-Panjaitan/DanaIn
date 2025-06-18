import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import {
  PaymentMethod,
  PaymentMethodSchema,
} from "./schemas/payment-method.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PaymentMethod.name, schema: PaymentMethodSchema },
    ]),
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class PaymentMethodsModule {}
