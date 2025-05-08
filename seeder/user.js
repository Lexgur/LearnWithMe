/*
CREATE TABLE `users` (
  `id` int UNSIGNED NOT NULL,
  `email` varchar(77) NOT NULL,
  `name` varchar(40) NOT NULL,
  `password` char(60) NOT NULL,
  `role` set('subscriber','free','admin','editor','teacher') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
*/

import { faker } from "@faker-js/faker";
import md5 from "md5";

export function createUser() {
  return {
    email: faker.internet.email(),
    name: faker.internet.username(),
    password: md5("123"),
    role: faker.helpers.arrayElement([
      "subscriber",
      "free",
    ]),
  };
}
export function createUserTeacher() {
  return {
    email: faker.internet.email(),
    name: faker.internet.username(),
    password: md5("123"),
    role: "teacher",
  };
}
export function createUserAdmin(name) {
  return {
    email: name + "@gmail.com",
    name: name,
    password: md5("123"),
    role: "admin",
  };
}
export function createUserEditor(name) {
  return {
    email: name + "@gmail.com",
    name: name,
    password: md5("123"),
    role: "editor",
  };
}
