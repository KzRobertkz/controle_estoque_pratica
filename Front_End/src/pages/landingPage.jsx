import { motion } from "framer-motion";
import {
  Wrench,
  LayoutDashboard,
  History,
  ShieldCheck,
  Bell,
  FileBarChart,
  Mail,
  Phone,
  MapPin,
  Star,
  CheckCircle,
  ArrowRight,
  Play,
  Sparkles,
} from "lucide-react";
import { useState } from "react";

export default function LandingPage() {

  const features = [
    {
      title: "Gestão de Ferramentas",
      description: "Cadastre e controle o uso de ferramentas com precisão absoluta e rastreamento em tempo real.",
      icon: <Wrench className="w-12 h-12 text-cyan-400 mx-auto mb-4" />,
      color: "from-cyan-500/20 to-blue-500/20"
    },
    {
      title: "Dashboard Interativo",
      description: "Gráficos dinâmicos e indicadores atualizados automaticamente para decisões estratégicas.",
      icon: <LayoutDashboard className="w-12 h-12 text-emerald-400 mx-auto mb-4" />,
      color: "from-emerald-500/20 to-cyan-500/20"
    },
    {
      title: "Histórico Detalhado",
      description: "Rastreamento completo de movimentações por data, item, usuário.",
      icon: <History className="w-12 h-12 text-purple-400 mx-auto mb-4" />,
      color: "from-purple-500/20 to-indigo-500/20"
    },
    {
      title: "Controle de Acesso",
      description: "Sistema robusto de permissões com autenticação e logs de segurança.",
      icon: <ShieldCheck className="w-12 h-12 text-yellow-400 mx-auto mb-4" />,
      color: "from-yellow-500/20 to-orange-500/20"
    },
    {
      title: "Alertas Inteligentes",
      description: "Notificações preditivas de estoque mínimo, manutenção e anomalias.",
      icon: <Bell className="w-12 h-12 text-rose-400 mx-auto mb-4" />,
      color: "from-rose-500/20 to-pink-500/20"
    },
    {
      title: "Relatórios Avançados",
      description: "Analytics profissionais com exportação em múltiplos formatos.",
      icon: <FileBarChart className="w-12 h-12 text-indigo-400 mx-auto mb-4" />,
      color: "from-indigo-500/20 to-purple-500/20"
    },
  ];

  const testimonials = [];

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };

  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = () => {
    setIsLoading(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white overflow-x-hidden">

      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-slate-900/95 backdrop-blur-xl border-b border-white/10 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent cursor-pointer" 
                  onClick={() => scrollToSection("hero")}>
                StockMaster
              </h1>
            </div>
            
            <nav className="hidden md:flex items-center space-x-6">
              <button onClick={() => scrollToSection("features")} 
                      className="bg-zinc-900 ring-1 ring-sky-950 text-gray-300 focus:outline-none focus:ring-1 focus:ring-sky-700 hover:text-cyan-300 hover:bg-cyan-500/10 px-3 py-1 rounded-lg transition-all duration-200">
                Recursos
              </button>
              <button onClick={() => scrollToSection("sobre")} 
                      className="bg-zinc-900 ring-1 ring-sky-950 text-gray-300 focus:outline-none focus:ring-1 focus:ring-sky-700 hover:text-cyan-300 hover:bg-cyan-500/10 px-3 py-1 rounded-lg transition-all duration-200">
                Sobre
              </button>
              <button onClick={() => scrollToSection("contato")} 
                      className="bg-zinc-900 ring-1 ring-sky-950 text-gray-300 focus:outline-none focus:ring-1 focus:ring-sky-700 hover:text-cyan-300 hover:bg-cyan-500/10 px-3 py-1    rounded-lg transition-all duration-200">
                Contato
              </button>
            </nav>

            <div className="flex items-center space-x-4">
              <a href="/login" className="text-gray-300 hover:text-cyan-300 hover:bg-cyan-500/10 px-4 py-2 rounded-lg transition-all duration-200">
                Entrar
              </a>
              <a href="/signup" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-6 py-2 rounded-full font-semibold transition-all duration-200 transform hover:scale-105 hover:shadow-xl shadow-cyan-500/25">
                Começar Grátis
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="mx-80 pr-20 ">
        <motion.section
        id="sobre"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="pt-8 pb-36 text-center max-w-4xl mx-auto px-6"
        >
            <section id="hero" className="relative h-screenflex mt-36 items-center justify-center overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-4xl mx-auto">
                    <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full border border-cyan-500/30 mb-8">
                    <Star className="w-4 h-4 text-cyan-400 mr-2" />
                    <span className="text-sm text-cyan-300 font-medium">Líder em Gestão de Estoque</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
                    <span className="bg-gradient-to-r from-white via-cyan-100 to-blue-200 bg-clip-text text-transparent">
                        Controle total com o
                    </span>
                    <br />
                    <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                        StockMaster
                    </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-300 font-light mb-12 leading-relaxed max-w-3xl mx-auto">
                    Revolucione sua gestão de estoque, dashboards interativos e automação inteligente. 
                    <span className="text-cyan-400 font-medium"> Aumente sua eficiência em até 200%.</span>
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
                    <a href="/login" className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-lg rounded-full font-semibold transition-all duration-300 transform hover:scale-110 shadow-2xl hover:shadow-cyan-500/30">
                        <span className="flex items-center">
                        Acessar Sistema
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                        </span>
                    </a>
                    
                    <a href="/signup" className="group flex items-center px-8 py-4 border-2 border-cyan-400/50 text-cyan-300 hover:border-cyan-300 hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-blue-500/20 hover:text-white rounded-full text-lg font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/25">
                        <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
                        Criar Conta
                    </a>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-2xl mx-auto">
                    {[
                        { number: "300+", label: "Empresas" },
                        { number: "99.9%", label: "Uptime" },
                        { number: "2mil+", label: "Itens Gerenciados" },
                        { number: "200%", label: "ROI Médio" }
                    ].map((stat, idx) => (
                        <div key={idx} className="text-center">
                        <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                            {stat.number}
                        </div>
                        <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
                        </div>
                    ))}
                    </div>
                </div>
                </div>
            </section>
        </motion.section>

        {/* Dashboard Preview */}
        <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 3 }}
        viewport={{ once: true }}
        className="px-6"
        >
            <section className="py-20 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-3xl blur-3xl transform -rotate-1"></div>
                    <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10">
                    <div className="aspect-video bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl p-6 relative overflow-hidden">
                        <div className="absolute top-4 left-4 flex space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        </div>
                        
                        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
                        <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl p-4 border border-cyan-500/30">
                            <div className="text-cyan-400 text-sm font-medium mb-2">Estoque Total</div>
                            <div className="text-2xl font-bold text-white">24,847</div>
                            <div className="text-xs text-green-400 mt-1">↗ +12% este mês</div>
                        </div>
                        
                        <div className="bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-xl p-4 border border-emerald-500/30">
                            <div className="text-emerald-400 text-sm font-medium mb-2">Valor Total</div>
                            <div className="text-2xl font-bold text-white">R$ 1.234.567</div>
                            <div className="text-xs text-green-400 mt-1">↗ +8% este mês</div>
                        </div>
                        
                        <div className="bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-xl p-4 border border-purple-500/30">
                            <div className="text-purple-400 text-sm font-medium mb-2">Alertas Ativos</div>
                            <div className="text-2xl font-bold text-white">3</div>
                            <div className="text-xs text-yellow-400 mt-1">Requer atenção</div>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </section>
        </motion.section>

        {/* Features Section */}
        <motion.section
        id="features"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 1 }}
        viewport={{ once: true }}
        className="mt-24 max-w-6xl mx-auto px-6"
        >
            <section id="features" className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                    <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                        Recursos Revolucionários
                    </span>
                    </h2>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                    Tecnologia de ponta para transformar completamente sua gestão de estoque
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, idx) => (
                    <div 
                        key={idx} 
                        className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl p-8 rounded-2xl border border-white/10 hover:border-cyan-500/50 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl"
                    >
                        <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                        <div className="relative z-10">
                        <div className="mb-6">
                            {feature.icon}
                        </div>
                        <h3 className="text-xl font-bold text-white mb-4 group-hover:text-cyan-300 transition-colors duration-200">
                            {feature.title}
                        </h3>
                        <p className="text-gray-300 leading-relaxed">
                            {feature.description}
                        </p>
                        </div>
                    </div>
                    ))}
                </div>
                </div>
            </section>
        </motion.section>

        {/* Testimonials */}
        <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 1.1 }}
        viewport={{ once: true }}
        className="py-20 bg-gradient-to-r from-slate-800/50 to-slate-900/50 rounded-lg"
        >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Clientes Satisfeitos
            </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
                <div key={idx} className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl p-6 rounded-2xl border border-white/10">
                <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                </div>
                <p className="text-gray-300 mb-4 italic">"{testimonial.text}"</p>
                <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-sm">{testimonial.name.charAt(0)}</span>
                    </div>
                    <div>
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="text-sm text-gray-400">{testimonial.company}</div>
                    </div>
                </div>
                </div>
            ))}
            </div>
        </div>
        </motion.section>

        {/* About Section */}
        <motion.section
        id="sobre"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 1.1 }}
        viewport={{ once: true }}
        className="py-20"
        >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
                <h2 className="text-4xl font-bold mb-6">
                <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    Por que escolher o StockMaster?
                </span>
                </h2>
                <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Desenvolvido com tecnologia de ponta e experiência em gestão de estoque, 
                o StockMaster oferece a solução mais completa e intuitiva.
                </p>

                <div className="space-y-4">
                {[
                    "Interface intuitiva e moderna",
                    "Integração com sistemas existentes",
                    "Gerenciamento de usuários",
                    "Atualizações automáticas gratuitas"
                ].map((item, idx) => (
                    <div key={idx} className="flex items-center">
                    <CheckCircle className="w-6 h-6 text-green-400 mr-3 flex-shrink-0" />
                    <span className="text-gray-300">{item}</span>
                    </div>
                ))}
                </div>
            </div>

            <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-3xl p-8 backdrop-blur-xl border border-white/10">
                <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl flex items-center justify-center">
                    <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <LayoutDashboard className="w-10 h-10 text-white" />
                    </div>
                    <div className="text-white font-semibold">Dashboard Inteligente</div>
                    <div className="text-gray-400 text-sm mt-2">Visualize tudo em tempo real</div>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </div>
        </motion.section>

        {/* Contact Section */}
        <motion.footer id="contato"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 1.1 }}
            viewport={{ once: true }}
            className="mt-32 text-center text-blue-100 text-sm px-6 pb-10"
        >
        <footer id="contato" className="py-20 bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    Vamos conversar?
                    </h2>
                    <p className="text-xl text-gray-300">
                    Nossa equipe está pronta para ajudar você a revolucionar sua gestão de estoque
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    <div>
                        <div className="space-y-6">
                            <div className="flex items-center p-4 bg-gradient-to-r from-slate-800 to-slate-700 rounded-xl border border-white/10">
                                <Mail className="w-6 h-6 text-cyan-400 mr-4" />
                                <div>
                                    <div className="font-semibold text-white">Email</div>
                                    <div className="text-gray-300">suporte@stockmaster.com</div>
                                </div>
                            </div>
                            
                            <div className="flex items-center p-4 bg-gradient-to-r from-slate-800 to-slate-700 rounded-xl border border-white/10">
                                <Phone className="w-6 h-6 text-cyan-400 mr-4" />
                                <div>
                                    <div className="font-semibold text-white">Telefone</div>
                                    <div className="text-gray-300">(31) 99999-9999</div>
                                </div>
                            </div>
                            
                            <div className="flex items-center p-4 bg-gradient-to-r from-slate-800 to-slate-700 rounded-xl border border-white/10">
                                <MapPin className="w-6 h-6 text-cyan-400 mr-4" />
                                <div>
                                    <div className="font-semibold text-white">Localização</div>
                                    <div className="text-gray-300">Belo Horizonte, MG</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Form email */}
                    <form className="space-y-6" onSubmit={handleSubmit} action="https://formsubmit.co/COLE-SEU-EMAIL-AQUI" method="POST">  {/* ex: preencher "COLE-SEU-EMAIL-AQUI" com email de suporte*/}
                        <div>
                            <input 
                                type="text" 
                                name="nome"
                                placeholder="Seu nome" 
                                required
                                className="w-full px-6 py-4 bg-slate-800/80 backdrop-blur-xl border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-cyan-500 focus:outline-none transition-colors duration-200"
                            />
                        </div>
                        <div>
                            <input 
                                type="email" 
                                name="email"
                                placeholder="Seu email" 
                                required
                                className="w-full px-6 py-4 bg-slate-800/80 backdrop-blur-xl border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-cyan-500 focus:outline-none transition-colors duration-200"
                            />
                        </div>
                        <div>
                            <textarea 
                                name="mensagem-de-Vamos-conversar?"
                                placeholder="Sua mensagem" 
                                rows={4}
                                required
                                className="w-full px-6 py-4 bg-slate-800/80 backdrop-blur-xl border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-cyan-500 focus:outline-none transition-colors duration-200 resize-none"
                            />
                        </div>

                        {/* Anti-spam hidden input */}
                        <input type="hidden" name="_captcha" value="false" />
                        <input type="hidden" name="_next" value="http://127.0.0.1:5173/sucess-email-sent" /> {/* Mude para o nome do seu site no http */}
                        <input type="hidden" name="_autoresponse" value="Recebemos sua mensagem! agradecemos pelo contato e logo responderemos"></input>
                        <button className="focus:outline-none  w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-cyan-500/25"> 
                            {isLoading ? (
                                <div className="flex text-2xl" >
                                    <svg className="animate-spin h-10 w-10 mr-3 text-white" viewBox="0 0 24 24">
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v8z"
                                    ></path>
                                    </svg>
                                    Enviando...
                                </div>
                                ) : (
                                'Enviar Mensagem'
                                )}
                        </button>
                    </form>
                </div>

                <div className="mt-16 pt-8 border-t border-white/10 text-center">
                    <p className="text-gray-400">
                    © 2025 StockMaster. Todos os direitos reservados. 
                    <span className="text-cyan-400 ml-2">Feito com ❤️ By Eu, Robert Christian em Belo Horizonte</span>
                    </p>
                </div>
            </div>
        </footer>
        </motion.footer>
      </div>
    </div>
  );
}