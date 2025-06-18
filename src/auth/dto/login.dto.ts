import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
  @ApiProperty({ example: "johndoe" })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ example: "password123" })
  @IsNotEmpty()
  @IsString()
  password: string;
}
