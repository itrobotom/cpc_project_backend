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
        tags: {
            type: Array,
            default: [], //если мы не передадим теги, то будет по умолчанию пустой массив
        },
        viewsCount: { //количество просмотров
            type: Number,
            default: 0,
        },
        ImageUrl: String,
    },
);

export default mongoose.model('News', NewsSchema);