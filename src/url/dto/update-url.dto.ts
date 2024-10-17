import { IsNotEmpty, IsUrl } from "class-validator"

export class UpdateUrlDto {

  @IsUrl()
  @IsNotEmpty({message: "Url cannot be empty"})
  url: string

}
