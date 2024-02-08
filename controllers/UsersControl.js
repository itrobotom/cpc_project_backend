import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import UserModel from "../models/User.js"

export const autorization = async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email }); //проверяем, найдем ли мы такого пользователя с почтой
        if(!user) {
            return res.status(404).json({
                message: 'Пользователь не найден', //пишем только для удобства разработки, в реальном проекте не надо указывать причину, иначе будет легко злоумышлинникам понять, почему авторизация не прошла и использовать это для дальнейшего взлома
            })
        }
        console.log(user._doc.passwordHash);
        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash); //сравниваем введенный пароль с зашифрованным на стороне сервера
        if(!isValidPass) {
            return res.status(400).json({
                message: "Неверный логин или пароль", //указываем или т.к. для защиты информации лучше не раскрывать, в чем была ошибка, чтобы сложнее было подобрать данные для входа
            })
        }
        //если введенная почта верная и пароль валидный, то как и при регистрации создадим новый токен
        const token = jwt.sign(
            {
                _id: user.id,
            },
            'secret123', //ключ, за счет которого шифруется токен
            {
                expiresIn: '30d', //сколько живет токен
            }
        );
        //возвращаем данные о пользователе
        const { passwordHash, ...userData } = user._doc; //вытаскиваем через деструктуризацию все, кроме passwordHash

        //res.status(500).json({user}); //вернем информацию о пользователе, а именно документ user
        res.json({
            ...userData, //создаем новый объект, поэтому используем ...user._doc, а так вот тоже работает просто с user, а без зашифрованного пароля ...userData
            token,
        }); //если возращать всю информацию о user, то надо указать ...user
    } catch (err) {
        res.json({
            message: "Не удалось авторизоваться",
        })
        console.log("Ошибка", err);
    } 
}

export const registration = async (req, res) => {
    try {
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10); //способ шифрования
        const hash = await bcrypt.hash(password, salt); //создаем из обычной строки по алгоритма salt зашифрованный пароль

        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            passwordHash: hash,
        })

        const user = await doc.save(); 
        const token = jwt.sign(
            {
                _id: user.id,
            },
            'secret123', //ключ, за счет которого шифруется токен
            {
                expiresIn: '30d', //сколько живет токен
            }
        );
        const { passwordHash, ...userData } = user._doc; //вытаскиваем через деструктуризацию все, кроме passwordHash

        //res.status(500).json({user}); //вернем информацию о пользователе, а именно документ user
        res.json({
            ...userData, //создаем новый объект, поэтому используем ...user._doc, а так вот тоже работает просто с user, а без зашифрованного пароля ...userData
            token,
        }); //если возращать всю информацию о user, то надо указать ...user
    } catch(err){
        res.json({
            message: "Не удалось зарегистрироваться",
        })
        console.log("Ошибка", err);
    }
}

export const getMeInfo = async (req, res) => { //функция (req, res) выполниться только после успешного выполнения midleware checkAuth
    try {
        const user = await UserModel.findById(req.userId); //userId мы как раз получили из checkAuth, только там хитро не вернули его, а так req.userId = decoded._id;
        
        if(!user){
            res.status(404).json({
                message: 'Пользователь не найден',
            })
        }

        const { passwordHash, ...userData } = user._doc;
        res.json(userData);

    }
    catch(err){
        console.log(err); 
        res.status(500).json({
            message: 'Нет доступа',
        })
    }
}