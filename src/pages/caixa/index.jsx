import { CadastroProjeto } from "@/components/CadastroProjeto";
import { ListaProjetos } from "@/components/ListaProjetos";

export default function Caixa() {
  return (
    <div className="min-h-screen p-6 bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-white">
      <div className="max-w-4xl mx-auto space-y-10">
        <CadastroProjeto />
        <ListaProjetos />
      </div>
    </div>
  );
}
