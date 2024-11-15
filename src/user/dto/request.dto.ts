import { IsEmail, IsNotEmpty } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty({ message: 'Имя не может быть пустым' })
  name: string;

  @IsEmail({}, { message: 'Некорректный формат email' })
  email: string;

  @IsNotEmpty({ message: 'Пароль не может быть пустым' })
  password: string;
}
