import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocalController } from './local.controller';
import { Local } from './local.entity';
import { LocalService } from './local.service';

@Module({
  imports: [TypeOrmModule.forFeature([Local])],
  controllers: [LocalController],
  providers: [LocalService],
  exports: [LocalService],
})
export class LocalModule {}
