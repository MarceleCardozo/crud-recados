import express from "express";
import { v4 as uuid } from "uuid";

const app = express();

app.use(express.json());

const recados = [];

//middleware pra validar o título
const verificaTitulo = function (request, response, next) {
  const { titulo } = request.body;

  const existeRecado = recados.find((recado) => recado.titulo == titulo);

  if (existeRecado)
    return response.status(409).json("Já existe um recado com este nome");

  next();
};

//busca recados
app.get("/recados", (request, response) => {
  return response.status(200).json(recados);
});

//busca recados pelo id
app.get("/recados/:id", (request, response) => {
  const recadoId = request.params.id;

  const existeRecado = recados.find((r) => r.id == recadoId);

  if (existeRecado) {
    return response.status(200).json(existeRecado);
  } else {
    return response.status(404).json("Recado não encontrado!");
  }
});

//criar recado
app.post("/recados", verificaTitulo, (request, response) => {
  const { titulo, descricao } = request.body;

  const id = uuid();

  const novoRecado = {
    id,
    titulo,
    descricao,
  };

  recados.push(novoRecado);

  response.status(201).json({
    message: "Recado criado com sucesso!",
  });
});

// atualizar recado através do id
app.put("/recados/:id", (request, response) => {
  const recadoId = request.params.id;
  const { titulo, descricao } = request.body;

  const existeRecado = recados.find((r) => r.id == recadoId);

  if (!existeRecado) {
    return response.status(404).json("Recado não encontrado");
  }

  existeRecado.titulo = titulo;
  existeRecado.descricao = descricao;

  return response.status(201).json("Recado atualizado com sucesso!");
});

//deletar recado
app.delete("/recados/:id", (request, response) => {
  const recadoId = request.params.id;

  const existeRecado = recados.findIndex((r) => r.id == recadoId);

  if (existeRecado !== -1) {
    recados.splice(existeRecado, 1);
    return response
      .status(200)
      .json({ message: "recado excluido com sucesso", data: recados });
  } else {
    return response.status(404).json("Recado não encontrado!");
  }
});

app.listen(8080, () => console.log("Servidor iniciado"));
