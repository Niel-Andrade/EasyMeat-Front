import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button.jsx";
import Input from "../../components/Input/Input.jsx";
import Select from "../../components/Select/Select.jsx";
import Loading from "../../components/Loading/Loading.jsx";
import ErrorState from "../../components/ErrorState/ErrorState.jsx";
import * as anuncioService from "../../services/anuncioService.js";
import { CATEGORIAS, ESTADOS_BR } from "../../utils/constants.js";
import { validarAnuncio } from "../../utils/validators.js";
import { formatarMoeda } from "../../utils/formatters.js";
import "./AnuncioForm.css";

const formInicial = {
  titulo: "",
  descricao: "",
  categoria: "",
  tipoCarne: "",
  preco: "",
  quantidade: "",
  unidade: "KG",
  cidade: "",
  estado: "",
  imagens: [],
  destaque: false,
};

/**
 * Formulário compartilhado de criação e edição de anúncio.
 *
 * Props (conforme importadores):
 *  - modo: "criar" | "editar"
 *  - id:   string|number (somente quando modo === "editar")
 */
export default function AnuncioForm({ modo = "criar", id }) {
  const navigate = useNavigate();
  const ehEdicao = modo === "editar";

  const [dados, setDados] = useState(formInicial);
  const [previews, setPreviews] = useState([]);
  const [imagensRemovidas, setImagensRemovidas] = useState([]);
  const [carregando, setCarregando] = useState(ehEdicao);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState(null);
  const [sucesso, setSucesso] = useState(null);
  const [validacao, setValidacao] = useState({});

  useEffect(() => {
    let mounted = true;
    if (ehEdicao && id) {
      anuncioService
        .buscarAnuncio(id)
        .then((res) => {
          if (!mounted) return;
          const a = res?.anuncio || res || {};
          setDados({
            titulo: a.titulo || "",
            descricao: a.descricao || "",
            categoria: a.categoria || "",
            tipoCarne: a.tipoCarne || "",
            preco: a.preco ?? "",
            quantidade: a.quantidade ?? "",
            unidade: a.unidade || "KG",
            cidade: a.cidade || "",
            estado: a.estado || "",
            imagens: Array.isArray(a.imagens)
              ? a.imagens.map((i) => (typeof i === "string" ? i : i.url))
              : [],
            destaque: !!a.destaque,
          });
          setPreviews(
            (a.imagens || []).map((i) => ({
              url: typeof i === "string" ? i : i.url,
              existing: true,
            }))
          );
        })
        .catch((err) => {
          if (!mounted) return;
          setErro(err?.message || "Falha ao carregar anúncio");
        })
        .finally(() => mounted && setCarregando(false));
    }
    return () => {
      mounted = false;
    };
  }, [ehEdicao, id]);

  function handleChange(e) {
    const { name, value, type, checked, files } = e.target;
    if (name === "imagens" && files) {
      const arquivos = Array.from(files).slice(0, 8 - (dados.imagens?.length || 0));
      const novosPreviews = arquivos.map((f) => ({
        arquivo: f,
        url: URL.createObjectURL(f),
        existing: false,
      }));
      setPreviews((p) => [...p, ...novosPreviews]);
      setDados((d) => ({ ...d, imagens: [...(d.imagens || []), ...arquivos] }));
      return;
    }
    setDados((d) => ({
      ...d,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function removerImagem(idx) {
    setPreviews((p) => {
      const alvo = p[idx];
      if (alvo && !alvo.existing && alvo.url) URL.revokeObjectURL(alvo.url);
      return p.filter((_, i) => i !== idx);
    });
    setDados((d) => {
      const item = d.imagens?.[idx];
      if (item && typeof item === "string") {
        setImagensRemovidas((r) => [...r, item]);
      }
      return { ...d, imagens: (d.imagens || []).filter((_, i) => i !== idx) };
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro(null);
    setSucesso(null);

    const resultado = validarAnuncio({
      titulo: dados.titulo,
      descricao: dados.descricao,
      categoria: dados.categoria,
      tipoCarne: dados.tipoCarne,
      preco: dados.preco,
      quantidade: dados.quantidade,
      cidade: dados.cidade,
      estado: dados.estado,
    });
    if (!resultado.valido) {
      setValidacao(resultado.erros);
      const campos = Object.keys(resultado.erros).join(", ");
      setErro(`Existem campos obrigatórios a corrigir: ${campos}`);
      console.warn("Validação do anúncio falhou:", resultado.erros);
      return;
    }
    setValidacao({});

    const formData = new FormData();
    Object.entries(dados).forEach(([k, v]) => {
      if (k === "imagens") return;
      formData.append(k, v);
    });
    (dados.imagens || []).forEach((img) => {
      if (img instanceof File) formData.append("imagens", img);
    });
    if (ehEdicao) {
      imagensRemovidas.forEach((url) => formData.append("imagensRemovidas", url));
    }

    try {
      setSalvando(true);
      let resposta;
      if (ehEdicao) {
        resposta = await anuncioService.atualizarAnuncio(id, formData);
      } else {
        resposta = await anuncioService.criarAnuncio(formData);
      }
      setSucesso(ehEdicao ? "Anúncio atualizado com sucesso" : "Anúncio publicado com sucesso");
      // 6.1 — Após criar, redirecionar para a tela de produtos
      // (e após editar, voltar para Meus Anúncios)
      setTimeout(() => {
        if (ehEdicao) {
          navigate("/meus-anuncios");
        } else {
          navigate("/anuncios");
        }
      }, 700);
    } catch (err) {
      setErro(err?.message || "Não foi possível salvar o anúncio");
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) return <Loading mensagem="Carregando dados do anúncio..." />;
  if (erro && ehEdicao && !dados.titulo)
    return <ErrorState titulo="Erro ao carregar" mensagem={erro} onRetry={() => navigate(0)} />;

  return (
    <form className="anuncio-form" onSubmit={handleSubmit} noValidate>
      <h2 className="anuncio-form__titulo">
        {ehEdicao ? "Editar anúncio" : "Novo anúncio"}
      </h2>

      {erro && <div className="anuncio-form__alerta anuncio-form__alerta--erro">{erro}</div>}
      {sucesso && (
        <div className="anuncio-form__alerta anuncio-form__alerta--sucesso">{sucesso}</div>
      )}

      <div className="anuncio-form__secao">
        <Input
          label="Título *"
          name="titulo"
          value={dados.titulo}
          onChange={handleChange}
          placeholder="Ex.: Picanha Angus resfriada"
          erro={validacao.titulo}
          maxLength={100}
          required
        />

        <div className="anuncio-form__grupo">
          <Select
            label="Categoria *"
            name="categoria"
            value={dados.categoria}
            onChange={handleChange}
            erro={validacao.categoria}
            required
            opcoes={CATEGORIAS.map((c) => ({ value: c.value, label: c.label }))}
          />
        </div>

        <Input
          label="Tipo de carne *"
          name="tipoCarne"
          value={dados.tipoCarne}
          onChange={handleChange}
          placeholder="Ex.: Picanha, Costela, Acém..."
          erro={validacao.tipoCarne}
          maxLength={60}
          required
        />
      </div>

      <div className="anuncio-form__campo">
        <label htmlFor="descricao" className="anuncio-form__label">
          Descrição *
        </label>
        <textarea
          id="descricao"
          name="descricao"
          value={dados.descricao}
          onChange={handleChange}
          placeholder="Descreva procedência, corte, peso aproximado, conservação..."
          rows={5}
          className={validacao.descricao ? "input--erro" : ""}
        />
        <small>{dados.descricao.length}/1000 caracteres</small>
        {validacao.descricao && (
          <span className="anuncio-form__erro">{validacao.descricao}</span>
        )}
      </div>

      <div className="anuncio-form__linha">
        <Input
          label="Preço (R$) *"
          name="preco"
          type="number"
          step="0.01"
          min="0"
          value={dados.preco}
          onChange={handleChange}
          placeholder="0,00"
          erro={validacao.preco}
          required
        />
        <span className="anuncio-form__sugestao">
          {dados.preco ? `Formatado: ${formatarMoeda(dados.preco)}` : "—"}
        </span>
      </div>

      <div className="anuncio-form__linha">
        <Input
          label="Quantidade disponível *"
          name="quantidade"
          type="number"
          min="0"
          step="0.01"
          value={dados.quantidade}
          onChange={handleChange}
          erro={validacao.quantidade}
          required
        />
        <Select
          label="Unidade"
          name="unidade"
          value={dados.unidade}
          onChange={handleChange}
          opcoes={[
            { value: "KG", label: "Quilograma (kg)" },
            { value: "G", label: "Grama (g)" },
            { value: "UN", label: "Unidade (un)" },
            { value: "CX", label: "Caixa (cx)" },
          ]}
        />
        <span className="anuncio-form__sugestao">
          {dados.quantidade
            ? `${dados.quantidade} ${dados.unidade.toLowerCase()}`
            : "—"}
        </span>
      </div>

      <div className="anuncio-form__linha">
        <Input
          label="Cidade *"
          name="cidade"
          value={dados.cidade}
          onChange={handleChange}
          erro={validacao.cidade}
          required
        />
        <Select
          label="Estado (UF) *"
          name="estado"
          value={dados.estado}
          onChange={handleChange}
          erro={validacao.estado}
          required
          opcoes={ESTADOS_BR.map((uf) => ({ value: uf.value, label: uf.label }))}
        />
      </div>

      <div className="anuncio-form__campo">
        <label className="anuncio-form__label">Imagens do anúncio</label>
        <input
          type="file"
          name="imagens"
          accept="image/*"
          multiple
          onChange={handleChange}
          disabled={(dados.imagens?.length || 0) >= 8}
        />
        <small>Máximo 8 imagens. JPG/PNG até 5MB cada.</small>
        {previews.length > 0 && (
          <div className="anuncio-form__previews">
            {previews.map((p, i) => (
              <div key={i} className="anuncio-form__preview-item">
                <img src={p.url} alt={`Imagem ${i + 1}`} />
                <button type="button" onClick={() => removerImagem(i)} aria-label="Remover">
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="anuncio-form__campo anuncio-form__checkbox">
        <label>
          <input
            type="checkbox"
            name="destaque"
            checked={dados.destaque}
            onChange={handleChange}
          />
          <span>Marcar como destaque (requer plano Premium ativo)</span>
        </label>
      </div>

      <div className="anuncio-form__acoes">
        <Button type="button" variant="secondary" onClick={() => navigate(-1)} disabled={salvando}>
          Cancelar
        </Button>
        <Button type="submit" disabled={salvando}>
          {salvando
            ? "Salvando..."
            : ehEdicao
            ? "Salvar alterações"
            : "Publicar anúncio"}
        </Button>
      </div>
    </form>
  );
}
