import { Joi, Segments } from "celebrate";
import {
  Role,
  UserStatus,
  Availability,
  UserInterface,
  AddressInterface,
} from "@typings/user";

/**
 * Function representing the Validation check for app auth post requests
 * @description Validate user inputs on both signin and signup auth request
 */

export default {
  /**
   * @description Validate user signup inputs
   * @param {body} req - Request property object gotten from the request
   * @property {role} body.role - User role
   * @property {email} body.email - User email
   * @property {dob} body.dob - User data of birth
   * @property {address} body.address - User address
   * @property {password} body.password - User password
   * @property {last_name} body.last_name - User last name
   * @property {avatar} body.avatar - User profile image
   * @property {first_name} body.first_name - User first name
   * @property {is_verified} body.is_verified - User been verified or not
   * @returns {UserInterface} {UserInterface} Returns the Request object after validating user inputs from req.body
   */
  signupUser: {
    [Segments.BODY]: Joi.object<UserInterface>().keys({
      role: Joi.string()
        .valid(Role.CUSTOMER, Role.ADMIN)
        .default(Role.CUSTOMER)
        .lowercase(),

      is_delete: Joi.boolean().default(false),
      is_verified: Joi.boolean().default(false),
      phone: Joi.string().lowercase().required(),
      password: Joi.string().min(6).max(20).required(),
      email: Joi.string().email().lowercase().required(),
      last_name: Joi.string().min(5).max(255).lowercase().required(),
      first_name: Joi.string().min(5).max(255).lowercase().required(),
      image: Joi.string()
        .lowercase()
        .default(
          "https://drive.google.com/uc?view=&id=14SY6cRWX2ojTeynq1d_E9O1aIA-2l5Jp"
        ),
    }),
  },

  /**
   * @description Validate user signin inputs
   * @param {body} req - Request property object gotten from the request
   * @property {email} body.email - User email
   * @property {password} body.password - User password
   * @returns {UserInterface} {UserInterface} Returns the Request object after validating user inputs from req.body
   */
  signinUser: {
    [Segments.BODY]: Joi.object().keys({
      phone: Joi.string().lowercase().required(),
      password: Joi.string().min(6).max(20).required(),
    }),
  },

  /**
   * @description Validate user profile update inputs
   * @param {body} req - Request property object gotten from the request
   * @property {email} body.email - User email
   * @property {password} body.password - User password
   * @returns {UserInterface} {UserInterface} Returns the Request object after validating user inputs from req.body
   */
  updateUser: {
    [Segments.BODY]: Joi.object({
      role: Joi.string()
        .valid(Role.CUSTOMER, Role.AGENT, Role.ADMIN, Role.SUPER_ADMIN)
        .default(Role.CUSTOMER)
        .lowercase(),
      address: Joi.object<AddressInterface>({
        city: Joi.string().lowercase().label("city").messages({
          "string.empty": `{#label} can not be empty`,
          "any.required": `{#label} is required`,
        }),
        state: Joi.string().lowercase().label("state").messages({
          "string.empty": `{#label} can not be empty`,
          "any.required": `{#label} is required`,
        }),
        country: Joi.string().lowercase().label("country").messages({
          "string.empty": `{#label} can not be empty`,
          "any.required": `{#label} is required`,
        }),
        address: Joi.string().lowercase().label("address").messages({
          "string.empty": `{#label} can not be empty`,
          "any.required": `{#label} is required`,
        }),
        postal_code: Joi.string().lowercase(),
      }),
      status: Joi.string()
        .valid(UserStatus.ONLINE, UserStatus.OFFLINE)
        .default(UserStatus.ONLINE)
        .lowercase(),
      availability: Joi.when("role", {
        is: Role.AGENT,
        then: Joi.string()
          .valid(Availability.DELIVERY, Availability.PICK_UP)
          .default(Availability.DELIVERY)
          .lowercase(),
      }),
      is_delete: Joi.boolean(),
      is_verified: Joi.boolean(),
      image: Joi.string().lowercase(),
      phone: Joi.string().lowercase(),
      password: Joi.string().min(6).max(20),
      email: Joi.string().email().lowercase(),
      last_name: Joi.string().min(5).max(255).lowercase(),
      first_name: Joi.string().min(5).max(255).lowercase(),
    })
      .label("field")
      .or(
        "role",
        "email",
        "phone",
        "image",
        "status",
        "address",
        "password",
        "is_delete",
        "last_name",
        "first_name",
        "is_verified",
        "availability"
      ),
  },

  /**
   * @description Validate user signin inputs
   * @param {body} req - Request property object gotten from the request
   * @property {email} body.email - User email
   * @property {password} body.password - User password
   * @returns {UserInterface} {UserInterface} Returns the Request object after validating user inputs from req.body
   */
  deleteUser: {
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.string().guid({ version: "uuidv4" }).required(),
    }),
  },
};
