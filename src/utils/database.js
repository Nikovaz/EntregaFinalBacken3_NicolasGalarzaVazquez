import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/backend_mocks');
        console.log(`✅ MongoDB Conectado: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.error('❌ Error conectando a MongoDB:', error);
        process.exit(1);
    }
};

export const closeDB = async () => {
    try {
        await mongoose.connection.close();
        console.log('✅ Conexión a MongoDB cerrada');
    } catch (error) {
        console.error('❌ Error cerrando conexión a MongoDB:', error);
    }
};
