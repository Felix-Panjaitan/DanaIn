import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateProjectDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  tagline?: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  fundingTarget: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(7)
  durationInDays: number;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  videoUrl?: string;

  @IsNotEmpty()
  @IsString()
  category: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  investmentScheme?: string;

  @IsOptional()
  @IsString()
  risks?: string;

  @IsOptional()
  @IsString()
  teamInfo?: string;

  @IsOptional()
  @IsString()
  proposalUrl?: string;

  @IsOptional()
  @IsString()
  presentationUrl?: string;
}
