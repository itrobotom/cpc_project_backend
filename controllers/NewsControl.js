import NewsModel from '../models/News.js'

export const getAllNews = async (req, res) => {
    try {
        const news = await NewsModel.find(); //получить все доступные новости из модели 
        res.json(news); 
    } catch(err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить новости',
        })

    }
};

export const createNews = async (req, res) => {
    try{
        const doc = new NewsModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            // tags: req.body.tags,
            // user: req.userId,
        });

        const news = await doc.save();

        res.json(news);
    } catch(err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось создать новость',
        })

    }
};

export const deleteNews = async (req, res) => {
    try {
        const newsId = req.params.id;
        // findOneAndDelete({ _id: newsId }).exec();

        const deletedNews = await NewsModel.findOneAndDelete({ //удаляем документ по id
            _id: newsId, //обозначение id как в базе данных 
        });
        if (!deletedNews) {
            console.log('Новость для удаления не найдена');
            return res.status(404).json({
                message: 'Новость для удаления не найдена',
            });
        }

        console.log('Новость успешно удалена');
        res.json({
            success: true,
            //deletedNews: deletedNews.toObject(), // Преобразовать в обычный объект и отобразить клиенту информацю о удаленной новости
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Не удалось удалить новость',
        });
    }
};

export const updateNews = async (req, res) => {
    try {
        const newsId = req.params.id;

        await NewsModel.updateOne(
        {
            _id: newsId, //ищем статью по id
        }, //далее что будем записывать нового в поля (тоже самое по сути, что и при создании статьи с нуля)
        {
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            // tags: req.body.tags,
            // user: req.userId,
        });

        res.json({
            success: true,
        })
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Не удалось отредактировать новость',
        });
    }
}

export const getOneNews = async (req, res) => {
    try {
        const newsId = req.params.id;
        const doc = await NewsModel.findOneAndUpdate(
            { _id: newsId },
            { returnDocument: 'after' }
        ).exec();

        if (!doc) {
            return res.status(404).json({
                message: 'новость не найдена'
            });
        }

        res.json(doc);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить новость',
        });
    }
};