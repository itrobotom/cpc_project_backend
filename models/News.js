import mongoose from "mongoose"
//модель новости 
const NewsSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        text: {
            type: String,
            required: true,
            //unique: true, //если надо, чтобы текст статьи был уникальный, то поставить этот параметр и при создании статьи с одинаковым содержанием второй раз выдаст ошибку
                          //но если убираем этот параметр, всеравно не дает создать новость с одинаковым содержимым..
        },
        typesProgramStore: { //ОПЕЧАТАЛСЯ, ПОМЕНЯТЬ ПОТОМ НА typeNews, это же не программы и при чем тут стор
            type: Array,
            default: [], 
        },
        dateNewsFormat: {
            type: Date, // Изменено на тип Date
            default: Date.now, // По умолчанию устанавливается текущая дата
            index: -1 // Индекс в убывающем порядке (-1 для убывающего порядка, 1 для возрастающего)
        },
        linkProgramm: {
            type: String,
            default: '',
        },
        linkNews: {
            type: String,
            default: '',
        },
        programName: {
            type: String,
            default: '',
        },
        // viewsCount: { //количество просмотров
        //     type: Number,
        //     default: 0,
        // },
        imageUrl: String,
    },
);

export default mongoose.model('News', NewsSchema);