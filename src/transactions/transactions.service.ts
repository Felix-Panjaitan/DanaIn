import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Transaction, TransactionType } from "./schemas/transaction.schema";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { UsersService } from "../users/users.service";

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
    private usersService: UsersService
  ) {}

  async create(
    userId: string,
    createTransactionDto: CreateTransactionDto
  ): Promise<Transaction> {
    const { amount, type, description, recipientId } = createTransactionDto;

    // Get user
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    // Process based on transaction type
    if (type === TransactionType.PAYMENT || type === TransactionType.TRANSFER) {
      if (user.balance < amount) {
        throw new BadRequestException("Insufficient balance");
      }

      // Deduct from user balance
      await this.usersService.updateBalance(userId, -amount);

      // If transfer, add to recipient balance
      if (type === TransactionType.TRANSFER && recipientId) {
        const recipient = await this.usersService.findById(recipientId);
        if (!recipient) {
          // Refund the sender
          await this.usersService.updateBalance(userId, amount);
          throw new NotFoundException("Recipient not found");
        }

        await this.usersService.updateBalance(recipientId, amount);
      }
    } else if (type === TransactionType.DEPOSIT) {
      // Add to user balance
      await this.usersService.updateBalance(userId, amount);
    }

    // Create transaction
    const transaction = new this.transactionModel({
      userId,
      amount,
      type,
      description,
      recipientId: recipientId || null,
    });

    return transaction.save();
  }

  async findAllByUserId(userId: string): Promise<Transaction[]> {
    return this.transactionModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string, userId: string): Promise<Transaction> {
    const transaction = await this.transactionModel
      .findOne({ _id: id, userId })
      .exec();

    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }

    return transaction;
  }
}
