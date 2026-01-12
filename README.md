# Game Sorter

## Sumário

1. Descrição
2. Tecnologias
3. Como Executar
4. Licença
5. Autor

### Descrição

Game sorter é uma aplicação que tem como objetivo ajudar a decidir qual o proximo jogo que você irá jogar da sua bibliteca steam.
A aplicação realiza uma requisição baseado no seu idSteam para recuperar os jogos da sua biblioteca e a partir de um algoritmo de escolha baseado em pesos, escolhe qual o jogo que você irá jogar.
Game Sorter é uma aplicação desenvolvida como estudo para aplicação de conhecimentos como:

1. Caching
2. Programação Orientada a Objetos
3. SOLID
4. Padrões de Projeto
5. Testes de Software

### Tecnologias

#### Backend

1. Node.Js
2. Express
3. IoRedis
4. Axios

#### Caching

1. Redis

#### Testes

1. Jest

#### DevOps

1. Docker e Docker Compose

### Como Executar

#### Pré requisitos

Configure seu `.env` local como mostrado no arquivo `.env.example`

```text
STEAM_URL=BASE_STEAM_API_URL
STEAM_CLIENT_KEY=YOUR_CLIENT_KEY
PORT=THE_PORT_YOU_WANNA_USE
REDIS_HOST=YOUR_REDIS_HOST_SERVER
REDIS_PORT=THE_PORT_YOUR_SERVER_IS_RUNNING_ON
```

1. Docker

Docker (Recomendado)

```bash
docker compose up -d;
```

### Licença

Esse Projeto está sob a licença MIT

### Autor

**Immanuel Victor**
[Immanuel Victor](https://github.com/Immanuel-Victor)
