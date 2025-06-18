import { Injectable } from "@nestjs/common";
import { TransactionsService } from "../transactions/transactions.service";
import { UsersService } from "../users/users.service";

@Injectable()
export class DashboardService {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly usersService: UsersService
  ) {}

  async getDashboardData(userId: string) {
    // Get user info
    const user = await this.usersService.findById(userId);

    // Get recent transactions
    const transactions = await this.transactionsService.findAllByUserId(userId);
    const recentTransactions = transactions.slice(0, 5);

    // Create dashboard data object
    return {
      balance: user.balance,
      recentTransactions,
    };
  }
}
