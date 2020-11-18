 Para esse projeto foi usado: React, Styled-Components, Node.js, Sequelize, Express, Toastify, Nodemailer e postgresSQL.

 O projeto pode ser iniciado usando yarn start na pasta recrutamento-front-end e yarn dev na pasta recrutamento-back-end após ter rodado yarn em ambos para que seja criado a pasta node_modules e o arquivo yarn.lock

 Para conexão com o banco de dados tem que ter o postgres instalado na maquina, no arquivo "src/config/database.js" colocar o username e password do seu Usuário postgres e então ir no terminal e rodar yarn sequelize db:create e em seguida rodar yarn sequelize db:migrate

 Para conexão com o nodeMailer, onde te envia o token para criação de conta e alteração de senha do usuário da aplicação, você deve criar uma conta no site 'https://mailtrap.io/', ir em "minha caixa de entrda" e na caixa integrações, onde está "ondulação" selecionar node.js, nodeMailer, pegar as variaveis "user" e "pass" e alterar no arquivo "src/config/mail.json"
