import mongoose from "mongoose"
//модель пользователя 
const UserSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        passwordHash: {
            type: String,
            required: true,
        },
        avatarUrl: String,
    },
    {
        timestamp: true, //создаем поле для фиксации время, когда был пользователь создан или обновлен
    },
);

export default mongoose.model('User', UserSchema);