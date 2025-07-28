import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { OrdersModule } from './modules/orders/orders.module';

@Module({
  imports: [UsersModule, OrdersModule],
  providers: [],
})
export class AppModule {}
