echo "Parando processo.."
npm stop

echo "Fazendo request de novas atualizações.."
git pull

echo "Instalando possiveis novas dependencias.."
npm install
