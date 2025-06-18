import { Module } from "@nestjs/common";
import { DashboardController } from "./dashboard.controller";
import { DashboardService } from "./dashboard.service";
import { TransactionsModule } from "../transactions/transactions.module";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [TransactionsModule, UsersModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
