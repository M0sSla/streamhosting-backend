import { IsPasswordsMatchingConstraint } from "@/src/shared/decorators/is-passwords-matching-constraint.decorator";
import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsString, IsEmail, MinLength, IsUUID, Validate } from "class-validator";

@InputType()
export class NewPasswordInput {
    @Field(() => String)
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    public password: string;    

    @Field(() => String)
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @Validate(IsPasswordsMatchingConstraint)
    public passwordRepeat: string;  
    
    @Field(() => String)
    @IsUUID('4')
    @IsNotEmpty()
    public token: string;
}