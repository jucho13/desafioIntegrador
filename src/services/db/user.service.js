import userModel from "./models/user.js";

export default class UserService {
    constructor() { 
        console.log("Working users with Database persistence in mongodb");
    }

    getAll = async () => {
        let students = await userModel.find();
        return students.map(student=>student.toObject());
    }
    save = async (student) => {
        console.log(`Usuario proximo a ser creado ${student.email} contraseña: ${student.password}`)
        let result = await userModel.create({email:student.email,password:student.password});
        return result;
    }

    findByUsername = async (username) => {
        const result = await userModel.findOne({email: username});
        return result;
    };

    update = async (filter, value) => {
        console.log("Update student with filter and value:");
        console.log(filter);
        console.log(value);
        let result = await userModel.updateOne(filter, value);
        return result;
    }
}