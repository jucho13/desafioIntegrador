import mongoose from 'mongoose';
import mongoosePaginate from "mongoose-paginate-v2";

const collectionName = 'users';

const stringTypeSchemaUniqueRequired = {
    type: String,
    unique: true,
    required: true
};

const stringTypeSchemaNonUniqueRequired = {
    type: String,
    required: true
};


const userSchema = new mongoose.Schema({
    email: stringTypeSchemaUniqueRequired,
    password: stringTypeSchemaNonUniqueRequired 
});

userSchema.plugin(mongoosePaginate);

const userModel = mongoose.model(collectionName, userSchema);
export default userModel;