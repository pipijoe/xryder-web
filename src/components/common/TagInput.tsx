'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import {toast} from "sonner";

interface TagInputProps {
    onTagsChange: (tags: string[]) => void
    initialTags?: string[]
    fetchSuggestions: (query: string) => Promise<string[]>
}

/**
 * 标签选择器
 * @param onTagsChange 父组件用于获取选择的标签
 * @param initialTags 初始的标签
 * @param fetchSuggestions 监听输入框变化，通过输入的内容实时查找后台标签推荐内容
 * @constructor
 */
function TagInput({ onTagsChange, initialTags = [], fetchSuggestions }: TagInputProps) {
    const [inputValue, setInputValue] = useState('')
    const [suggestions, setSuggestions] = useState<string[]>([])
    const [selectedTags, setSelectedTags] = useState<string[]>(initialTags)
    const inputRef = useRef<HTMLInputElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const fetchData = async () => {
            if (inputValue.trim()) {
                try {
                    const result = await fetchSuggestions(inputValue)
                    setSuggestions(result)
                } catch (error) {
                    console.error('Error fetching suggestions:', error)
                    setSuggestions([])
                }
            } else {
                setSuggestions([])
            }
        }

        const debounce = setTimeout(() => {
            fetchData()
        }, 300)

        return () => clearTimeout(debounce)
    }, [inputValue])

    useEffect(() => {
        onTagsChange(selectedTags)
    }, [selectedTags, onTagsChange])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value)
    }

    const handleTagSelect = (tag: string) => {
        if (selectedTags.length > 3) {
            toast.warning("最多添加4个标签！")
            return
        }
        if (!selectedTags.includes(tag)) {
            setSelectedTags([...selectedTags, tag])
            setInputValue('')
            setSuggestions([])
            inputRef.current?.focus()
        }
    }

    const handleTagRemove = (tag: string) => {
        setSelectedTags(selectedTags.filter(t => t !== tag))
        inputRef.current?.focus()
    }

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && inputValue.trim() && !suggestions.includes(inputValue)) {
            if (inputValue.trim().length > 32) {
                toast.warning("标签过长！")
                return
            }
            handleTagSelect(inputValue.trim())
            e.preventDefault()
        } else if (e.key === 'Backspace' && !inputValue && selectedTags.length > 0) {
            handleTagRemove(selectedTags[selectedTags.length - 1])
        }
    }

    const handleContainerClick = () => {
        inputRef.current?.focus()
    }

    return (
        <div className="w-full">
            <div
                ref={containerRef}
                className="flex flex-wrap items-center gap-2 p-2 rounded-md border focus-within:ring-1 focus-within:border-primary"
                onClick={handleContainerClick}
            >
                {selectedTags.map(tag => (
                    <div key={tag} className="flex items-center bg-primary text-primary-foreground px-2 py-1 rounded-full text-sm">
                        {tag}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 ml-1 hover:bg-primary-foreground hover:text-primary rounded-full"
                            onClick={(e) => {
                                e.stopPropagation()
                                handleTagRemove(tag)
                            }}
                        >
                            <X className="h-3 w-3" />
                        </Button>
                    </div>
                ))}
                <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleInputKeyDown}
                    placeholder={selectedTags.length === 0 ? "输入标签..." : ""}
                    className="flex-grow outline-none bg-transparent"
                />
            </div>
            <div className={'relative'}>
                {inputValue &&
                    <div className={'absolute top-0 left-0 bg-background w-full shadow-lg p-4 rounded-md'}>
                        {suggestions.length > 0 && (
                            <ul className="bg-background rounded-md border">
                                {suggestions.map(suggestion => (
                                    <li
                                        key={suggestion}
                                        className="px-3 py-2 hover:bg-muted cursor-pointer"
                                        onClick={() => handleTagSelect(suggestion)}
                                    >
                                        {suggestion}
                                    </li>
                                ))}
                            </ul>
                        )}
                        {!suggestions.includes(inputValue) && (
                            <div className="text-sm text-muted-foreground">
                                按回车创建新标签 "{inputValue}"
                            </div>
                        )}
                    </div>
                }
            </div>
        </div>
    )
}

export default TagInput