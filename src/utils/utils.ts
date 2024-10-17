import { BadRequestException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";


const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';


    // Função para gerar um código encurtado de 6 caracteres
    export function generateShortCode(length:number = 6):string {
        let shortCode:string = '';
        for (let i = 0; i < length; i++) {
            const randomIndex:number = Math.floor(Math.random() * characters.length);
            shortCode += characters[randomIndex];
        }
        return shortCode;
    }

    export async function jwtDecodeGetId(jwtService:JwtService, authorization:string) {
        if(authorization){
            const [type, token] = authorization.split(' ')
            const {id} = await jwtService.decode(token)
            return id
        }
        return null
    }

    export function isValidId(id:string){
        if(isNaN(parseInt(id))) throw new BadRequestException('ID must be a number');
    }