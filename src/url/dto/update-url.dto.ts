import { ApiPropertyOptional } from "@nestjs/swagger"
import { IsNotEmpty, IsUrl } from "class-validator"

export class UpdateUrlDto {

  @ApiPropertyOptional({ description: 'Link to shorten'})
  @IsUrl()
  @IsNotEmpty({message: "Url cannot be empty"})
  url: string

}
