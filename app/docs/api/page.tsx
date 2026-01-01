import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Code, Zap, Lock, Webhook, BarChart3, MessageSquare } from 'lucide-react';

export default function ApiDocsPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-champagne to-white">
            {/* Header */}
            <header className="border-b border-charcoal/10 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-charcoal/60 hover:text-charcoal transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm">Torna a VirtualTwin</span>
                    </Link>
                    <span className="text-gold font-bold text-sm uppercase tracking-wider">API Documentation</span>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-12">
                {/* Title */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-serif text-charcoal mb-4">
                        VirtualTwin <span className="text-gold">API</span>
                    </h1>
                    <p className="text-charcoal/60 max-w-xl mx-auto">
                        Integra VirtualTwin nelle tue applicazioni. Disponibile per piani Conquistatore e Imperatore.
                    </p>
                </div>

                {/* Rate Limits */}
                <section className="mb-16">
                    <h2 className="text-2xl font-serif text-charcoal mb-6 flex items-center gap-3">
                        <Zap className="w-6 h-6 text-gold" />
                        Rate Limits
                    </h2>
                    <div className="bg-white rounded-2xl border border-charcoal/10 p-6 overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-charcoal/10">
                                    <th className="pb-3 text-charcoal/60 font-medium">Piano</th>
                                    <th className="pb-3 text-charcoal/60 font-medium">Richieste/min</th>
                                    <th className="pb-3 text-charcoal/60 font-medium">Messaggi/mese</th>
                                    <th className="pb-3 text-charcoal/60 font-medium">Webhooks</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-charcoal/5">
                                <tr>
                                    <td className="py-3 font-medium">Conquistatore</td>
                                    <td className="py-3">60</td>
                                    <td className="py-3">20,000</td>
                                    <td className="py-3">5</td>
                                </tr>
                                <tr>
                                    <td className="py-3 font-medium text-gold">Imperatore</td>
                                    <td className="py-3">300</td>
                                    <td className="py-3">50,000</td>
                                    <td className="py-3">20</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Authentication */}
                <section className="mb-16">
                    <h2 className="text-2xl font-serif text-charcoal mb-6 flex items-center gap-3">
                        <Lock className="w-6 h-6 text-gold" />
                        Autenticazione
                    </h2>
                    <div className="bg-white rounded-2xl border border-charcoal/10 p-6">
                        <p className="text-charcoal/70 mb-4">
                            Tutte le richieste devono includere la tua API Key nell&apos;header Authorization:
                        </p>
                        <div className="bg-charcoal rounded-xl p-4 overflow-x-auto">
                            <code className="text-green-400 text-sm">
                                Authorization: Bearer vtw_your_api_key_here
                            </code>
                        </div>
                        <p className="text-charcoal/50 text-sm mt-4">
                            Trovi la tua API Key in Dashboard → Settings → API.
                        </p>
                    </div>
                </section>

                {/* Endpoints */}
                <section className="mb-16">
                    <h2 className="text-2xl font-serif text-charcoal mb-6 flex items-center gap-3">
                        <Code className="w-6 h-6 text-gold" />
                        Endpoints
                    </h2>

                    {/* Chat API */}
                    <div className="bg-white rounded-2xl border border-charcoal/10 p-6 mb-6">
                        <div className="flex items-center gap-3 mb-4">
                            <MessageSquare className="w-5 h-5 text-gold" />
                            <h3 className="text-lg font-medium text-charcoal">POST /api/v1/chat</h3>
                        </div>
                        <p className="text-charcoal/70 mb-4">Invia un messaggio al tuo Clone AI e ricevi una risposta.</p>
                        <div className="bg-charcoal rounded-xl p-4 overflow-x-auto mb-4">
                            <pre className="text-sm text-gray-300">
                                {`{
  "clone_id": "clone_abc123",
  "user_id": "customer_456",
  "message": "Quanto costa la spedizione?",
  "channel": "whatsapp"
}`}
                            </pre>
                        </div>
                        <p className="text-charcoal/60 text-sm font-medium">Risposta:</p>
                        <div className="bg-charcoal rounded-xl p-4 overflow-x-auto">
                            <pre className="text-sm text-gray-300">
                                {`{
  "response": "La spedizione è gratuita per ordini sopra €50!",
  "stage": "inquiry",
  "tokens_used": 234
}`}
                            </pre>
                        </div>
                    </div>

                    {/* Analytics API */}
                    <div className="bg-white rounded-2xl border border-charcoal/10 p-6 mb-6">
                        <div className="flex items-center gap-3 mb-4">
                            <BarChart3 className="w-5 h-5 text-gold" />
                            <h3 className="text-lg font-medium text-charcoal">GET /api/v1/analytics</h3>
                        </div>
                        <p className="text-charcoal/70 mb-4">Ottieni metriche del tuo Clone AI.</p>
                        <div className="bg-charcoal rounded-xl p-4 overflow-x-auto">
                            <pre className="text-sm text-gray-300">
                                {`{
  "total_conversations": 234,
  "conversion_rate": 12.5,
  "avg_response_time": 1.2,
  "top_questions": [...]
}`}
                            </pre>
                        </div>
                    </div>

                    {/* Webhooks */}
                    <div className="bg-white rounded-2xl border border-charcoal/10 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Webhook className="w-5 h-5 text-gold" />
                            <h3 className="text-lg font-medium text-charcoal">POST /api/v1/webhooks</h3>
                        </div>
                        <p className="text-charcoal/70 mb-4">Registra webhook per ricevere eventi in tempo reale.</p>
                        <div className="bg-charcoal rounded-xl p-4 overflow-x-auto mb-4">
                            <pre className="text-sm text-gray-300">
                                {`{
  "url": "https://your-app.com/webhooks/virtualtwin",
  "events": ["conversation.started", "lead.converted"]
}`}
                            </pre>
                        </div>
                        <p className="text-charcoal/60 text-sm">
                            <strong>Eventi disponibili:</strong> conversation.started, message.sent, message.received, lead.converted, lead.updated
                        </p>
                    </div>
                </section>

                {/* CTA */}
                <div className="text-center bg-gradient-to-r from-gold/10 to-gold/5 rounded-3xl p-12">
                    <h3 className="text-2xl font-serif text-charcoal mb-4">Pronto per integrare?</h3>
                    <p className="text-charcoal/60 mb-6">L&apos;API è disponibile per piani Conquistatore e Imperatore.</p>
                    <Link
                        href="/dashboard/billing"
                        className="inline-flex items-center gap-2 gold-gradient text-white px-8 py-4 rounded-full font-bold text-sm uppercase tracking-wider hover:opacity-90 transition-opacity"
                    >
                        <Zap className="w-4 h-4" />
                        Upgrade al Piano API
                    </Link>
                </div>
            </main>
        </div>
    );
}
