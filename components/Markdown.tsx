function renderizarInline(texto: string): React.ReactNode {
  const partes = texto.split(/(\*\*[^*]+\*\*)/g);
  return partes.map((parte, i) =>
    parte.startsWith("**") && parte.endsWith("**") ? (
      <strong key={i}>{parte.slice(2, -2)}</strong>
    ) : (
      <span key={i}>{parte}</span>
    )
  );
}

export default function Markdown({ texto }: { texto: string }) {
  const linhas = texto.split("\n");
  const blocos: React.ReactNode[] = [];
  let listaAtual: { tipo: "ul" | "ol"; itens: string[] } | null = null;

  function fecharLista() {
    if (!listaAtual) return;
    const { tipo, itens } = listaAtual;
    blocos.push(
      tipo === "ul" ? (
        <ul key={blocos.length} className="list-disc pl-5">
          {itens.map((item, i) => (
            <li key={i}>{renderizarInline(item)}</li>
          ))}
        </ul>
      ) : (
        <ol key={blocos.length} className="list-decimal pl-5">
          {itens.map((item, i) => (
            <li key={i}>{renderizarInline(item)}</li>
          ))}
        </ol>
      )
    );
    listaAtual = null;
  }

  for (const linhaBruta of linhas) {
    const linha = linhaBruta.trim();
    if (!linha) {
      fecharLista();
      continue;
    }
    if (linha.startsWith("## ")) {
      fecharLista();
      blocos.push(
        <h2 key={blocos.length} className="mt-6 font-display text-xl font-bold">
          {linha.slice(3)}
        </h2>
      );
    } else if (linha.startsWith("# ")) {
      fecharLista();
      blocos.push(
        <h1 key={blocos.length} className="font-display text-2xl font-bold">
          {linha.slice(2)}
        </h1>
      );
    } else if (/^\d+\.\s/.test(linha)) {
      if (!listaAtual || listaAtual.tipo !== "ol") {
        fecharLista();
        listaAtual = { tipo: "ol", itens: [] };
      }
      listaAtual.itens.push(linha.replace(/^\d+\.\s/, ""));
    } else if (linha.startsWith("- ")) {
      if (!listaAtual || listaAtual.tipo !== "ul") {
        fecharLista();
        listaAtual = { tipo: "ul", itens: [] };
      }
      listaAtual.itens.push(linha.slice(2));
    } else {
      fecharLista();
      blocos.push(
        <p key={blocos.length} className="text-foreground/80">
          {renderizarInline(linha)}
        </p>
      );
    }
  }
  fecharLista();

  return <div className="flex flex-col gap-3">{blocos}</div>;
}
