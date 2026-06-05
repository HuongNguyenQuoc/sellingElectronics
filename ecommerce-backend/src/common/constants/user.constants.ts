export enum UserRole {
  BUYER = 'buyer',
  SELLER = 'seller',
  ADMIN = 'admin'
}
/*
An enum is a way to define a set of named constants
Ex: const role = UserRole.BUYER;
*/

export const USER_ROLES = Object.values(UserRole) // returns an array containing all values of an object.
// -> ['buyer', 'seller', 'admin']