import { body } from 'express-validator'

export const regValidation = [
    body('email', 'неверный формат почты').isEmail(),
    body('password', 'пароль должен быть минимум 5 символов').isLength({min: 5}),
    body('fullName', 'укажите имя').isLength({min: 3}),
    body('avatarUrl', 'неверная ссылка на аватарку').optional().isURL(),
]

export const autorizationValidation = [
    body('email', 'неверный формат почты').isEmail(),
    body('password', 'пароль должен быть минимум 5 символов').isLength({min: 5}),
]

export const newsCreateValidation = [
    body('title', 'Введит заголовок новости').isLength({ min: 3 }).isString(),
    body('text', 'Введите текст новости').isLength({ min: 3 }).isString(),
    body('tags', 'Неверный формат тэгов').optional().isString(),
    body('imageUrl', 'Неверная ссылка на изображение').optional().isString(),
]