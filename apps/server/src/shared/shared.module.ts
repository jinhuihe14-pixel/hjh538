import { Module, Global } from '@nestjs/common';
import { AttrCalculator } from './services/attr-calculator.service';

@Global()
@Module({
  providers: [AttrCalculator],
  exports: [AttrCalculator],
})
export class SharedModule {}
