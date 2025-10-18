import mongoose from 'mongoose';

const petSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    specie: {
        type: String,
        required: true,
        enum: ['dog', 'cat', 'bird', 'fish', 'rabbit', 'hamster', 'turtle', 'snake']
    },
    birthDate: {
        type: Date,
        required: true
    },
    adopted: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    image: {
        type: String,
        default: null
    }
}, {
    timestamps: true,
    versionKey: false
});

// Índices para optimizar consultas
petSchema.index({ specie: 1 });
petSchema.index({ adopted: 1 });
petSchema.index({ owner: 1 });

// Virtual para calcular la edad
petSchema.virtual('age').get(function() {
    const now = new Date();
    const birthDate = new Date(this.birthDate);
    const ageInMilliseconds = now - birthDate;
    const ageInYears = Math.floor(ageInMilliseconds / (1000 * 60 * 60 * 24 * 365));
    return ageInYears;
});

// Configurar para incluir virtuals en JSON
petSchema.set('toJSON', { virtuals: true });

const PetModel = mongoose.model('Pet', petSchema);

export default PetModel;
