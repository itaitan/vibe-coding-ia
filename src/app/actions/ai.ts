"use server";

import { getSession } from "@/lib/session";
import Anthropic from "@anthropic-ai/sdk";
import { getDashboardData } from "./dashboard";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "", 
});

export async function analyzeExpenses(month?: number, year?: number) {
  try {
    const session = await getSession();
    if (!session) throw new Error("Usuário não autenticado.");

    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error("A chave de API do Anthropic (Claude) não está configurada no servidor.");
    }

    // 1. Coletar os mesmos dados já mostrados no dashboard atual
    const data = await getDashboardData(month, year);

    // 2. Construir o prompt contextualizado
    const prompt = `
Você é um consultor financeiro especialista e vai analisar os dados mensais das finanças do usuário.
Abaixo estão os dados agregados deste mês:

**Resumo:**
- Saldo Atual Vitalício: ${(data.summary.balance / 100).toFixed(2)} BRL
- Receitas neste mês: ${(data.summary.income / 100).toFixed(2)} BRL
- Despesas neste mês: ${(data.summary.expenses / 100).toFixed(2)} BRL
- Economia deste mês: ${(data.summary.savings / 100).toFixed(2)} BRL

**Despesas por Categoria (Top):**
${data.chartData.map((c: any) => `- ${c.name}: ${(c.value / 100).toFixed(2)} BRL`).join("\n")}

**5 Últimas Transações:**
${data.recentTransactions.map((t: any) => `- [${t.date.toLocaleDateString('pt-BR')}] ${t.type}: ${t.description} (${(t.amount / 100).toFixed(2)} BRL)`).join("\n")}

Sua Tarefa (Retorne EXCLUSIVAMENTE Markdown):
1. Faça uma análise breve (2 parágrafos no máximo) sobre o comportamento financeiro deste mês baseando-se nos números, citando o que for bom ou preocupante.
2. Forneça 3 dicas práticas em formato de tópicos rápidos e acionáveis focadas em melhorar a economia ou alertar sobre alguma categoria que está consumindo muito.
3. Use uma linguagem encorajadora, amigável e direta. Nada de "Olá! Aqui está sua análise...". Comece direto no conteúdo.
`;

    // 3. Chamar a API via SDK
    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307", // Modelo mais rápido, barato e excelente para análise simples
      max_tokens: 1000,
      system: "Você é um consultor financeiro especializado em análise de finanças pessoais utilizando regras de bom senso econômico, respondendo sempre em Markdown limpo e objetivo.",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
    });

    // 4. Retornar a string processada
    // @ts-ignore
    return response.content[0].text;
  } catch (error: any) {
    console.error("Erro no analyzeExpenses:", error);
    throw new Error(error.message || "Erro ao gerar os insights com a inteligência artificial.");
  }
}
