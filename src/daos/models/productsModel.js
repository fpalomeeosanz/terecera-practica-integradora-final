import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const collection = "products";

const productSchema= new mongoose.Schema({
    title: {type: String,required:true},
    price: { type: Number,required:true,min:1},
    code: {type: String,required:true},
    stock: {type: Number,required:true},
    category:{ type: String,required:true,enum: ['Deportes', 'Tecnología','Ropa']},
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users"
    }
});

productSchema.plugin(mongoosePaginate);

const productsModel = mongoose.model(collection, productSchema);

export default productsModel; 