import { ApiPropertyOptional } from "@nestjs/swagger"
import { IsNotEmpty, IsUrl } from "class-validator"

export class CreateUrlDto {

  @ApiPropertyOptional({ description: 'Link to shorten'})
  @IsUrl()
  @IsNotEmpty({message: "Url cannot be empty"})
  url: string

}
