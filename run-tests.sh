#!/bin/sh

echo "🧪 Ejecutando tests..."

# Esperar a que MongoDB esté listo
echo "⏳ Esperando a MongoDB..."
sleep 5

# Ejecutar tests
npm test

# Capturar el resultado
TEST_RESULT=$?

# Salir con el código de resultado de los tests
exit $TEST_RESULT
