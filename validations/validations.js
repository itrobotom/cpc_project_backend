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
    body('title', 'Введите заголовок новости').isLength({ min: 3 }).isString(),
    body('text', 'Введите текст новости').isLength({ min: 3 }).isString(),
    body('typesProgramStore', 'Неверный формат типа программ').optional().isArray(),
    body('dateNewsFormat', 'Неверно указана дата').optional().isDate(), //было .isString()
    body('linkProgramm', 'Неверная ссылка на образовательную программу').optional().isString(),
    body('linkNews', 'Неверная ссылка источник новости').optional().isString(),
    body('imageUrl', 'Неверная ссылка на изображение').optional().isString(),
    body('programName', 'Неверный формат названия программы').optional().isString(),
]

export const programCreateValidation = [
    body('typesProgramKlimov', 'Отметьте подходщие пункты по Климову').optional().isArray(),
    body('typesProgram', 'Отметьте подходщие пункты по стандартной специализации').isArray(),
    body('titleProgram', 'Введите название образовательной программы').isLength({ min: 3 }).isString(),
    body('shortTitleProgram', 'Введите сокращенное название образовательной программы').isLength({ min: 3 }).isString(),
    body('linkVideo', 'Неверный формат ссылки на видео.').optional().isString(),
    body('commentVideo', 'Неверный формат комментария.').optional().isString(),
    body('linkGroup', 'Неверный формат ссылки на группу.').optional().isString(),
    body('isBudgetProgramm', 'Укажите тип услуги по финансированию.').isBoolean(),
    body('commentProgram', 'Неверный формат комментария к программе.').optional().isString(),
    body('ageRangeProgram', 'Укажите корректно две границы по возрасту').isArray(),
    body('numberStudents', 'Укажите корректно две границы по количеству обучащихся').isArray(),
    body('instructors', 'Укажите корректно данные педагога(ов)').isArray(),
    body('textProgram', 'Введите аннотацию программы минимиум 100 символов').isLength({ min: 10 }).isString(),
    body('imageUrl', 'Неверная ссылка на изображение').optional().isString(),
    body('linkPosts', 'Укажите корректно данные по событию').optional().isArray(),
    body('fileUrl', 'Проблема с загрузкой файла программы.').optional().isString(),
    body('arrLinkImg', 'Проблемы с сохранением ссылок изображений в массив').optional().isArray(),

]