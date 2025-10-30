import { ref, get, push, update, db } from "../../../../firebase";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "@/components/ui/Button/button";
import { Input } from "@/components/ui/input/index";
import { Label } from "@/components/ui/label/index";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Calendar, Coffee, UtensilsCrossed, Cookie, ChefHat, Users, UserCheck, Clock, Save, Trash2, FileText, AlertTriangle, Calculator, ArrowRight } from "lucide-react";

export default function CadastroRefeicoes() {
  const [formData, setFormData] = useState({
    dataRefeicao: "",
    cafeDescricao: "",
    cafeTotalQtd: 0,
    cafeFuncionariosQtd: 0,
    cafeJovensQtd: 0,
    almocoDescricao: "",
    almocoTotalQtd: 0,
    almocoFuncionariosQtd: 0,
    almocoJovensQtd: 0,
    almocoJovensTardeQtd: 0,
    lancheDescricao: "",
    lancheTotalQtd: 0,
    lancheFuncionariosQtd: 0,
    lancheJovensManhaQtd: 0,
    lancheJovensQtd: 0,
    outrasDescricao: "",
    outrasTotalQtd: 0,
    outrasFuncionariosQtd: 0,
    outrasJovensQtd: 0,
    outrasJovensTardeQtd: 0,
    sobrasDescricao: "",
    observacaoDescricao: "",
    desperdicioQtd: 0,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const refeicoesRef = ref(db, "refeicoesServidas");
    get(refeicoesRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const refeicoesData = [];
          snapshot.forEach((childSnapshot) => {
            refeicoesData.push({ key: childSnapshot.key, ...childSnapshot.val() });
          });
        }
      })
      .catch((error) => console.error("Erro ao ler dados do Firebase:", error));
  }, []);

const handleChange = (e) => {
  const { id, value } = e.target;

  setFormData((prev) => {
    const novoEstado = { ...prev };

    // Campos que devem ser tratados como NUMÉRICOS
    const camposNumericos = [
      "cafeTotalQtd", "cafeFuncionariosQtd", "cafeJovensQtd",
      "almocoTotalQtd", "almocoFuncionariosQtd", "almocoJovensQtd", "almocoJovensTardeQtd",
      "lancheTotalQtd", "lancheFuncionariosQtd", "lancheJovensQtd", "lancheJovensManhaQtd",
      "outrasTotalQtd", "outrasFuncionariosQtd", "outrasJovensQtd", "outrasJovensTardeQtd",
      "desperdicioQtd"
    ];

    if (camposNumericos.includes(id)) {
      novoEstado[id] = Number.parseInt(value) || 0;
    } else {
      // Campos de texto (descrições, observações etc.)
      novoEstado[id] = value;
    }

    // Regras de cálculo automáticas
    if (id === "cafeTotalQtd" || id === "cafeFuncionariosQtd") {
      novoEstado.cafeJovensQtd = Math.max(0, novoEstado.cafeTotalQtd - novoEstado.cafeFuncionariosQtd);
    }

    if (["almocoTotalQtd", "almocoFuncionariosQtd", "almocoJovensQtd"].includes(id)) {
      novoEstado.almocoJovensTardeQtd = Math.max(
        0,
        novoEstado.almocoTotalQtd - novoEstado.almocoFuncionariosQtd - novoEstado.almocoJovensQtd
      );
      novoEstado.lancheTotalQtd = Math.max(0, novoEstado.almocoTotalQtd - novoEstado.almocoJovensQtd + 10);
      novoEstado.lancheJovensQtd = Math.max(0, novoEstado.lancheTotalQtd - novoEstado.lancheFuncionariosQtd);
    }

    if (["lancheFuncionariosQtd"].includes(id)) {
      novoEstado.lancheJovensQtd = Math.max(0, novoEstado.lancheTotalQtd - novoEstado.lancheFuncionariosQtd);
    }

    if (["outrasTotalQtd", "outrasFuncionariosQtd", "outrasJovensQtd"].includes(id)) {
      novoEstado.outrasJovensTardeQtd = Math.max(
        0,
        novoEstado.outrasTotalQtd - novoEstado.outrasFuncionariosQtd - novoEstado.outrasJovensQtd
      );
    }

    return novoEstado;
  });
};

  const handleDateChange = (e) => setFormData((prev) => ({ ...prev, dataRefeicao: e.target.value }));
  const handleBack = () => navigate("/refeicoes");
  const handleView = () => navigate("/refeicoes-servidas");

  const salvarNoBanco = () => {
    if (!formData.dataRefeicao) {
      toast.error("Por favor, selecione a data da refeição.");
      return;
    }
    const newRefeicaoKey = push(ref(db, "refeicoesServidas")).key;
    const updates = {};
    updates[`/refeicoesServidas/${newRefeicaoKey}`] = { ...formData };

    update(ref(db), updates)
      .then(() => {
        toast.success("Refeições salvas com sucesso!", { position: "top-right", autoClose: 3000, theme: "colored" });
        setFormData({
          dataRefeicao: "",
          cafeDescricao: "",
          cafeTotalQtd: 0,
          cafeFuncionariosQtd: 0,
          cafeJovensQtd: 0,
          almocoDescricao: "",
          almocoTotalQtd: 0,
          almocoFuncionariosQtd: 0,
          almocoJovensQtd: 0,
          almocoJovensTardeQtd: 0,
          lancheDescricao: "",
          lancheTotalQtd: 0,
          lancheFuncionariosQtd: 0,
          lancheJovensManhaQtd: 0,
          lancheJovensQtd: 0,
          outrasDescricao: "",
          outrasTotalQtd: 0,
          outrasFuncionariosQtd: 0,
          outrasJovensQtd: 0,
          outrasJovensTardeQtd: 0,
          sobrasDescricao: "",
          observacaoDescricao: "",
          desperdicioQtd: 0,
        });
      })
      .catch((error) => {
        console.error("Erro ao salvar refeição:", error);
        toast.error("Erro ao salvar refeição. Tente novamente.", { position: "top-right", autoClose: 3000, theme: "colored" });
      });
  };

  const mealTypes = [
    { id: "cafe", label: "Café da Manhã", icon: Coffee, color: "bg-amber-100 border-amber-200" },
    { id: "almoco", label: "Almoço", icon: UtensilsCrossed, color: "bg-green-100 border-green-200" },
    { id: "lanche", label: "Lanche", icon: Cookie, color: "bg-purple-100 border-purple-200" },
    { id: "outras", label: "Outras Refeições", icon: ChefHat, color: "bg-blue-100 border-blue-200" },
  ];

  const getTotalServings = () => formData.cafeTotalQtd + formData.almocoTotalQtd + formData.lancheTotalQtd + formData.outrasTotalQtd;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-6 px-4">
      <ToastContainer />
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <Button onClick={handleBack} variant="outline" className="hover:bg-slate-100"><ArrowLeft className="w-4 h-4 mr-2" />Voltar</Button>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4"><UtensilsCrossed className="w-8 h-8 text-orange-600" /></div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Cadastro de Refeições</h1>
            <p className="text-gray-600">Registre as refeições servidas e controle o desperdício</p>
          </div>
          <div className="w-24"></div>
        </div>

        {/* Data */}
<Card className="w-full max-w-7xl mx-auto mb-8 shadow-lg rounded-xl overflow-hidden">
  <CardHeader>
    <CardTitle className="flex items-center gap-2 text-lg font-semibold">
      <Calendar className="w-5 h-5 text-indigo-600" />
      Data da Refeição
    </CardTitle>
  </CardHeader>

  <CardContent className="flex flex-col gap-4">
    <Input
      type="date"
      id="dataRefeicao"
      value={formData.dataRefeicao}
      onChange={handleDateChange}
      className="h-12"
    />

    <Button
      onClick={handleView}
      variant="outline"
      className="flex items-center justify-center gap-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50"
    >
      <ArrowRight className="w-4 h-4" />
      Visualizar Refeições Cadastradas
    </Button>
  </CardContent>
</Card>


        {/* Resumo */}
        {getTotalServings() > 0 && (
          <Card className="mb-8">
            <CardHeader><CardTitle className="flex items-center gap-2"><Calculator className="w-5 h-5" />Resumo do Dia</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-blue-600">{getTotalServings()}</p>
                  <p className="text-sm text-gray-600">Total de Porções</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">{formData.cafeFuncionariosQtd + formData.almocoFuncionariosQtd + formData.lancheFuncionariosQtd + formData.outrasFuncionariosQtd}</p>
                  <p className="text-sm text-gray-600">Funcionários</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-600">{formData.cafeJovensQtd + formData.almocoJovensQtd + formData.lancheJovensManhaQtd + formData.outrasJovensQtd}</p>
                  <p className="text-sm text-gray-600">Jovens Manhã</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-orange-600">{formData.almocoJovensTardeQtd + formData.lancheJovensQtd + formData.outrasJovensTardeQtd}</p>
                  <p className="text-sm text-gray-600">Jovens Tarde</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Meal Cards */}
        <div className="space-y-6 mb-8">
          {mealTypes.map(({ id, label, icon: Icon, color }) => (
            <Card key={id} className={`${color} shadow-sm`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Icon className="w-6 h-6" />{label} {formData[`${id}TotalQtd`] > 0 && (<Badge variant="secondary">{formData[`${id}TotalQtd`]} porções</Badge>)}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Descrição */}
                <div>
                  <Label className="flex items-center gap-2 mb-2"><FileText className="w-4 h-4" />Descrição do Cardápio</Label>
                  <Textarea id={`${id}Descricao`} value={formData[`${id}Descricao`]} onChange={handleChange} placeholder="Descreva os pratos servidos..." className="min-h-[100px] resize-y" />
                </div>

                {/* Quantidades */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label className="flex items-center gap-2 mb-2"><Users className="w-4 h-4" />Total</Label>
                    <Input type="number" id={`${id}TotalQtd`} value={formData[`${id}TotalQtd`]} onChange={handleChange} min={0} className="h-12" />
                  </div>
                  <div>
                    <Label className="flex items-center gap-2 mb-2"><UserCheck className="w-4 h-4" />Funcionários</Label>
                    <Input type="number" id={`${id}FuncionariosQtd`} value={formData[`${id}FuncionariosQtd`]} onChange={handleChange} min={0} className="h-12" />
                  </div>

                  {/* Jovens Manhã (editável para almoço) */}
                  {["cafe", "almoco", "lanche", "outras"].includes(id) && (
                    <div>
                      <Label className="flex items-center gap-2 mb-2"><Clock className="w-4 h-4" />Jovens Manhã</Label>
                      <Input type="number" id={`${id}JovensQtd`} value={formData[`${id}JovensQtd`]} onChange={handleChange} min={0} className={`h-12 ${id === "almoco" ? "" : "bg-gray-100 cursor-not-allowed"}`} disabled={id !== "almoco"} />
                    </div>
                  )}

                  {/* Jovens Tarde */}
                  {["almoco", "lanche", "outras"].includes(id) && (
                    <div>
                      <Label className="flex items-center gap-2 mb-2"><Calculator className="w-4 h-4" />Jovens Tarde (calc.)</Label>
                      <Input type="number" value={formData[`${id}JovensTardeQtd`]} disabled className="h-12 bg-gray-100 cursor-not-allowed" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Salvar */}
        <div className="flex justify-center">
          <Button onClick={salvarNoBanco} size="lg" className="px-8 py-4 text-lg font-semibold bg-green-600 hover:bg-green-700" disabled={!formData.dataRefeicao}><Save className="w-5 h-5 mr-2" />Salvar Refeições</Button>
        </div>
      </div>
    </div>
  );
}
