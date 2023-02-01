import {
  HttpResponse,
  HttpRequest,
  Controller,
  EmailValidator,
  AddAccount
} from "./signup-protocols";
import { MissingParamError, InvalidParamError } from "../../errors";
import { badRequest, serverError, ok } from "../../helpers/http-helper";

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator;
  private readonly addAccount: AddAccount;
  constructor(emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator;
    this.addAccount = addAccount;
  }
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = [
        "name",
        "email",
        "password",
        "passwordConfirmation",
      ];
      
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }

      const { name, email, password, passwordConfirmation } = httpRequest.body; 
      
      this.addAccount.add({ name, email, password})
      /*const account = this.addAccount.add({ name, email, password})
       if(account){
        return ok(account)
      } */

      const isValid = await this.emailValidator.isValid(email);
      if (!isValid) {
        return badRequest(new InvalidParamError("email"));
      }  

      if(passwordConfirmation){

        if (password !== passwordConfirmation) {
          return badRequest(new InvalidParamError("passwordConfirmation"));
        }      
      }
      
      
    
     

    } catch (error) {
      return serverError();
    }
  }
}
