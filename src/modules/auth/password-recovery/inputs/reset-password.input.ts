import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsString, IsEmail } from "class-validator";

@InputType()
export class ResetPasswordInput {
    @Field(() => String)
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    public email: string;    
}