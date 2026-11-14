import * as zod from "zod";

export const RegisterSchema = zod
  .object({
    name: zod
      .string()
      .nonempty("name is requierd")
      .min(3, "min length is 3 chars")
      .max(10, "max length is 10 chars"),

    email: zod
      .email()
      .nonempty("email is requierd")
      .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "invalid email"),

    dateOfBirth: zod
      .string()
      .nonempty("date is required")
      .refine((dateOfBirthValue) => {
        const userDate = new Date(dateOfBirthValue).getFullYear();
        const nowDate = new Date().getFullYear();
        return nowDate - userDate > 10 ? true : false;
      }, "Date should be less than  2015"),

    gender: zod.enum(["male", "female"]),

    password: zod
      .string()
      .nonempty("password is required")
      .regex(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
        "please enter the correct pass",
      ),

    rePassword: zod.string().nonempty("rePassword is required"),
  })
  .refine(
    (obj) => {
      if (obj.password === obj.rePassword) {
        return true;
      } else {
        return false;
      }
    },
    { path: ["rePassword"], message: "password and rePassword not match" },
  );

 export type RegisterSchemaType = zod.infer<typeof RegisterSchema>


 /////////////////////////////////////////////////////////////////////////////

 export const LoginSchema = zod
  .object({
    

    email: zod
      .email()
      .nonempty("email is requierd")
      .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "invalid email"),

  
  

    password: zod
      .string()
      .nonempty("password is required")
      .regex(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
        "please enter the correct pass",
      ),


  });

 export type LoginSchemaType = zod.infer<typeof LoginSchema>
