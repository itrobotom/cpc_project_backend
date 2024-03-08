import ProgramModel from '../models/Program.js'
import fs from 'fs';
import path from 'path';

export const getAllPrograms = async (req, res) => {
    try {
        let programs;

        if (req.isAuthenticated) { // Используем isAuthenticated для проверки авторизации
            programs = await ProgramModel.find(); // Если пользователь авторизован, возвращаем все данные, включая почту педагога
        } else {
            programs = await ProgramModel.find().select('-instructors.email'); // Если пользователь не авторизован, исключаем почту педагога
        }
        
        res.json(programs); 
    } catch(err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить программы',
        })
    }
};

export const getOneProgram = async (req, res) => {
    try {
        const programId = req.params.id;
        let program;
        if (req.isAuthenticated) { // Используем isAuthenticated для проверки авторизации
            program = await ProgramModel.findOneAndUpdate(
                { _id: programId },
                { returnDocument: 'after' }
            ).lean().exec();
        } else {
            program = await ProgramModel.findOneAndUpdate(
                { _id: programId },
                { returnDocument: 'after' }
            ).lean().exec();
            // Исключаем почту педагога из ответа, поскольку пользователь не авторизован 
            program.instructors.forEach(instructor => {
                delete instructor.email;
            });
        }
        if (!program) {
            return res.status(404).json({
                message: 'Программа не найдена'
            });
        }
        res.json(program);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить программу',
        });
    }
};

export const createProgram = async (req, res) => {
    try{
        const doc = new ProgramModel({
            typesProgramKlimov: req.body.typesProgramKlimov,
            typesProgram: req.body.typesProgram,
            titleProgram: req.body.titleProgram,
            shortTitleProgram: req.body.shortTitleProgram,
            numLessons: req.body.numLessons,
            trainingPeriod: req.body.trainingPeriod,
            linkVideo: req.body.linkVideo,
            commentVideo: req.body.commentVideo,
            linkGroup: req.body.linkGroup,
            isBudgetProgramm: req.body.isBudgetProgramm,
            commentProgram: req.body.commentProgram,
            ageRangeProgram: req.body.ageRangeProgram,
            numberStudents: req.body.numberStudents,
            instructors: req.body.instructors,
            textProgram: req.body.textProgram,
            imageUrl: req.body.imageUrl,
            linkPosts: req.body.linkPosts,
            fileUrl: req.body.fileUrl,
            arrLinkImg: req.body.arrLinkImg,
            // user: req.userId,
        });

        const programs = await doc.save();

        res.json(programs);
    } catch(err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось создать запись образовательной программы',
        })

    }
};

export const deleteProgram = async (req, res) => {
    try {
        const programId = req.params.id;
        // findOneAndDelete({ _id: newsId }).exec();

        const deletedProgram = await ProgramModel.findOneAndDelete({ //удаляем документ по id
            _id: programId, //обозначение id как в базе данных 
        });
        if (!deletedProgram) {
            console.log('Программа для удаления не найдена');
            return res.status(404).json({
                message: 'Программа для удаления не найдена',
            });
        }

        console.log('Программа успешно удалена');
        res.json({
            success: true,
            //deletedNews: deletedNews.toObject(), // Преобразовать в обычный объект и отобразить клиенту информацю о удаленной новости
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Не удалось удалить программу',
        });
    }
};

export const updateProgram = async (req, res) => {
    //console.log("Пришел для обновления новости объект: ", req);
    try {
        const programId = req.params.id;

        await ProgramModel.updateOne(
        {
            _id: programId, //ищем статью по id
        }, //далее что будем записывать нового в поля (тоже самое по сути, что и при создании статьи с нуля)
        {
            $set: { //добавлен set для корректного обновления с учетом поле даты события dateNewsFormat
                typesProgramKlimov: req.body.typesProgramKlimov,
                typesProgram: req.body.typesProgram,
                titleProgram: req.body.titleProgram,
                shortTitleProgram: req.body.shortTitleProgram,
                numLessons: req.body.numLessons,
                trainingPeriod: req.body.trainingPeriod,
                linkVideo: req.body.linkVideo,
                commentVideo: req.body.commentVideo,
                linkGroup: req.body.linkGroup,
                isBudgetProgramm: req.body.isBudgetProgramm,
                commentProgram: req.body.commentProgram,
                ageRangeProgram: req.body.ageRangeProgram,
                numberStudents: req.body.numberStudents,
                instructors: req.body.instructors,
                textProgram: req.body.textProgram,
                imageUrl: req.body.imageUrl,
                linkPosts: req.body.linkPosts,
                fileUrl: req.body.fileUrl,
                arrLinkImg: req.body.arrLinkImg,
            }
        });

        res.json({
            success: true,
        })
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Не удалось отредактировать программу',
        });
    }
}


// Функция для удаления файла
const deleteFile = (filePath) => {
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error('Ошибка при удалении файла:', err);
            // Здесь можно отправить ответ об ошибке клиенту
        } else {
            console.log('Файл успешно удален:', filePath);
            // Здесь можно отправить ответ об успешном удалении клиенту
        }
    });
};

// Обработчик удаления файла
export const deleteFileHandler = (req, res) => {
    console.log("Путь к файлу:", req.params.fileName);
    const fileName = req.params.fileName;
    // Абсолютный путь к папке с файлами
    const uploadsDir = 'C:/proj_js/express_git/cpc_project_backend/uploads/programFile';
    const filePath = path.join(uploadsDir, fileName);
    // Убедимся, что путь к файлу существует и файл действительно существует
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'Файл не найден' });
    }
    // Удаляем файл
    deleteFile(filePath);
    res.status(200).json({ message: 'Файл успешно удален' });
};

// Обработчик удаления фото
export const deletePhotoHandler = (req, res, folderName) => {
    console.log("Путь к постеру:", req.params.fileName);
    const fileName = req.params.fileName;
    // Абсолютный путь к папке с файлами
    const uploadsDir = `C:/proj_js/express_git/cpc_project_backend/uploads/${folderName}`;
    const filePath = path.join(uploadsDir, fileName);
    // Убедимся, что путь к файлу существует и файл действительно существует
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'Постер не найден' });
    }
    // Удаляем файл
    deleteFile(filePath);
    res.status(200).json({ message: 'Постер успешно удален' });
};

