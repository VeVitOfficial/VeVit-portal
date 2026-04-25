interface LegalProps {
  page: 'terms' | 'privacy' | 'cookies'
}

const CONTENT: Record<string, { title: string; body: string }> = {
  terms: {
    title: 'Podmínky použití',
    body: 'Podmínky použití platformy VeVit jsou aktuálně připravovány. Prozatím platí, že používáním jakékoliv služby na doméně vevit.fun souhlasíte s férovým používáním, zákazem zneužití a respektováním soukromí ostatních uživatelů.',
  },
  privacy: {
    title: 'Zásady ochrany osobních údajů',
    body: 'VeVit respektuje vaše soukromí. Shromažďujeme pouze údaje nezbytné pro fungování služeb (e-mail, přezdívka). Vaše data neprodáváme ani nesdílíme s třetími stranami. Veškerá data jsou uložena na serverech v Evropě. Máte právo na přístup ke svým datům a jejich výmaz na žádost na info@vevit.fun.',
  },
  cookies: {
    title: 'Cookies',
    body: 'Tento web používá pouze nezbytné cookies pro fungování přihlášení (vevit_auth) a sledování analytiky (Umami). Nepoužíváme reklamní cookies ani sledovací cookies třetích stran.',
  },
}

export default function Legal({ page }: LegalProps) {
  const content = CONTENT[page]
  if (!content) return null

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-text-pri mb-8">{content.title}</h1>
        <div className="prose prose-invert max-w-none">
          <p className="text-text-sec leading-relaxed">{content.body}</p>
        </div>
      </div>
    </div>
  )
}