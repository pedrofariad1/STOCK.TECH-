"use strict";

const $ = (id) => document.getElementById(id);

window.onload = () => {
    aplicarConfiguracoesIniciais();
    configurarAbas();
    carregarAvaliacoes();
};

/* ==========================================
   CONFIGURAÇÕES
========================================== */

function aplicarConfiguracoesIniciais() {

    const nome =
        localStorage.getItem("st_nome")
        || "Andrew";

    const email =
        localStorage.getItem("st_email")
        || "andrew@stocktech.com";

    const cargo =
        localStorage.getItem("st_cargo")
        || "Gerente de Operações";

    const tema =
        localStorage.getItem("st_tema")
        || "light";

    $("nav-name").innerText =
        nome.split(" ")[0];

    $("nav-avatar").innerText =
        nome.substring(0, 2).toUpperCase();

    $("drop-name").innerText = nome;
    $("drop-email").innerText = email;
    $("drop-cargo").innerText = cargo;

    $("cfg-nome").value = nome;
    $("cfg-email").value = email;
    $("cfg-cargo").value = cargo;
    $("cfg-tema").value = tema;

    aplicarTema(tema);
}

function aplicarTema(tema) {

    if (tema === "dark") {
        document.body.setAttribute(
            "data-theme",
            "dark"
        );
    } else {
        document.body.removeAttribute(
            "data-theme"
        );
    }
}

/* ==========================================
   MODAL CONFIG
========================================== */

$("btn-config").addEventListener(
    "click",
    () => {
        $("modal-config")
            .classList.add("open");
    }
);

function fecharModalConfig() {
    $("modal-config")
        .classList.remove("open");
}

$("btn-fechar-config")
.addEventListener(
    "click",
    fecharModalConfig
);

$("btn-cancelar-config")
.addEventListener(
    "click",
    fecharModalConfig
);

$("btn-salvar-config")
.addEventListener(
    "click",
    () => {

        localStorage.setItem(
            "st_nome",
            $("cfg-nome").value
        );

        localStorage.setItem(
            "st_email",
            $("cfg-email").value
        );

        localStorage.setItem(
            "st_cargo",
            $("cfg-cargo").value
        );

        localStorage.setItem(
            "st_tema",
            $("cfg-tema").value
        );

        aplicarConfiguracoesIniciais();

        fecharModalConfig();

        mostrarToast(
            "Configurações salvas!"
        );
    }
);

/* ==========================================
   ABAS CONFIGURAÇÃO
========================================== */

function configurarAbas() {

    const tabs =
        document.querySelectorAll(
            ".config-tab"
        );

    tabs.forEach(tab => {

        tab.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(
                        ".config-tab"
                    )
                    .forEach(btn =>
                        btn.classList.remove(
                            "active"
                        )
                    );

                document
                    .querySelectorAll(
                        ".config-pane"
                    )
                    .forEach(pane => {
                        pane.classList.remove(
                            "active"
                        );

                        pane.style.display =
                            "none";
                    });

                tab.classList.add(
                    "active"
                );

                const alvo =
                    document.getElementById(
                        tab.dataset.tab
                    );

                alvo.style.display =
                    "block";

                alvo.classList.add(
                    "active"
                );
            }
        );
    });
}

/* ==========================================
   TOAST
========================================== */

function mostrarToast(msg) {

    const container =
        $("toast-container");

    const div =
        document.createElement("div");

    div.className = "toast";
    div.innerHTML = msg;

    container.appendChild(div);

    setTimeout(() => {
        div.remove();
    }, 3000);
}

/* ==========================================
   FAQ
========================================== */

document
.addEventListener(
    "DOMContentLoaded",
    () => {

        document
        .querySelectorAll(".faq-btn")
        .forEach(btn => {

            btn.addEventListener(
                "click",
                () => {

                    const card =
                        btn.closest(
                            ".faq-card"
                        );

                    card.classList.toggle(
                        "active"
                    );

                    btn.innerText =
                        card.classList.contains(
                            "active"
                        )
                        ? "Ler menos"
                        : "Ler mais";
                }
            );
        });

        const search =
            $("faqSearch");

        if (search) {

            search.addEventListener(
                "input",
                () => {

                    const value =
                        search.value
                        .toLowerCase();

                    document
                    .querySelectorAll(
                        ".faq-card"
                    )
                    .forEach(card => {

                        card.style.display =
                            card.innerText
                                .toLowerCase()
                                .includes(value)
                                ? "flex"
                                : "none";
                    });
                }
            );
        }
    }
);

/* ==========================================
   FAQ LOAD MORE
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const btn =
            document.getElementById(
                "toggleFaq"
            );

        const cards =
            document.querySelectorAll(
                ".faq-card"
            );

        if (!btn) return;

        const limite = 3;
        let aberto = false;

        function atualizarFAQ() {

            cards.forEach(
                (card, index) => {

                    // mostra os 3 primeiros sempre
                    if (index < limite) {
                        card.style.display =
                            "flex";
                    }

                    // esconde/mostra do 4 em diante
                    else {
                        card.style.display =
                            aberto
                            ? "flex"
                            : "none";
                    }
                }
            );

            btn.innerText =
                aberto
                ? "Fechar artigos"
                : "Carregar mais artigos";
        }

        btn.addEventListener(
            "click",
            () => {

                aberto = !aberto;
                atualizarFAQ();
            }
        );

        atualizarFAQ();
    }
);

/* ==========================================
   CRUD AVALIAÇÕES
========================================== */

const API_URL =
    "http://localhost:3000/avaliacoes";

async function carregarAvaliacoes() {

    try {

        const resposta =
            await fetch(API_URL);

        const avaliacoes =
            await resposta.json();

        const lista =
            $("listaAvaliacoes");

        lista.innerHTML = "";

        avaliacoes.forEach(
            item => {

                lista.innerHTML += `
                    <div class="avaliacao-card">
                        <h3>${item.nome}</h3>
                        <small>${item.funcao}</small>
                        <p>${item.avaliacao}</p>
                    </div>
                `;
            }
        );

    } catch (erro) {

        console.error(
            "Erro ao carregar avaliações",
            erro
        );
    }
}

$("btnEnviar")
.addEventListener(
    "click",
    async () => {

        const nome =
            $("nome").value;

        const funcao =
            $("funcao").value;

        const avaliacao =
            $("avaliacao").value;

        if (
            !nome ||
            !funcao ||
            !avaliacao
        ) {
            alert(
                "Preencha todos os campos!"
            );
            return;
        }

        await fetch(API_URL, {

            method: "POST",

            headers: {
                "Content-Type":
                    "application/json"
            },

            body: JSON.stringify({
                nome,
                funcao,
                avaliacao
            })
        });

        $("nome").value = "";
        $("funcao").value = "";
        $("avaliacao").value = "";

        carregarAvaliacoes();
    }
);

/* ==========================================
   MOSTRAR / ESCONDER FORM
========================================== */

const toggleFormulario =
    document.getElementById(
        "toggleFormulario"
    );

const formulario =
    document.getElementById(
        "formularioAvaliacao"
    );

toggleFormulario.addEventListener(
    "click",
    () => {

        formulario.classList.toggle(
            "active"
        );

        if (
            formulario.classList.contains(
                "active"
            )
        ) {

            toggleFormulario.innerText =
                "Fechar avaliação";

        } else {

            toggleFormulario.innerText =
                "Fazer avaliação";
        }
    }
);

/* ==========================================
   ABAS DO MODAL CONFIG
========================================== */

document.querySelectorAll(".config-tab")
.forEach(tab => {

    tab.addEventListener("click", () => {

        // remove active de todos os botões
        document
        .querySelectorAll(".config-tab")
        .forEach(btn => {
            btn.classList.remove("active");
        });

        // esconder todos os conteúdos
        document
        .querySelectorAll(".config-pane")
        .forEach(pane => {

            pane.classList.remove("active");
            pane.style.display = "none";
        });

        // ativar botão clicado
        tab.classList.add("active");

        // mostrar conteúdo correto
        const id =
            tab.getAttribute("data-tab");

        const painel =
            document.getElementById(id);

        if (painel) {
            painel.style.display = "block";
            painel.classList.add("active");
        }
    });
});