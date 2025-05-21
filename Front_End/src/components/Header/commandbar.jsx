import * as React from 'react'
import { Command } from 'cmdk'
import { useNavigate } from 'react-router-dom'
import { HiArchiveBox, HiHome, HiMagnifyingGlass } from "react-icons/hi2"
import { AiFillProduct } from "react-icons/ai"
import { FiSettings } from "react-icons/fi"

export function CommandMenu({ open, setOpen }) {
  const navigate = useNavigate()
  const inputRef = React.useRef(null)

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
            placeholder="Digite um comando ou pesquise..."
            className="w-full text-black bg-transparent outline-none placeholder:text-gray-600"
          />
        </div>

        <Command.List className="mt-4 max-h-[300px] overflow-y-auto font-semibold text-gray-950">
          <Command.Group heading="Navegação">
            <Command.Item
              onSelect={() => {
                navigate('/Home')
                setOpen(false)
              }}
              className="flex cursor-pointer items-center gap-2 rounded px-2 py-2 text-sm text-gray-600 hover:bg-blue-50"
            >
              <HiHome className="h-4 w-4 text-gray-950" />
              Ir para Home
            </Command.Item>
            
            <Command.Item
              onSelect={() => {
                navigate('/Estoque')
                setOpen(false)
              }}
              className="flex cursor-pointer items-center gap-2 rounded px-2 py-2 text-sm text-gray-600 hover:bg-blue-50"
            >
              <HiArchiveBox className="h-4 w-4 text-gray-950" />
              Ir para Estoque
            </Command.Item>

            <Command.Item
              onSelect={() => {
                navigate('/Produtos')
                setOpen(false)
              }}
              className="flex cursor-pointer items-center gap-2 rounded px-2 py-2 text-sm text-gray-600 hover:bg-blue-50"
            >
              <AiFillProduct className="h-4 w-4 text-gray-950" />
              Ir para Produtos
            </Command.Item>

            <Command.Item
              onSelect={() => {
                navigate('/Configuracoes')
                setOpen(false)
              }}
              className="flex cursor-pointer items-center gap-2 rounded px-2 py-2 text-sm text-gray-600 hover:bg-blue-50"
            >
              <FiSettings className="h-4 w-4 text-gray-950" />
              Ir para Configurações
            </Command.Item>
          </Command.Group>
        </Command.List>
      </Command.Dialog>
    </>
  )
}