import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { TransactionType } from "../schemas/transaction.schema";

export class CreateTransactionDto {
  @ApiProperty({ example: 100 })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ enum: TransactionType, example: TransactionType.PAYMENT })
  @IsEnum(TransactionType)
  @IsNotEmpty()
  type: TransactionType;

  @ApiProperty({ example: "Coffee payment" })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: "60d5ec9af682744800fecd8c", required: false })
  @IsString()
  @IsOptional()
  recipientId?: string;
}
