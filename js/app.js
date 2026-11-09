const CHAVE_PRODUTOS = "produtos";
const CHAVE_MOVIMENTACOES = "movimentacoes";
const CHAVE_USUARIO = "usuarioLogado";

const usuarios = [
    {
        usuario: "admin",
        senha: "admin123",
        perfil: "ADMIN"
    },
    {
        usuario: "usuario",
        senha: "usuario123",
        perfil: "USUARIO"
    }
];

let usuarioAtual = null;

function carregarProdutos() {
    try {
        const dados =
            localStorage.getItem(
                CHAVE_PRODUTOS
            );

        return dados
            ? JSON.parse(dados)
            : [];

    } catch (erro) {

        console.error(
            "Erro ao carregar produtos",
            erro
        );

        return [];
    }
}

function carregarMovimentacoes() {
    try {

        const dados =
            localStorage.getItem(
                CHAVE_MOVIMENTACOES
            );

        return dados
            ? JSON.parse(dados)
            : [];

    } catch (erro) {

        console.error(
            "Erro ao carregar movimentações",
            erro
        );

        return [];
    }
}

let produtos =
    carregarProdutos();

let movimentacoes =
    carregarMovimentacoes();

const loginContainer =
    document.getElementById(
        "login-container"
    );

const appContainer =
    document.getElementById(
        "app-container"
    );

const loginForm =
    document.getElementById(
        "login-form"
    );

const logoutBtn =
    document.getElementById(
        "logout-btn"
    );

const perfilLogado =
    document.getElementById(
        "perfil-logado"
    );

const mensagemErro =
    document.getElementById(
        "mensagem-erro"
    );

const mensagemGlobal =
    document.getElementById(
        "mensagem-global"
    );

const menuItens =
    document.querySelectorAll(
        ".menu-item"
    );

const areasSistema =
    document.querySelectorAll(
        ".area-sistema"
    );

const formProduto =
    document.getElementById(
        "form-produto"
    );

const formMovimentacao =
    document.getElementById(
        "form-movimentacao"
    );

const produtoMovimentacao =
    document.getElementById(
        "produtoMovimentacao"
    );

const corpoProdutos =
    document.getElementById(
        "corpo-produtos"
    );

const corpoHistorico =
    document.getElementById(
        "corpo-historico"
    );

const listaMovimentacoes =
    document.getElementById(
        "lista-movimentacoes"
    );

const listaAlertas =
    document.getElementById(
        "lista-alertas"
    );

const totalProdutos =
    document.getElementById(
        "total-produtos"
    );

const totalEstoque =
    document.getElementById(
        "total-estoque"
    );

const estoqueBaixo =
    document.getElementById(
        "estoque-baixo"
    );

const semEstoque =
    document.getElementById(
        "sem-estoque"
    );

const pesquisaNome =
    document.getElementById(
        "pesquisaNome"
    );

const pesquisaCodigo =
    document.getElementById(
        "pesquisaCodigo"
    );

const filtroCategoria =
    document.getElementById(
        "filtroCategoria"
    );

const filtroSituacao =
    document.getElementById(
        "filtroSituacao"
    );

const ordenacaoProdutos =
    document.getElementById(
        "ordenacaoProdutos"
    );

const btnLimparFiltros =
    document.getElementById(
        "btn-limpar-filtros"
    );

const filtroHistoricoProduto =
    document.getElementById(
        "filtroHistoricoProduto"
    );

const filtroHistoricoTipo =
    document.getElementById(
        "filtroHistoricoTipo"
    );

const filtroHistoricoUsuario =
    document.getElementById(
        "filtroHistoricoUsuario"
    );

function salvarProdutos() {

    localStorage.setItem(
        CHAVE_PRODUTOS,
        JSON.stringify(
            produtos
        )
    );
}

function salvarMovimentacoes() {

    localStorage.setItem(
        CHAVE_MOVIMENTACOES,
        JSON.stringify(
            movimentacoes
        )
    );
}

function salvarSessao(usuario) {

    localStorage.setItem(
        CHAVE_USUARIO,
        JSON.stringify(
            usuario
        )
    );
}

function removerSessao() {

    localStorage.removeItem(
        CHAVE_USUARIO
    );
}

function exibirMensagem(
    texto,
    tipo = "sucesso"
) {

    if (!mensagemGlobal) {
        return;
    }

    mensagemGlobal.className =
        `mensagem mensagem-${tipo}`;

    mensagemGlobal.textContent =
        texto;

    setTimeout(() => {

        mensagemGlobal.innerHTML = "";
        mensagemGlobal.className = "";

    }, 4000);
}

function realizarLogin(
    usuario,
    senha
) {

    return usuarios.find(
        item =>
            item.usuario === usuario &&
            item.senha === senha
    );
}
function obterSituacaoEstoque(produto) {

    if (
        Number(produto.quantidade) === 0
    ) {
        return {
            texto: "Sem Estoque",
            classe: "situacao-zero"
        };
    }

    if (
        Number(produto.quantidade) <=
        Number(produto.estoqueMinimo)
    ) {
        return {
            texto: "Estoque Baixo",
            classe: "situacao-baixa"
        };
    }

    return {
        texto: "Normal",
        classe: "situacao-ok"
    };
}

function carregarCategoriasFiltro() {

    if (!filtroCategoria) {
        return;
    }

    const valorAtual =
        filtroCategoria.value;

    filtroCategoria.innerHTML =
        '<option value="">Todas</option>';

    const categorias = [
        ...new Set(
            produtos.map(
                produto =>
                    produto.categoria
            )
        )
    ];

    categorias.sort();

    categorias.forEach(categoria => {

        const option =
            document.createElement(
                "option"
            );

        option.value = categoria;
        option.textContent =
            categoria;

        filtroCategoria.appendChild(
            option
        );
    });

    filtroCategoria.value =
        valorAtual;
}

function atualizarSelectProdutos() {

    if (
        !produtoMovimentacao
    ) {
        return;
    }

    produtoMovimentacao.innerHTML =
        "";

    produtos.forEach(
        (produto, indice) => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                indice;

            option.textContent =
                `${produto.codigo} - ${produto.nome}`;

            produtoMovimentacao.appendChild(
                option
            );

        }
    );
}

function atualizarAlertasEstoque() {

    if (!listaAlertas) {
        return;
    }

    listaAlertas.innerHTML =
        "";

    const semEstoqueLista =
        produtos.filter(
            produto =>
                produto.quantidade === 0
        );

    const estoqueBaixoLista =
        produtos.filter(
            produto =>
                produto.quantidade > 0 &&
                produto.quantidade <=
                produto.estoqueMinimo
        );

    if (
        semEstoqueLista.length ===
            0 &&
        estoqueBaixoLista.length === 0
    ) {

        listaAlertas.innerHTML =
            "<p>Nenhum alerta encontrado.</p>";

        return;
    }

    semEstoqueLista.forEach(
        produto => {

            const alerta =
                document.createElement(
                    "div"
                );

            alerta.className =
                "alerta alerta-sem-estoque";

            alerta.textContent =
                `SEM ESTOQUE: ${produto.nome}`;

            listaAlertas.appendChild(
                alerta
            );

        }
    );

    estoqueBaixoLista.forEach(
        produto => {

            const alerta =
                document.createElement(
                    "div"
                );

            alerta.className =
                "alerta alerta-baixo";

            alerta.textContent =
                `ESTOQUE BAIXO: ${produto.nome} (Atual: ${produto.quantidade} / Mínimo: ${produto.estoqueMinimo})`;

            listaAlertas.appendChild(
                alerta
            );

        }
    );
}

function atualizarDashboard() {

    if (!totalProdutos) {
        return;
    }

    totalProdutos.textContent =
        produtos.length;

    totalEstoque.textContent =
        produtos.reduce(
            (total, produto) =>
                total +
                Number(
                    produto.quantidade
                ),
            0
        );

    estoqueBaixo.textContent =
        produtos.filter(
            produto =>
                produto.quantidade > 0 &&
                produto.quantidade <=
                produto.estoqueMinimo
        ).length;

    semEstoque.textContent =
        produtos.filter(
            produto =>
                produto.quantidade === 0
        ).length;

    listaMovimentacoes.innerHTML =
        "";

    const recentes =
        movimentacoes
            .slice(-5)
            .reverse();

    if (
        recentes.length === 0
    ) {

        listaMovimentacoes.innerHTML =
            "<li>Nenhuma movimentação registrada.</li>";

    } else {

        recentes.forEach(
            movimentacao => {

                const li =
                    document.createElement(
                        "li"
                    );

                li.textContent =
                    `${movimentacao.dataHora} - ${movimentacao.tipo} - ${movimentacao.produto} (${movimentacao.quantidade})`;

                listaMovimentacoes.appendChild(
                    li
                );

            }
        );
    }

    atualizarAlertasEstoque();
}

function atualizarTabelaProdutos() {

    if (!corpoProdutos) {
        return;
    }

    carregarCategoriasFiltro();

    let lista = [...produtos];

    const nome =
        pesquisaNome?.value
            .toLowerCase()
            .trim() || "";

    const codigo =
        pesquisaCodigo?.value
            .toLowerCase()
            .trim() || "";

    const categoria =
        filtroCategoria?.value || "";

    const situacao =
        filtroSituacao?.value || "";

    if (nome) {

        lista = lista.filter(
            produto =>
                produto.nome
                    .toLowerCase()
                    .includes(nome)
        );
    }

    if (codigo) {

        lista = lista.filter(
            produto =>
                produto.codigo
                    .toLowerCase()
                    .includes(
                        codigo
                    )
        );
    }

    if (categoria) {

        lista =
            lista.filter(
                produto =>
                    produto.categoria ===
                    categoria
            );
    }

    if (situacao) {

        lista =
            lista.filter(
                produto => {

                    const atual =
                        obterSituacaoEstoque(
                            produto
                        );

                    if (
                        situacao ===
                        "NORMAL"
                    ) {
                        return atual.texto ===
                            "Normal";
                    }

                    if (
                        situacao ===
                        "BAIXO"
                    ) {
                        return atual.texto ===
                            "Estoque Baixo";
                    }

                    if (
                        situacao ===
                        "SEM_ESTOQUE"
                    ) {
                        return atual.texto ===
                            "Sem Estoque";
                    }

                    return true;
                }
            );
    }

    switch (
        ordenacaoProdutos?.value
    ) {

        case "nome-desc":
            lista.sort(
                (a, b) =>
                    b.nome.localeCompare(
                        a.nome
                    )
            );
            break;

        case "estoque-asc":
            lista.sort(
                (a, b) =>
                    a.quantidade -
                    b.quantidade
            );
            break;

        case "estoque-desc":
            lista.sort(
                (a, b) =>
                    b.quantidade -
                    a.quantidade
            );
            break;

        default:
            lista.sort(
                (a, b) =>
                    a.nome.localeCompare(
                        b.nome
                    )
            );
    }

    corpoProdutos.innerHTML = "";

    lista.forEach(produto => {

        const indice =
            produtos.indexOf(
                produto
            );

        const situacaoAtual =
            obterSituacaoEstoque(
                produto
            );

        const linha =
            document.createElement(
                "tr"
            );

        linha.innerHTML = `
            <td>${produto.codigo}</td>
            <td>${produto.nome}</td>
            <td>${produto.categoria}</td>
            <td>${produto.quantidade}</td>
            <td class="${situacaoAtual.classe}">
                ${situacaoAtual.texto}
            </td>
            <td>
                <div class="acoes-produto">

                    <button
                        class="btn-detalhes"
                        onclick="visualizarProduto(${indice})">
                        Ver
                    </button>

                    ${
                        usuarioAtual &&
                        usuarioAtual.perfil === "ADMIN"
                            ? `
                        <button
                            class="btn-editar"
                            onclick="editarProduto(${indice})">
                            Editar
                        </button>

                        <button
                            class="btn-excluir"
                            onclick="excluirProduto(${indice})">
                            Excluir
                        </button>`
                            : ""
                    }

                </div>
            </td>
        `;

        corpoProdutos.appendChild(
            linha
        );
    });

    atualizarSelectProdutos();
}
function registrarHistorico(
    produto,
    tipo,
    quantidade
) {

    movimentacoes.push({
        produto: produto.nome,
        tipo: tipo,
        quantidade: quantidade,
        dataHora: new Date()
            .toLocaleString("pt-BR"),
        usuario:
            usuarioAtual.usuario
    });

    salvarMovimentacoes();
}

function atualizarHistorico() {

    if (!corpoHistorico) {
        return;
    }

    let historico =
        [...movimentacoes];

    const produtoFiltro =
        filtroHistoricoProduto?.value
            .toLowerCase()
            .trim() || "";

    const tipoFiltro =
        filtroHistoricoTipo?.value || "";

    const usuarioFiltro =
        filtroHistoricoUsuario?.value
            .toLowerCase()
            .trim() || "";

    if (produtoFiltro) {

        historico =
            historico.filter(item =>
                item.produto
                    ?.toLowerCase()
                    .includes(
                        produtoFiltro
                    )
            );
    }

    if (tipoFiltro) {

        historico =
            historico.filter(item =>
                item.tipo ===
                tipoFiltro
            );
    }

    if (usuarioFiltro) {

        historico =
            historico.filter(item =>
                item.usuario
                    ?.toLowerCase()
                    .includes(
                        usuarioFiltro
                    )
            );
    }

    corpoHistorico.innerHTML =
        "";

    historico
        .slice()
        .reverse()
        .forEach(item => {

            const linha =
                document.createElement(
                    "tr"
                );

            linha.innerHTML = `
                <td>${item.dataHora}</td>
                <td>${item.produto}</td>

                <td class="${
                    item.tipo ===
                    "ENTRADA"
                        ? "tipo-entrada"
                        : "tipo-saida"
                }">
                    ${item.tipo}
                </td>

                <td>
                    ${item.quantidade}
                </td>

                <td>
                    ${item.usuario}
                </td>
            `;

            corpoHistorico.appendChild(
                linha
            );
        });
}

function cadastrarProduto(
    event
) {

    event.preventDefault();

    if (
        usuarioAtual.perfil !==
        "ADMIN"
    ) {

        exibirMensagem(
            "Acesso negado.",
            "erro"
        );

        return;
    }

    const codigo =
        document
            .getElementById(
                "codigo"
            )
            .value.trim();

    const nome =
        document
            .getElementById(
                "nome"
            )
            .value.trim();

    const descricao =
        document
            .getElementById(
                "descricao"
            )
            .value.trim();

    const categoria =
        document
            .getElementById(
                "categoria"
            )
            .value.trim();

    const quantidade =
        Number(
            document
                .getElementById(
                    "quantidade"
                )
                .value
        );

    const estoqueMinimo =
        Number(
            document
                .getElementById(
                    "estoqueMinimo"
                )
                .value
        );

    const localizacao =
        document
            .getElementById(
                "localizacao"
            )
            .value.trim();

    if (
        !codigo ||
        !nome ||
        !descricao ||
        !categoria ||
        !localizacao
    ) {

        exibirMensagem(
            "Preencha todos os campos obrigatórios.",
            "erro"
        );

        return;
    }

    produtos.push({
        codigo,
        nome,
        descricao,
        categoria,
        quantidade,
        estoqueMinimo,
        localizacao
    });

    salvarProdutos();

    atualizarDashboard();
    atualizarTabelaProdutos();

    formProduto.reset();

    exibirMensagem(
        "Produto cadastrado com sucesso.",
        "sucesso"
    );
}

function registrarMovimentacao(
    event
) {

    event.preventDefault();

    if (
        usuarioAtual.perfil !==
        "ADMIN"
    ) {
        return;
    }

    const indice =
        Number(
            produtoMovimentacao.value
        );

    const tipo =
        document
            .getElementById(
                "tipoMovimentacao"
            )
            .value;

    const quantidade =
        Number(
            document
                .getElementById(
                    "quantidadeMovimentacao"
                )
                .value
        );

    const produto =
        produtos[indice];

    if (
        !produto ||
        quantidade <= 0
    ) {

        exibirMensagem(
            "Informe uma quantidade válida.",
            "erro"
        );

        return;
    }

    if (
        tipo === "SAIDA" &&
        quantidade >
        produto.quantidade
    ) {

        exibirMensagem(
            "Quantidade insuficiente em estoque.",
            "erro"
        );

        return;
    }

    if (
        tipo === "ENTRADA"
    ) {

        produto.quantidade +=
            quantidade;

    } else {

        produto.quantidade -=
            quantidade;
    }

    registrarHistorico(
        produto,
        tipo,
        quantidade
    );

    salvarProdutos();

    atualizarDashboard();
    atualizarTabelaProdutos();
    atualizarHistorico();

    formMovimentacao.reset();

    exibirMensagem(
        "Movimentação registrada com sucesso.",
        "sucesso"
    );
}

function visualizarProduto(
    indice
) {

    const produto =
        produtos[indice];

    alert(
`Código: ${produto.codigo}

Nome: ${produto.nome}

Descrição: ${produto.descricao}

Categoria: ${produto.categoria}

Quantidade: ${produto.quantidade}

Estoque Mínimo: ${produto.estoqueMinimo}

Localização: ${produto.localizacao}`
    );
}

function editarProduto(
    indice
) {

    if (
        usuarioAtual.perfil !==
        "ADMIN"
    ) {
        return;
    }

    const produto =
        produtos[indice];

    const novoNome =
        prompt(
            "Nome do produto:",
            produto.nome
        );

    if (!novoNome) {
        return;
    }

    produto.nome =
        novoNome.trim();

    salvarProdutos();

    atualizarTabelaProdutos();
    atualizarDashboard();

    exibirMensagem(
        "Produto atualizado com sucesso.",
        "sucesso"
    );
}

function excluirProduto(
    indice
) {

    if (
        usuarioAtual.perfil !==
        "ADMIN"
    ) {
        return;
    }

    const produto =
        produtos[indice];

    const confirmar =
        confirm(
            `Deseja excluir o produto "${produto.nome}"?`
        );

    if (!confirmar) {

        exibirMensagem(
            "Exclusão cancelada.",
            "aviso"
        );

        return;
    }

    produtos.splice(
        indice,
        1
    );

    salvarProdutos();

    atualizarDashboard();
    atualizarTabelaProdutos();

    exibirMensagem(
        "Produto excluído com sucesso.",
        "sucesso"
    );
}

function abrirArea(
    area
) {

    areasSistema.forEach(
        secao =>
            secao.classList.add(
                "oculto"
            )
    );

    menuItens.forEach(
        item =>
            item.classList.remove(
                "ativo"
            )
    );

    switch (area) {

        case "dashboard":
            document
                .getElementById(
                    "area-dashboard"
                )
                .classList.remove(
                    "oculto"
                );
            break;

        case "produtos":
            document
                .getElementById(
                    "secao-produtos"
                )
                .classList.remove(
                    "oculto"
                );
            break;

        case "cadastro":
            document
                .getElementById(
                    "secao-cadastro-produto"
                )
                .classList.remove(
                    "oculto"
                );
            break;

        case "movimentacao":
            document
                .getElementById(
                    "secao-movimentacao"
                )
                .classList.remove(
                    "oculto"
                );
            break;

        case "historico":
            document
                .getElementById(
                    "secao-historico"
                )
                .classList.remove(
                    "oculto"
                );

            atualizarHistorico();
            break;
    }

    document
        .querySelector(
            `[data-secao="${area}"]`
        )
        ?.classList.add(
            "ativo"
        );
}

function aplicarPermissoes(
    usuario
) {

    usuarioAtual =
        usuario;

    document
        .querySelectorAll(
            ".admin-only"
        )
        .forEach(elemento => {

            elemento.style.display =
                usuario.perfil ===
                "ADMIN"
                    ? ""
                    : "none";

        });
}

function exibirAplicacao(
    usuario
) {

    aplicarPermissoes(
        usuario
    );

    perfilLogado.textContent =
        usuario.perfil;

    loginContainer.classList.add(
        "oculto"
    );

    appContainer.classList.remove(
        "oculto"
    );

    salvarSessao(
        usuario
    );

    atualizarDashboard();
    atualizarTabelaProdutos();
    atualizarHistorico();

    abrirArea(
        "dashboard"
    );
}

function verificarSessao() {

    const sessao =
        localStorage.getItem(
            CHAVE_USUARIO
        );

    if (!sessao) {
        return;
    }

    try {

        const usuario =
            JSON.parse(
                sessao
            );

        exibirAplicacao(
            usuario
        );

    } catch {

        removerSessao();
    }
}

function inicializarSistema() {

    atualizarDashboard();

    atualizarTabelaProdutos();

    atualizarHistorico();

    atualizarSelectProdutos();

    carregarCategoriasFiltro();

    verificarSessao();
}

loginForm?.addEventListener(
    "submit",
    event => {

        event.preventDefault();

        const usuario =
            document
                .getElementById(
                    "usuario"
                )
                .value;

        const senha =
            document
                .getElementById(
                    "senha"
                )
                .value;

        const autenticado =
            realizarLogin(
                usuario,
                senha
            );

        if (
            !autenticado
        ) {

            mensagemErro.textContent =
                "Usuário ou senha inválidos.";

            return;
        }

        mensagemErro.textContent =
            "";

        exibirAplicacao(
            autenticado
        );
    }
);

logoutBtn?.addEventListener(
    "click",
    () => {

        removerSessao();

        appContainer.classList.add(
            "oculto"
        );

        loginContainer.classList.remove(
            "oculto"
        );

        loginForm.reset();

    }
);

formProduto?.addEventListener(
    "submit",
    cadastrarProduto
);

formMovimentacao?.addEventListener(
    "submit",
    registrarMovimentacao
);

menuItens.forEach(
    botao => {

        botao.addEventListener(
            "click",
            () => {

                const area =
                    botao.dataset.secao;

                if (
                    (
                        area ===
                            "cadastro" ||
                        area ===
                            "movimentacao"
                    ) &&
                    usuarioAtual
                        ?.perfil !==
                    "ADMIN"
                ) {

                    exibirMensagem(
                        "Você não possui permissão para acessar esta área.",
                        "aviso"
                    );

                    return;
                }

                abrirArea(
                    area
                );
            }
        );
    }
);

pesquisaNome?.addEventListener(
    "input",
    atualizarTabelaProdutos
);

pesquisaCodigo?.addEventListener(
    "input",
    atualizarTabelaProdutos
);

filtroCategoria?.addEventListener(
    "change",
    atualizarTabelaProdutos
);

filtroSituacao?.addEventListener(
    "change",
    atualizarTabelaProdutos
);

ordenacaoProdutos?.addEventListener(
    "change",
    atualizarTabelaProdutos
);

btnLimparFiltros?.addEventListener(
    "click",
    () => {

        pesquisaNome.value =
            "";

        pesquisaCodigo.value =
            "";

        filtroCategoria.value =
            "";

        filtroSituacao.value =
            "";

        ordenacaoProdutos.value =
            "nome-asc";

        atualizarTabelaProdutos();
    }
);

filtroHistoricoProduto?.addEventListener(
    "input",
    atualizarHistorico
);

filtroHistoricoTipo?.addEventListener(
    "change",
    atualizarHistorico
);

filtroHistoricoUsuario?.addEventListener(
    "input",
    atualizarHistorico
);

inicializarSistema();