import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description: "Política de Privacidade e Termos de Uso do Núk.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl p-6 py-12 space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Política de Privacidade</h1>
        <p className="text-muted-foreground">Última atualização: Junho de 2026</p>
      </div>

      <div className="space-y-6 text-sm leading-relaxed text-foreground/90">
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">1. Coleta de Dados</h2>
          <p>
            O Núk coleta informações básicas de perfil (como nome, username, e-mail e foto) 
            quando você cria uma conta através dos nossos provedores de autenticação (OAuth).
            Esses dados são utilizados exclusivamente para identificar você dentro da plataforma, 
            permitindo a interação social (seguir, curtir, comentar e enviar mensagens).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">2. Uso das Informações</h2>
          <p>
            Suas informações são utilizadas para:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Fornecer e manter o serviço funcionando corretamente;</li>
            <li>Personalizar sua experiência no feed de conteúdo;</li>
            <li>Permitir que outros criadores interajam com você;</li>
            <li>Garantir a segurança e integridade do ecossistema.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">3. Exclusão de Conta e Dados</h2>
          <p>
            Você tem total controle sobre seus dados. A qualquer momento, você pode excluir sua conta 
            diretamente nas <strong>Configurações &gt; Conta & Segurança</strong> do aplicativo. 
            Ao confirmar a exclusão, todos os seus dados pessoais, publicações, seguidores e histórico 
            de mensagens serão removidos permanentemente dos nossos servidores, sem possibilidade de recuperação.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">4. Contato</h2>
          <p>
            Caso tenha dúvidas sobre nossa política de privacidade ou sobre a manipulação dos seus dados, 
            entre em contato com nosso suporte através dos canais oficiais disponíveis no site.
          </p>
        </section>
      </div>
    </div>
  );
}
