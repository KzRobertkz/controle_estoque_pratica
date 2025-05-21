import * as React from 'react'
import { Command } from 'cmdk'
import { useNavigate } from 'react-router-dom'
import { HiArchiveBox, HiHome, HiMagnifyingGlass } from "react-icons/hi2"
import { AiFillProduct } from "react-icons/ai"
import { FiSettings } from "react-icons/fi"

// Dados das rotas com palavras-chave
const routes = [
  {
    path: '/Home',
    icon: <HiHome className="h-4 w-4 text-gray-950" />,
    name: 'Home',
    content: {
      title: 'Página Inicial',
      keywords: ['dashboard', 'início', 'resumo', 'home', 'principal', 'índice', 'visão geral'],
      sections: ['Dashboard', 'Gráficos', 'Resumo do Sistema']
    }
  },
  {
    path: '/Estoque',
    icon: <HiArchiveBox className="h-4 w-4 text-gray-950" />,
    name: 'Estoque',
    content: {
      title: 'Controle de Estoque',
      keywords: ['estoque', 'inventário', 'produtos', 'itens', 'almoxarifado', 'quantidade'],
      sections: ['Lista de Produtos', 'Entrada', 'Saída', 'Movimentações']
    }
  },
  {
    path: '/Produtos',
    icon: <AiFillProduct className="h-4 w-4 text-gray-950" />,
    name: 'Produtos',
    content: {
      title: 'Gerenciamento de Produtos',
      keywords: ['produtos', 'cadastro', 'itens', 'mercadorias', 'preços', 'categorias'],
      sections: ['Cadastro', 'Lista', 'Categorias', 'Preços']
    }
  },
  {
    path: '/Configuracoes',
    icon: <FiSettings className="h-4 w-4 text-gray-950" />,
    name: 'Configurações',
    content: {
      title: 'Configurações do Sistema',
      keywords: ['configurações', 'ajustes', 'preferências', 'sistema', 'perfil', 'conta'],
      sections: ['Perfil', 'Sistema', 'Aparência', 'Notificações']
    }
  }
]

export function CommandMenu({ open, setOpen }) {
  const navigate = useNavigate()
  const inputRef = React.useRef(null)
  const [search, setSearch] = React.useState('')

  React.useEffect(() => {
    const down = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [setOpen])

  const searchResults = React.useMemo(() => {
    if (!search) return []
    
    const searchLower = search.toLowerCase()
    return routes.flatMap(route => {
      const matches = []
      
      // Procura no título
      if (route.content.title.toLowerCase().includes(searchLower)) {
        matches.push({
          route,
          type: 'título',
          match: route.content.title
        })
      }
      
      // Procura nas palavras-chave
      route.content.keywords.forEach(keyword => {
        if (keyword.toLowerCase().includes(searchLower)) {
          matches.push({
            route,
            type: 'palavra-chave',
            match: keyword
          })
        }
      })
      
      // Procura nas seções
      route.content.sections.forEach(section => {
        if (section.toLowerCase().includes(searchLower)) {
          matches.push({
            route,
            type: 'seção',
            match: section
          })
        }
      })
      
      return matches
    })
  }, [search])

  return (
    <>
      {/* Overlay escuro */}
      {open && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 transition-all duration-100 ease-in-out"
          onClick={() => setOpen(false)}
        />
      )}
      
      <Command.Dialog
        open={open}
        onOpenChange={setOpen}
        label="Menu de Comandos"
        className="fixed left-1/2 top-1/2 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-4 shadow-2xl z-50"
      >
        <div className="flex items-center border-b border-gray-400 pb-4">
          <HiMagnifyingGlass className="mr-2 h-5 w-5 text-gray-600" />
          <Command.Input
            ref={inputRef}
            value={search}
            onValueChange={setSearch}
            placeholder="Digite para pesquisar em todo o sistema..."
            className="w-full text-black bg-transparent outline-none placeholder:text-gray-600"
          />
        </div>

        <Command.List className="mt-4 max-h-[300px] overflow-y-auto scrollbar-hide font-semibold text-stone-950">
          {search ? (
            <Command.Group heading="Resultados da Pesquisa">
              {searchResults.length > 0 ? (
                searchResults.map((result, index) => (
                  <Command.Item
                    key={`${result.route.path}-${index}`}
                    onSelect={() => {
                      navigate(result.route.path)
                      setOpen(false)
                    }}
                    className="flex items-center justify-between px-2 py-3 text-sm hover:bg-blue-50 rounded cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      {result.route.icon}
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-950">
                          {result.route.content.title}
                        </span>
                        <span className="text-xs text-gray-500">
                          Encontrado em: {result.type} - "{result.match}"
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">
                      {result.route.path}
                    </span>
                  </Command.Item>
                ))
              ) : (
                <div className="py-6 text-center text-sm text-gray-500">
                  Nenhum resultado encontrado para "{search}"
                </div>
              )}
            </Command.Group>
          ) : (
            <Command.Group heading="Navegação">
              {routes.map((route) => (
                <Command.Item
                  key={route.path}
                  onSelect={() => {
                    navigate(route.path)
                    setOpen(false)
                  }}
                  className="flex cursor-pointer items-center gap-2 rounded px-2 py-2 text-sm text-gray-600 hover:bg-blue-50"
                >
                  {route.icon}
                  {route.content.title}
                </Command.Item>
              ))}
            </Command.Group>
          )}
        </Command.List>
      </Command.Dialog>
    </>
  )
}