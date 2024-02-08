import express from "express"

import mongoose from "mongoose"

import cors from 'cors'

import { regValidation, autorizationValidation, newsCreateValidation } from "./validations/validations.js"

import checkAuth from "./middleware/checkAuth.js"

import { autorization, registration, getMeInfo } from "./controllers/UsersControl.js"

import { createNews, getAllNews, deleteNews, updateNews, getOneNews } from "./controllers/NewsControl.js"

import validationErrReq from "./middleware/validationErrReq.js"

import multer from "multer"

mongoose.connect('mongodb+srv://admin:YoClQoFph0bQdLKL@cluster0.2c9tmdy.mongodb.net/?retryWrites=true&w=majority')
    .then(()=> console.log("Connect mongo"))
    .catch((err) => console.log("Error connect mongo", err));

const PORT = 5000;

const app = express();
app.use(express.json());
app.use(cors()); //добавляем для снятия запрета делать запросы на сервер с других доменов

app.use('/uploads', express.static('uploads')); //ждем get запрос на получение статичного файла

//создаем хранилище
const storage = multer.diskStorage({
    destination: (_, __, callback) => { //функция, которая указывает, куда будем сохранять статические файлы от клиента (нужно создать в корне проекта папку uploads)
        callback(null, 'uploads');
    },
    filename: (_, file, callback) => { //задаем название файла, вытаскиваем его из самого файла file.originalname
        callback(null, file.originalname);
    },
});

const upload = multer({ storage })





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

//запрос на создание новости
app.post('/news', checkAuth, newsCreateValidation, validationErrReq, createNews);

//запрос на загрузку файла (используя мидлвэйр checkAuth, чтобы кто угодно не мог загрузить картинку)
app.post('/upload', checkAuth, upload.single('image'), (req, res) => { //ожидаем файл картинку с указанием типа image (с другим имененем не загрузится)
    res.json({ //возращаем клиенту ссылку на эту картинку 
        url: `/uploads/${req.file.originalname}`, //в req будет хрантитсья информация о загружаемом файле т.к. upload по сути хранилище, которые выше создавали
    })
}); 

//получение всех новостей
app.get('/news', getAllNews); 

//удаление одной новости
app.delete('/news/:id', checkAuth, deleteNews);

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