import { validationResult } from "express-validator"

export default (req, res, next) => {
    //спарсим ошибки, если таковы имеются
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json(errors.array());
    }
    next(); 
}