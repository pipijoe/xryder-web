import { X } from "lucide-react"

interface TagProps {
    id: number
    text: string
    handleDelete: (id: number) => void
}

const TagWithDelete = ({ id, text, handleDelete }: TagProps) => {

    return (
        <div className="inline-flex items-center rounded-full px-3 py-1 cursor-pointer transition-all duration-300 ease-in-out bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 hover:from-blue-200 hover:to-blue-300 dark:hover:from-blue-800 dark:hover:to-blue-700 border-0 shadow-md hover:shadow-lg text-sm">
            <span>{text}</span>
            <button aria-label={`删除标签 ${text}`}>
                <X className="ml-1 h-3.5 w-3.5" onClick={() => handleDelete(id)} />
            </button>
        </div>
    )
}
export default TagWithDelete