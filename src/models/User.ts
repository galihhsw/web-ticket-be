import mongoose from "mongoose";
import { getAssetUrl } from "../utils/helper";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'customer'],
        default: 'customer'
    }
}, {
    virtuals: {
            thumbnailUrl: {
                get() {
                    return `${getAssetUrl('photos')}${this.photo}`;
                }    
            }
    }, 
    toJSON: { virtuals: true },
})

export default mongoose.model('User', userSchema, "users")
