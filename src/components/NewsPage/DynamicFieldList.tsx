import React, {useEffect, useState} from 'react';
import {DragDropContext, Droppable, Draggable, type DropResult} from '@hello-pangea/dnd';
import TextareaAutosize from 'react-textarea-autosize';
import {v4 as uuidv4} from 'uuid';
import {BadgePlus} from 'lucide-react';

interface FieldItem {
    id: string;
    selectValue: string;
    textValue: string;
    file?: File;
    order: number;
}

interface DynamicFieldListProps {
    onChange: (blocks: { type: string; data: string; display_order: number }[]) => void;
    onRawChange?: (raw: FieldItem[]) => void;
    errorMessage?: string;
    resetSignal?: boolean;
}

const options = [
    {label: 'Párrafo', value: 'paragraph'},
    {label: 'Subtitulo', value: 'subtitle'},
    {label: 'Negrita', value: 'bold'},
    {label: 'Imagen', value: 'image'},
    {label: 'Lista', value: 'list'},
    {label: 'Nota', value: 'note'},
];

const DynamicFieldList: React.FC<DynamicFieldListProps> = ({onChange, onRawChange, errorMessage, resetSignal}) => {
    const [fields, setFields] = useState<FieldItem[]>([
        {id: uuidv4(), selectValue: options[0].value, textValue: '', order: 1},
    ]);

    useEffect(() => {
        if (resetSignal) {
            setFields([{id: uuidv4(), selectValue: 'paragraph', textValue: '', order: 1}]);
        } else {
            const blocks = fields.map(item => ({
                type: item.selectValue,
                data: item.selectValue === 'list'
                    ? item.textValue.split('\n').map(line => line.trim()).filter(Boolean).join('|')
                    : item.textValue,
                display_order: item.order,
            }));
            onChange(blocks);
            if (onRawChange) onRawChange(fields);
        }
    }, [fields, onChange, onRawChange, resetSignal]);

    const addField = () => {
        setFields(prev => [
            ...prev,
            {id: uuidv4(), selectValue: options[0].value, textValue: '', order: prev.length + 1},
        ]);
    };

    const removeField = (id: string) => {
        setFields(prev => {
            const filtered = prev.filter(item => item.id !== id);
            return (filtered.length > 0
                    ? filtered
                    : [{id: uuidv4(), selectValue: options[0].value, textValue: '', order: 1}]
            ).map((item, index) => ({...item, order: index + 1}));
        });
    };

    const handleDragEnd = (result: DropResult) => {
        if (!result.destination) return;
        setFields(prev => {
            const items = Array.from(prev);
            const [moved] = items.splice(result.source.index, 1);
            items.splice(result.destination!.index, 0, moved);
            return items.map((item, index) => ({...item, order: index + 1}));
        });
    };

    const updateField = <K extends keyof FieldItem>(id: string, key: K, value: FieldItem[K]) => {
        setFields(prev => prev.map(item => (item.id === id ? {...item, [key]: value} : item)));
    };

    const renderFieldInput = (field: FieldItem) => {
        if (field.selectValue === 'image') {
            return (
                <div className="flex flex-col gap-2 w-full">
                    <label
                        htmlFor={`file-input-${field.id}`}
                        className="cursor-pointer inline-block bg-gray-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-600 transition"
                    >
                        Seleccionar imagen
                    </label>
                    <input
                        id={`file-input-${field.id}`}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                updateField(field.id, 'file', file);
                                updateField(field.id, 'textValue', URL.createObjectURL(file));
                            }
                        }}
                    />
                    {field.file && (
                        <img
                            src={field.textValue}
                            alt="preview"
                            className="max-h-50 py-2 max-w-full object-contain rounded-xl border-2 bg-white border-gray-300 hover:border-gray-400 focus:outline-none focus:border-[#111c85]"
                        />
                    )}
                </div>
            );
        }

        if (field.selectValue === 'list') {
            return (
                <TextareaAutosize
                    value={
                        field.textValue
                            .split('\n')
                            .map(line => (line.trim() ? `• ${line}` : ''))
                            .join('\n')
                    }
                    onChange={(e) =>
                        updateField(
                            field.id,
                            'textValue',
                            e.target.value.replace(/^•\s?/gm, '')
                        )
                    }
                    placeholder="Escribe cada ítem en una línea"
                    className="peer p-3 rounded-xl border-2 bg-white border-gray-300 hover:border-gray-400 focus:outline-none focus:border-[#111c85] transition-colors w-full font-sans whitespace-pre-line"
                    minRows={1}
                />
            );
        }

        return (
            <TextareaAutosize
                value={field.textValue}
                onChange={(e) => updateField(field.id, 'textValue', e.target.value)}
                className="peer p-3 rounded-xl border-2 bg-white border-gray-300 hover:border-gray-400 focus:outline-none focus:border-[#111c85] transition-colors w-full"
                minRows={1}
            />
        );
    };

    return (
        <div className="mb-4">
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="fields">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                            {fields.map((field, index) => (
                                <Draggable key={field.id} draggableId={field.id} index={index}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className="flex items-center gap-4 bg-[#d1cddc] p-4 rounded-xl shadow"
                                        >
                                            <div className="relative">
                                                <select
                                                    value={field.selectValue}
                                                    onChange={(e) =>
                                                        updateField(field.id, 'selectValue', e.target.value)
                                                    }
                                                    className="peer p-3 rounded-xl border-2 bg-white border-gray-300 hover:border-gray-400 focus:outline-none focus:border-[#111c85] transition-colors"
                                                >
                                                    {options.map(opt => (
                                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="flex-1">
                                                {renderFieldInput(field)}
                                            </div>

                                            <button
                                                onClick={() => removeField(field.id)}
                                                className="bg-red-700 hover:bg-red-800 focus:bg-red-900 text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors duration-200"
                                            >
                                                ✕
                                            </button>

                                            <span className="text-xs text-gray-500 font-bold">#{field.order}</span>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}

                            <div className="text-center">
                                <button
                                    onClick={addField}
                                    className="bg-gray-500 text-white py-2 px-4 rounded-xl hover:bg-gray-600 transition ml-4 inline-flex items-center gap-2">
                                    <BadgePlus size={18}/> AGREGAR CAMPO
                                </button>
                            </div>
                            {errorMessage && (
                                <p className="text-red-500 text-xs mt-2 ms-4">{errorMessage}</p>
                            )}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
};

export default DynamicFieldList;
