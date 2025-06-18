import { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { ref, onValue } from "firebase/database";

export function ListaProjetos() {
  const [projetos, setProjetos] = useState({});

  useEffect(() => {
    const projetosRef = ref(db, "projetos");
    const unsubscribe = onValue(projetosRef, (snapshot) => {
      const data = snapshot.val() || {};
      setProjetos(data);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow space-y-4 mt-10">
      <h2 className="text-xl font-bold text-zinc-800 dark:text-white">Projetos Cadastrados</h2>
      <div className="space-y-2">
        {Object.keys(projetos).length === 0 ? (
          <p className="text-zinc-600 dark:text-zinc-400 text-sm">Nenhum projeto cadastrado ainda.</p>
        ) : (
          Object.entries(projetos).map(([id, projeto]) => (
            <div key={id} className="border border-zinc-200 dark:border-zinc-700 p-4 rounded-lg">
              <p className="font-semibold text-zinc-800 dark:text-white">{projeto.nome}</p>
              <p className="text-sm text-zinc-700 dark:text-zinc-300">
                Saldo Atual:{" "}
                <span className="font-mono text-green-600 dark:text-green-400">
                  R$ {projeto.saldoAtual?.toFixed(2)}
                </span>
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
