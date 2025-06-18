import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Investment } from './entities/investment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Investment])],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule]
})
export class InvestmentsModule {}
