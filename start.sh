npm install

if [ -d "auth" ]; then
  
  echo ''
  echo "Pasta 'auth' já existe. Iniciando.."
  echo ''  

else
  echo "Pasta 'auth' ainda não existe. Criando uma.."
  echo ''  
  echo "iniciando cold start, prepare-se para escanear o QR Code.."
  echo ''  
  echo "Aperte Ctrl + C após escanear e rode 'sh start.sh'."  
  
  sh cold-start.sh
  
  mkdir auth
fi

npm start