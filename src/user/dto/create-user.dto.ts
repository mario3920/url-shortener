import { IsEmail, IsNotEmpty, MinLength } from "class-validator"

export class CreateUserDto {

  @IsNotEmpty({message: "Name cannot be empty"})
  name: string

  @IsEmail(undefined, { message: "the provided email is invalid" })
  email: string

  @IsNotEmpty()
  @MinLength(6, { message: 'the password need at least 6 characters' })
  password: string

}
