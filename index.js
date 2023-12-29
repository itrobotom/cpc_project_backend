import express from "express"

import mongoose from "mongoose"

import { regValidation, autorizationValidation } from "./validations/validations.js"

import checkAuth from "./middleware/checkAuth.js"

import { autorization, registration, getMeInfo } from "./controllers/UsersControl.js"

mongoose.connect('mongodb+srv://admin:YoClQoFph0bQdLKL@cluster0.2c9tmdy.mongodb.net/?retryWrites=true&w=majority')
    .then(()=> console.log("Connect mongo"))
    .catch((err) => console.log("Error connect mongo", err));

const PORT = 5000;

const app = express();

app.use(express.json());

//реагиреум на запрос по корневому адресу (клиент получает данные с сервера - get запрос)
app.get('/', (req, res) => {
    console.log(req.query);  
    res.status(200).json('Сервер работает!!!');
})

//запрос на авторизацию
app.post("/auth/login", autorizationValidation, autorization);

//запрос на регистрацию и проверяем сразу на валидность на сервере
app.post('/auth/register', regValidation, registration);

app.get('/auth/me', checkAuth, getMeInfo);

//чтобы все методы выше работали и мы отдавали клиенту информацию или принималее ее от него, то надо стартануть приложению и слушать порт
//()=> обычный колбэк, который выполнится сразу после запуска порт и выведется информация о том, что приложение стартовало на таком то порту
app.listen(PORT, (err) => {
    if (err) {
        return console.log(err); 
    }
    console.log("server start", + PORT)
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
