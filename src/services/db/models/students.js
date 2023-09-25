import mongoose from 'mongoose';
import mongoosePaginate from "mongoose-paginate-v2";

const collectionName = 'students';

const stringTypeSchemaUniqueRequired = {
    type: String,
    unique: true,
    required: true
};

const stringTypeSchemaNonUniqueRequired = {
    type: String,
    required: true
};


const studentSchema = new mongoose.Schema({
    name: stringTypeSchemaNonUniqueRequired,
    lastName: stringTypeSchemaNonUniqueRequired,
    email: stringTypeSchemaUniqueRequired,
    age: stringTypeSchemaNonUniqueRequired,
    password: stringTypeSchemaNonUniqueRequired,
    role: {
        type: String,
        default: "user",
        enum: ["user", "admin"],
    },
    courses: {
        type: Array,
        default:[]
    }
    
});

/**
 * Middleware para agregar dentro del método 'find' un llamado a una función, en este 
 * caso llamamos al metodo populate.
 */
// studentSchema.pre('findOne', function() {
//     this.populate("courses.course");
// });

studentSchema.plugin(mongoosePaginate);

const studentsModel = mongoose.model(collectionName, studentSchema);
export default studentsModel;