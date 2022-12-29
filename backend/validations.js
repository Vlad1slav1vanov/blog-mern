import { body } from "express-validator";

export const loginValidation = [
  body('email', 'Неверный формат почты').isEmail(),
  body('password', 'Пароль должен быть не менее 5 символов').isLength({ min: 5}),
];

export const registerValidation = [
  body('email', 'Неверный формат почты').isEmail(),
  body('password', 'Пароль должен быть не менее 5 символов').isLength({ min: 5}),
  body('fullName', 'Укажите имя').isLength({min: 3}),
  body('avatarUrl', 'Неверная ссылка на аватарку').optional().isString(),
];

export const postCreateValidation = [
  body('title', 'Введите заголовок статьи').isLength({ min: 1 }).isString(),
  body('text', 'Введите текст статьи').isLength({ min: 5}).isString(),
  body('tags', 'Неверный формат тегов (Укажите массив)').optional().isArray(),
  body('imageUrl', 'Неверная ссылка на изображение').optional().isString(),
];

export const commentCreateValidation = [
  body('text', 'Введите текст комментария').isLength({ min: 1}).isString(),
];

