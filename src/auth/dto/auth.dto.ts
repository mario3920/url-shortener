import { IsEmail, IsNotEmpty, IsUrl, MinLength } from "class-validator"

export class LogInAuthDto {

  @IsEmail(undefined, { message: "the provided email is invalid" })
  email: string

  @IsNotEmpty()
  password: string

}
