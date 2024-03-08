import express from "express"

import mongoose from "mongoose"

import cors from 'cors'

import { regValidation, autorizationValidation, newsCreateValidation, programCreateValidation } from "./validations/validations.js"

import checkAuth from "./middleware/checkAuth.js"

import { checkAuthEmail } from "./middleware/checkAuthEmail.js"

import { autorization, registration, getMeInfo } from "./controllers/UsersControl.js"

import { createNews, getAllNews, deleteNews, updateNews, getOneNews } from "./controllers/NewsControl.js"

import { createProgram, getAllPrograms, deleteProgram, updateProgram, getOneProgram, deleteFileHandler, deletePhotoHandler } from "./controllers/ProgramControl.js"

import validationErrReq from "./middleware/validationErrReq.js"

import multer from "multer"

mongoose.connect('mongodb+srv://admin:YoClQoFph0bQdLKL@cluster0.2c9tmdy.mongodb.net/?retryWrites=true&w=majority')
    .then(()=> console.log("Connect mongo"))
    .catch((err) => console.log("Error connect mongo", err));

const PORT = 5000;

const app = express();
app.use(express.json());
app.use(cors()); //добавляем для снятия запрета делать запросы на сервер с других доменов

//реагиреум на запрос по корневому адресу (клиент получает данные с сервера - get запрос)
app.get('/', (req, res) => {
    console.log(req.query);  
    res.status(200).json('Сервер работает!!!');
})

//мидлвар validationErrReq парсит ошибки, которые могли возникнуть при валидации авторизации autorizationValidation или регистрации regValidation
//запрос на авторизацию
app.post("/auth/login", autorizationValidation, validationErrReq, autorization);

//запрос на регистрацию и проверяем сразу на валидность на сервере
app.post('/auth/register', regValidation, validationErrReq, registration);

//запрос на получение информации о себе
app.get('/auth/me', checkAuth, getMeInfo);

//запрос на создание программы
app.post('/program', checkAuth, programCreateValidation, validationErrReq, createProgram);

//получение всех программ
app.get('/programs', checkAuthEmail, getAllPrograms); 

//получение одной программы по id
app.get('/programs/:id', checkAuthEmail, getOneProgram);

//удаление одной программы (для редактирования, поэтому проверка авторизации)
app.delete('/program/:id', checkAuth, deleteProgram);

//редактирование программы
app.patch('/program/:id', checkAuth, programCreateValidation, updateProgram);

app.use('/uploads', express.static('uploads')); //ждем get запрос на получение статичного файла
//создаем хранилище
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        let folder = 'uploads/newsImage'; // По умолчанию загружаем изображения сюда (в фото новостей)
        if (req.url === '/uploads_news_image_poster') { // Если URL соответствует загрузке постера, сохраняем в другую папку
            folder = 'uploads/postersPrograms';
        }
        else if(req.url === '/uploads_file_program') {
            folder = 'uploads/programFile';
        }
        else if(req.url === '/uploads_image_program') {
            folder = 'uploads/programImage';
        }
        callback(null, folder);
    },
    filename: (_, file, callback) => {
        callback(null, file.originalname);
    },
});

const upload = multer({ storage }); // Создаем экземпляр multer с хранилищем

//запрос на загрузку изображения для новости (используя мидлвэйр checkAuth, чтобы кто угодно не мог загрузить картинку)
app.post('/uploads_news_image', checkAuth, upload.single('image'), async (req, res) => { // тип загружаемых файлов 'image' 
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Файл не был загружен' });
        }
        // Здесь можно добавить код для проверки размера файла и его обработки, пока реализовал на фронтеде
        res.json({
            url: `/uploads/newsImage/${req.file.originalname}`,//originalname - имя пришедшее с фронтеда (там оно генерируется уникальным)
        });
    } catch (error) {
        console.error('Ошибка при загрузке и обработке изображения:', error);
        res.status(500).json({ error: 'Произошла ошибка при загрузке и обработке изображения' });
    }
});


//запрос на загрузку изображения постера образовательной программы (используя мидлвэйр checkAuth, чтобы кто угодно не мог загрузить картинку)
app.post('/uploads_news_image_poster', checkAuth, upload.single('image'), async (req, res) => { // тип загружаемых файлов 'image' 
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Файл не был загружен' });
        }
        // Здесь можно добавить код для проверки размера файла и его обработки, пока реализовал на фронтеде
        res.json({
            url: `/uploads/postersPrograms/${req.file.originalname}`,//originalname - имя пришедшее с фронтеда (там оно генерируется уникальным)
        });
    } catch (error) {
        console.error('Ошибка при загрузке и обработке изображения:', error);
        res.status(500).json({ error: 'Произошла ошибка при загрузке и обработке изображения' });
    }
});

//запрос на загрузку изображения для образовательной программы
app.post('/uploads_image_program', checkAuth, upload.single('image'), async (req, res) => { // тип загружаемых файлов 'image' 
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Файл не был загружен' });
        }
        // Здесь можно добавить код для проверки размера файла и его обработки, пока реализовал на фронтеде
        res.json({
            url: `/uploads/programImage/${req.file.originalname}`,//originalname - имя пришедшее с фронтеда (там оно генерируется уникальным)
        });
    } catch (error) {
        console.error('Ошибка при загрузке и обработке изображения:', error);
        res.status(500).json({ error: 'Произошла ошибка при загрузке и обработке изображения' });
    }
});


//запрос на загрузку файла образовательной программы
app.post('/uploads_file_program', checkAuth, upload.single('file'), async (req, res) => { // тип загружаемых файлов 'file' 
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Файл не был загружен' });
        }
        // Здесь можно добавить код для проверки размера файла и его обработки, пока реализовал на фронтеде
        res.json({
            url: `/uploads/programFile/${req.file.originalname}`,//originalname - имя пришедшее с фронтеда (там оно генерируется уникальным)
        });
    } catch (error) {
        console.error('Ошибка при загрузке и обработке файла:', error);
        res.status(500).json({ error: 'Произошла ошибка при загрузке и обработке файла' });
    }
});

//удаление файла
//app.delete('/addProgram/:fileName', checkAuth, deleteFileHandler);
app.delete('/uploads/programFile/:fileName', checkAuth, deleteFileHandler);

//удаление постера
app.delete('/uploads/postersPrograms/:fileName', checkAuth, (req, res) => deletePhotoHandler(req, res, "postersPrograms"));

//удаление фото к программе
app.delete('/uploads/programImage/:fileName', checkAuth, (req, res) => deletePhotoHandler(req, res, "programImage"));




//НОВОСТИ
//запрос на создание новости
app.post('/news', checkAuth, newsCreateValidation, validationErrReq, createNews);

//получение всех новостей
app.get('/news', getAllNews); 

//удаление одной новости (для редактирования, поэтому проверка авторизации)
app.delete('/news/:id', checkAuth, deleteNews);

//удаление фото новости
app.delete('/uploads/newsImage/:fileName', checkAuth, (req, res) => deletePhotoHandler(req, res, "newsImage"));

//редактирование новости
app.patch('/news/:id', checkAuth, newsCreateValidation, updateNews);

//получение данных одной статьи (пока только для редактирования т.к. не вывожу отдельно инфу для одной статьи)
app.get('/news/:id', getOneNews);

//чтобы все методы выше работали и мы отдавали клиенту информацию или принималее ее от него, то надо стартануть приложению и слушать порт
//()=> обычный колбэк, который выполнится сразу после запуска порт и выведется информация о том, что приложение стартовало на таком то порту
app.listen(PORT, (err) => {
    if (err) {
        return console.log(err); 
    }
    console.log("server start", + PORT);
});



// для регистрации нужно отправить запрос с телом
// {
// 	"email": "11111@mail.ru",
// 	"password": "111111",
// 	"fullName": "Ale Mule",
// 	"avatarUrl": "https://heldfbpme1s.ru/uroki-po-vnutrennemu-yazyku-programmirovaniya-1s-8-3-dlya-nachinayushhix-programmistov" 
// }

// для авторизации нужно отправить get запрос с

// для получения информации о пользователе нужно отправить get запрос с токеном
//расшифровка токена https://jwt.io/

//для создания новости нужно отправить запрос на адрес http://localhost:5000/news
// {
// 	"title": "Новая статья",
// 	"text": "sffffddff",
// 	"tags": ["fwdf", "sdf", "fds"]
// }