import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
        trim: true
    },
    last_name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    age: {
        type: Number,
        required: true,
        min: 1,
        max: 150
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    pets: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pet'
    }]
}, {
    timestamps: true,
    versionKey: false
});

// Índices para optimizar consultas
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });

// Método para obtener el nombre completo
userSchema.virtual('fullName').get(function() {
    return `${this.first_name} ${this.last_name}`;
});

// Configurar para incluir virtuals en JSON
userSchema.set('toJSON', { virtuals: true });

const UserModel = mongoose.model('User', userSchema);

export default UserModel;
