export default function Busca({
  valor,
  onChange,
}: {
  valor: string;
  onChange: (valor: string) => void;
}) {
  return (
    <input
      type="search"
      value={valor}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Buscar prato (ex: feijoada, açaí...)"
      className="w-full rounded-full border border-black/10 bg-white px-5 py-3 text-sm shadow-sm outline-none focus:border-primaria"
    />
  );
}
