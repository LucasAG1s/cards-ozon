const express = require('express');
const fetch = require('node-fetch');
const multer = require('multer');
const FormData = require('form-data');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para lidar com upload de arquivos usando Multer
const upload = multer({ dest: 'uploads/' });

app.use(express.json());

// Rota para lidar com o envio do formulário
app.post('/enviar-tarefa', upload.array('arquivos'), async (req, res) => {
    const nomeSolicitante = req.body.solicitante;
    const niveisSelecionados = req.body.niveis;
    const descricaoErro = req.body.descricao;
    const caminhoErro = req.body.caminho;
    const arquivos = req.files;

    // Dados da tarefa a ser criada no ClickUp
    const taskData = {
        name: descricaoErro,
        content: `Solicitante: ${nomeSolicitante}\nNíveis: ${niveisSelecionados}\nCaminho do erro: ${caminhoErro}`,
        // Ajuste os campos conforme necessário para corresponder aos requisitos da API do ClickUp
    };

    const apiUrl = 'https://api.clickup.com/api/v2/task';
    const token = '5ANEND8LR23BFFNQE41FJ7J3MW8XLC5FZGRKYRNDXR4WULJ7FDLDC2M61D4K4LLUI'; // Substitua pelo seu token de acesso do ClickUp

    try {
        // Enviar tarefa para o ClickUp
        const responseTask = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(taskData),
        });

        if (!responseTask.ok) {
            throw new Error('Erro ao criar tarefa no ClickUp.');
        }

        const task = await responseTask.json();
        const taskId = task.id;

        // Enviar anexos para a tarefa no ClickUp
        if (arquivos && arquivos.length > 0) {
            const attachmentsUrl = `https://api.clickup.com/api/v2/task/${taskId}/attachment`;
            const formData = new FormData();

            arquivos.forEach(file => {
                formData.append('file', fs.createReadStream(file.path), {
                    filename: file.originalname,
                    contentType: file.mimetype,
                });
            });

            const responseAttachments = await fetch(attachmentsUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            if (!responseAttachments.ok) {
                throw new Error('Erro ao enviar anexos para o ClickUp.');
            }

            console.log('Anexos enviados com sucesso para a tarefa no ClickUp.');
        } else {
            console.warn('Nenhum arquivo selecionado para enviar como anexo.');
        }

        console.log('Tarefa criada com sucesso no ClickUp.');
        res.status(200).json({ message: 'Tarefa criada com sucesso no ClickUp.' });

    } catch (error) {
        console.error('Erro ao interagir com o ClickUp:', error);
        res.status(500).json({ error: 'Erro ao interagir com o ClickUp.' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor backend rodando na porta ${PORT}`);
});
