npm install

if [ -d "auth" ]; then
  
  echo "Pasta 'auth' já existe. Iniciando.."
else
  echo "Pasta 'auth' ainda não existe. Criando uma.."
  mkdir auth
fi

npm start