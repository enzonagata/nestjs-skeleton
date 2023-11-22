import { IsNotEmpty, IsString } from 'class-validator';

export class TestDTO {
  @IsNotEmpty()
  @IsString()
  name: string;
}
