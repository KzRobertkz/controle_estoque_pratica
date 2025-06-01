import { useSearch } from '../Header/searchcontent';

export const HideSearchComponent = () => {

    const { hideSearch, setHideSearch } = useSearch();

    // Função toggle
    const toggleSearch = () => {
        const newValue = !hideSearch;
        setHideSearch(newValue);
        localStorage.setItem('hideSearch', JSON.stringify(newValue));
    };


return (

        <div className="bg-white rounded-lg p-6 border border-stone-200 w-full">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-stone-700 font-medium">
                        Ocultar Pesquisar
                    </p>
                    <p className="text-base text-stone-500">
                        Oculta a Barra de pesquisa no cabeçalho
                    </p>
                </div>
                        
                <button 
                    onClick={toggleSearch}
                    className={`relative inline-flex ml-3 h-7 w-12 items-center rounded-full transition-colors duration-300 focus:outline-none
                    ${hideSearch ? 'bg-blue-600' : 'bg-stone-200'}`}
                >
                    <span
                        className={`absolute h-5 w-5 rounded-full bg-white transition-all duration-300 ease-in-out
                        ${hideSearch ? 'left-[calc(100%-1.4rem)]' : 'left-0.5'}`}
                    />
                </button>
            </div>
        </div>

  )
}
