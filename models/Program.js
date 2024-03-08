import mongoose from "mongoose"
//модель Образовательной программы 
//добавить количество занятий в неделю
//добавить срок обучения
const ProgramSchema = new mongoose.Schema(
    {
        typesProgramKlimov:{
            type: Array,
            default: [],
        },
        typesProgram:{
            type: Array,
            required: true,
            default: [],
        },
        titleProgram: {
            type: String,
            required: true,
        },
        shortTitleProgram: {
            type: String,
        },
        numLessons: {
            type: String,
        },
        trainingPeriod: {
            type: String,
        },
        linkVideo: {
            type: String,
        },
        commentVideo: {
            type: String,
        },
        linkGroup: {
            type: String,
        },
        isBudgetProgramm: {
            type: Boolean,
            required: true,
        },
        commentProgram: {
            type: String,
        },
        ageRangeProgram:{
            type: Array,
            required: true,
            default: [],
        },
        numberStudents:{
            type: Array,
            required: true,
            default: [],
        },
        instructors:{
            type: Array,
            required: true,
            default: [],
        },
        textProgram: {
            type: String,
            required: true,
            //unique: true, //если надо, чтобы текст статьи был уникальный, то поставить этот параметр и при создании статьи с одинаковым содержанием второй раз выдаст ошибку
            //но если убираем этот параметр, всеравно не дает создать новость с одинаковым содержимым..
        },
        imageUrl: String,
        linkPosts:{
            type: Array,
            default: [],
        },
        fileUrl: {
            type: String,
        },
        arrLinkImg:{
            type: Array,
            default: [],
        }
    },
);

export default mongoose.model('Program', ProgramSchema);