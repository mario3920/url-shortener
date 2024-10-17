import { IsNotEmpty, IsUrl } from "class-validator"

export class CreateUrlDto {

  @IsUrl()
  @IsNotEmpty({message: "Url cannot be empty"})
  url: string

}
