import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TesteModule } from './teste/teste.module';
import { WhatsModule } from './whats/whats.module';

@Module({
  imports: [ ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type:     'postgres',
      host:     process.env.DB_HOST,
      port:     +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true
      
    }),AuthModule, TesteModule, WhatsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
