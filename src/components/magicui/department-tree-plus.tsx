"use client";

import React, {createContext, forwardRef, useCallback, useContext, useEffect, useState,} from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import {ChevronDown, ChevronRight, Diamond, Pencil, Trash} from "lucide-react";

import {cn} from "@/lib/utils";
import {ScrollArea} from "@/components/ui/scroll-area";
import {DropdownMenu, DropdownMenuGroup, DropdownMenuTrigger} from "@radix-ui/react-dropdown-menu";
import {
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut
} from "@/components/ui/dropdown-menu";

type TreeViewElement = {
    id: string;
    name: string;
    isSelectable?: boolean;
    children?: TreeViewElement[];
};

type TreeContextProps = {
    selectedId: string | undefined;
    expandedItems: string[] | undefined;
    indicator: boolean;
    handleExpand: (id: string) => void;
    selectItem: (id: string) => void;
    setExpandedItems?: React.Dispatch<React.SetStateAction<string[] | undefined>>;
    openIcon?: React.ReactNode;
    closeIcon?: React.ReactNode;
    direction: "rtl" | "ltr";
};

const TreeContext = createContext<TreeContextProps | null>(null);

const useTree = () => {
    const context = useContext(TreeContext);
    if (!context) {
        throw new Error("useTree must be used within a TreeProvider");
    }
    return context;
};

interface TreeViewComponentProps extends React.HTMLAttributes<HTMLDivElement> {
}

type Direction = "rtl" | "ltr" | undefined;

type TreeViewProps = {
    initialSelectedId?: string;
    indicator?: boolean;
    elements?: TreeViewElement[];
    initialExpandedItems?: string[];
    openIcon?: React.ReactNode;
    closeIcon?: React.ReactNode;
} & TreeViewComponentProps;

const TreePlus = forwardRef<HTMLDivElement, TreeViewProps>(
    (
        {
            className,
            elements,
            initialSelectedId,
            initialExpandedItems,
            children,
            indicator = true,
            openIcon,
            closeIcon,
            dir,
            ...props
        },
        ref,
    ) => {
        const [selectedId, setSelectedId] = useState<string | undefined>(
            initialSelectedId,
        );
        const [expandedItems, setExpandedItems] = useState<string[] | undefined>(
            initialExpandedItems,
        );

        const selectItem = useCallback((id: string) => {
            setSelectedId(id);
        }, []);

        const handleExpand = useCallback((id: string) => {
            setExpandedItems((prev) => {
                if (prev?.includes(id)) {
                    return prev.filter((item) => item !== id);
                }
                return [...(prev ?? []), id];
            });
        }, []);

        const expandSpecificTargetedElements = useCallback(
            (elements?: TreeViewElement[], selectId?: string) => {
                if (!elements || !selectId) return;
                const findParent = (
                    currentElement: TreeViewElement,
                    currentPath: string[] = [],
                ) => {
                    const isSelectable = currentElement.isSelectable ?? true;
                    const newPath = [...currentPath, currentElement.id];
                    if (currentElement.id === selectId) {
                        if (isSelectable) {
                            setExpandedItems((prev) => [...(prev ?? []), ...newPath]);
                        } else {
                            if (newPath.includes(currentElement.id)) {
                                newPath.pop();
                                setExpandedItems((prev) => [...(prev ?? []), ...newPath]);
                            }
                        }
                        return;
                    }
                    if (
                        isSelectable &&
                        currentElement.children &&
                        currentElement.children.length > 0
                    ) {
                        currentElement.children.forEach((child) => {
                            findParent(child, newPath);
                        });
                    }
                };
                elements.forEach((element) => {
                    findParent(element);
                });
            },
            [],
        );

        useEffect(() => {
            if (initialSelectedId) {
                expandSpecificTargetedElements(elements, initialSelectedId);
            }
        }, [initialSelectedId, elements]);

        const direction = dir === "rtl" ? "rtl" : "ltr";

        return (
            <TreeContext.Provider
                value={{
                    selectedId,
                    expandedItems,
                    handleExpand,
                    selectItem,
                    setExpandedItems,
                    indicator,
                    openIcon,
                    closeIcon,
                    direction,
                }}
            >
                <div className={cn("size-full", className)}>
                    <ScrollArea
                        ref={ref}
                        className="h-full relative px-2"
                        dir={dir as Direction}
                    >
                        <AccordionPrimitive.Root
                            {...props}
                            type="multiple"
                            defaultValue={expandedItems}
                            value={expandedItems}
                            className="flex flex-col gap-1"
                            onValueChange={(value) =>
                                setExpandedItems((prev) => [...(prev ?? []), value[0]])
                            }
                            dir={dir as Direction}
                        >
                            {children}
                        </AccordionPrimitive.Root>
                    </ScrollArea>
                </div>
            </TreeContext.Provider>
        );
    },
);

TreePlus.displayName = "Tree";

const TreeIndicator = forwardRef<HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>>(({className, ...props}, ref) => {
    const {direction} = useTree();

    return (
        <div
            dir={direction}
            ref={ref}
            className={cn(
                "h-full w-px bg-muted absolute left-1.5 rtl:right-1.5 py-4 rounded-md hover:bg-slate-300 duration-300 ease-in-out",
                className,
            )}
            {...props}
        />
    );
});

TreeIndicator.displayName = "TreeIndicator";

interface FolderComponentProps
    extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item> {
}

type FolderProps = {
    expandedItems?: string[];
    element: string;
    isSelectable?: boolean;
    isSelect?: boolean;
    value: string;
    onClick?: (id: string) => void;
    deleteDialog: any;
    updateDialog: any
} & FolderComponentProps;

const FolderPlus = forwardRef<HTMLDivElement,
    FolderProps & React.HTMLAttributes<HTMLDivElement>>(
    (
        {
            className,
            element,
            value,
            isSelectable = true,
            isSelect,
            children,
            onClick,
            deleteDialog,
            updateDialog,
            ...props

        },
        ref,
    ) => {
        const {
            direction,
            handleExpand,
            expandedItems,
            indicator,
            setExpandedItems,
            openIcon,
            closeIcon
        } = useTree();
        return (
            <AccordionPrimitive.Item
                {...props}
                value={value}
                className="relative overflow-hidden h-full "
            >
                <AccordionPrimitive.Trigger
                    className={cn(
                        `flex items-center gap-1 text rounded-md`,
                        className,
                        {
                            "bg-muted rounded-md": isSelect && isSelectable,
                            "cursor-pointer": isSelectable,
                            "cursor-not-allowed opacity-50": !isSelectable,
                        },
                    )}
                    disabled={!isSelectable}
                >
                    <span onClick={() => handleExpand(value)}>
                         {children.length > 0 ? (expandedItems?.includes(value)
                             ? openIcon ?? <ChevronDown/>
                             : closeIcon ?? <ChevronRight/>) : <Diamond className="size-3"/>}
                    </span>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <span>{element}</span>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-36">
                            <DropdownMenuLabel>编辑部门信息</DropdownMenuLabel>
                            <DropdownMenuSeparator/>
                            <DropdownMenuGroup>
                                <DropdownMenuItem onClick={() => {
                                    onClick && onClick(value)
                                    updateDialog.trigger()
                                }}>
                                    修改
                                    <DropdownMenuShortcut><Pencil className={'size-4'}/></DropdownMenuShortcut>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => {
                                    onClick && onClick(value)
                                    deleteDialog.trigger()
                                }}>
                                    删除
                                    <DropdownMenuShortcut><Trash className={'size-4'}/></DropdownMenuShortcut>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </AccordionPrimitive.Trigger>
                <AccordionPrimitive.Content
                    className="text data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down relative overflow-hidden h-full">
                    {element && indicator && <TreeIndicator aria-hidden="true"/>}
                    <AccordionPrimitive.Root
                        dir={direction}
                        type="multiple"
                        className="flex flex-col gap-1 py-2 ml-6 rtl:mr-5 "
                        defaultValue={expandedItems}
                        value={expandedItems}
                        onValueChange={(value) => {
                            setExpandedItems?.((prev) => [...(prev ?? []), value[0]]);
                        }}
                    >
                        {children}
                    </AccordionPrimitive.Root>
                </AccordionPrimitive.Content>
            </AccordionPrimitive.Item>
        );
    },
);

FolderPlus.displayName = "Folder";

export {FolderPlus, TreePlus, type TreeViewElement};
