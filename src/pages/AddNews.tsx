import React, {useEffect, useState} from 'react';
import FloatingInput from "../components/NewsPage/FloatingInput";
import FloatingSelect from "../components/NewsPage/FloatingSelect";
import DynamicFieldList from "../components/NewsPage/DynamicFieldList";
import {Save, BrushCleaning, ArrowLeftFromLine} from "lucide-react";
import Swal from 'sweetalert2';

// Tipos
interface Category {
    id: number;
    name: string;
}

interface ContentType {
    id: number;
    name: string;
}

interface RawField {
    id: string;
    selectValue: string;
    textValue: string;
    file?: File;
}

interface Block {
    type: string;
    data: string;
    display_order: number;
}

const AddNews: React.FC = () => {
    const today = new Date().toISOString().split('T')[0];

    const [contentTypes, setContentTypes] = useState<ContentType[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [blocks, setBlocks] = useState<Block[]>([]);
    const [rawFields, setRawFields] = useState<RawField[]>([]);
    const [resetDynamic, setResetDynamic] = useState(false);

    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [author, setAuthor] = useState('Destinos Turismo');
    const [publication_date, setDate] = useState(today);
    const [category_id, setCategoryId] = useState('');
    const [main_image_url, setImageUrl] = useState('');
    const [mainImageFile, setMainImageFile] = useState<File | null>(null);
    const [imageInputKey, setImageInputKey] = useState(Date.now());
    const [content_type_id, setContentTypeId] = useState('');
    const [slug, setSlug] = useState('');

    const CACHE_DURATION = 24 * 60 * 60 * 1000;

    useEffect(() => {
        const cachedCategories = localStorage.getItem('cachedCategories');
        const cachedContentTypes = localStorage.getItem('cachedContentTypes');
        const cachedTime = localStorage.getItem('cacheTime');

        const isExpired = !cachedTime || (Date.now() - parseInt(cachedTime)) > CACHE_DURATION;

        const applyFirstDefaults = (cat: Category[], types: ContentType[]) => {
            setCategoryId(cat.length > 0 ? cat[0].id.toString() : '');
            setContentTypeId(types.length > 0 ? types[0].id.toString() : '');
        };

        if (cachedCategories && cachedContentTypes && !isExpired) {
            const cat: Category[] = JSON.parse(cachedCategories);
            const types: ContentType[] = JSON.parse(cachedContentTypes);
            setCategories(cat);
            setContentTypes(types);
            applyFirstDefaults(cat, types);
        } else {
            Promise.all([
                fetch('https://backend-destinos.impplac.com/api/categories').then(res => res.json()),
                fetch('https://backend-destinos.impplac.com/api/content-types').then(res => res.json()),
            ])
                .then(([categoriesRes, contentTypesRes]) => {
                    const cat: Category[] = categoriesRes.data;
                    const types: ContentType[] = contentTypesRes.data;
                    setCategories(cat);
                    setContentTypes(types);
                    applyFirstDefaults(cat, types);
                    localStorage.setItem('cachedCategories', JSON.stringify(cat));
                    localStorage.setItem('cachedContentTypes', JSON.stringify(types));
                    localStorage.setItem('cacheTime', Date.now().toString());
                })
                .catch(err => console.error(err));
        }
    }, [CACHE_DURATION]);

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!title.trim()) newErrors.title = 'Título requerido';
        if (!subtitle.trim()) newErrors.subtitle = 'Subtítulo requerido';
        if (!author.trim()) newErrors.author = 'Autor requerido';
        if (!publication_date) newErrors.publication_date = 'Fecha requerida';
        if (!main_image_url.trim()) newErrors.main_image_url = 'Imagen requerida';
        if (!slug.trim()) {
            newErrors.slug = 'Slug requerido';
        } else if (!/^[a-zA-Z0-9-]+$/.test(slug)) {
            newErrors.slug = 'El slug solo puede contener letras, números y guiones (-)';
        }

        if (blocks.some(b => !b.data.trim())) {
            newErrors.blocks = "Todos los bloques deben tener contenido.";
        }

        return newErrors;
    };

    const handleSubmit = async () => {
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        let portadaUrl = main_image_url;
        if (mainImageFile && main_image_url.startsWith('blob:')) {
            const formData = new FormData();
            formData.append('file', mainImageFile);
            try {
                const res = await fetch("https://backend-destinos.impplac.com/api/upload/image", {
                    method: 'POST',
                    body: formData,
                });
                const data = await res.json();
                portadaUrl = data.url || '';
            } catch (err) {
                console.error('Error subiendo portada:', err);
            }
        }

        const processedBlocks = await Promise.all(blocks.map(async (block) => {
            if (block.type === 'image' && block.data.startsWith('blob:')) {
                const matching = rawFields.find(f => f.selectValue === 'image' && f.textValue === block.data);
                if (matching?.file) {
                    const formData = new FormData();
                    formData.append('file', matching.file);
                    try {
                        const res = await fetch("https://backend-destinos.impplac.com/api/upload/image", {
                            method: 'POST',
                            body: formData,
                        });
                        const data = await res.json();
                        return {...block, data: data.url || ''};
                    } catch (err) {
                        console.error('Error subiendo imagen:', err);
                        return block;
                    }
                }
            }
            return block;
        }));

        setErrors({});
        try {
            const response = await fetch('https://backend-destinos.impplac.com/api/contents', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title,
                    subtitle,
                    author,
                    publication_date,
                    category_id,
                    main_image_url: portadaUrl,
                    content_type_id,
                    slug,
                    blocks: processedBlocks
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error al registrar el contenido');
            }

            Swal.fire('Éxito', 'El contenido fue registrado correctamente', 'success');

        } catch (error) {
            console.error('Error al enviar el contenido:', error);
            Swal.fire('Error',  'Hubo un problema al enviar el contenido', 'error');
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setErrors(prev => ({...prev, [field]: ''}));
        switch (field) {
            case 'title':
                setTitle(value);
                break;
            case 'subtitle':
                setSubtitle(value);
                break;
            case 'author':
                setAuthor(value);
                break;
            case 'publication_date':
                setDate(value);
                break;
            case 'main_image_url':
                setImageUrl(value);
                break;
            case 'slug':
                setSlug(value);
                break;
        }
    };

    const confirmResetForm = () => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Se borrará todo el contenido del formulario.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, limpiar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#111c85',
            cancelButtonColor: '#C62828',
            reverseButtons: false
        }).then((result) => {
            if (result.isConfirmed) {
                resetForm();
                Swal.fire('Formulario limpiado', '', 'success');
            }
        });
    };


    const resetForm = () => {
        const today = new Date().toISOString().split('T')[0];
        setTitle('');
        setSubtitle('');
        setAuthor('Destinos Turismo');
        setDate(today);
        setImageUrl('');
        setMainImageFile(null);
        setSlug('');
        setBlocks([]);
        setErrors({});
        setResetDynamic(true);
        setTimeout(() => setResetDynamic(false), 0);
        setImageInputKey(Date.now());
        if (categories.length > 0) setCategoryId(categories[0].id.toString());
        if (contentTypes.length > 0) setContentTypeId(contentTypes[0].id.toString());
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#fefffe] px-4">
            <div className="bg-[#e3e3f1] p-8 shadow-md w-full max-w-6xl my-4">
                <h1 className="text-2xl font-bold mb-8 text-[#111c85] text-center">AGREGAR CONTENIDO</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <div className="lg:col-span-2 space-y-6">
                        <FloatingInput label="Título" type="text" value={title}
                                       onChange={(v) => handleInputChange('title', v)} errorMessage={errors.title}/>
                        <FloatingInput label="Subtítulo" type="text" value={subtitle}
                                       onChange={(v) => handleInputChange('subtitle', v)}
                                       errorMessage={errors.subtitle}/>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FloatingInput label="Autor" type="text" value={author}
                                           onChange={(v) => handleInputChange('author', v)}
                                           errorMessage={errors.author}/>
                            <FloatingInput label="Fecha" type="date" value={publication_date}
                                           onChange={(v) => handleInputChange('publication_date', v)}
                                           errorMessage={errors.publication_date}/>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FloatingSelect label="Categoría" options={categories} value={category_id}
                                            onChange={setCategoryId}/>
                            <FloatingSelect label="Tipo Contenido" options={contentTypes} value={content_type_id}
                                            onChange={setContentTypeId}/>
                        </div>

                        <FloatingInput label="Slug" type="text" value={slug}
                                       onChange={(v) => handleInputChange('slug', v)} errorMessage={errors.slug}
                                       tooltip="Texto que aparecerá en la URL. Usa solo letras, números y guiones (-)."/>
                    </div>

                    <div className={`flex flex-col bg-white p-2 rounded-xl shadow h-full text-center border-2 transition
              ${errors.main_image_url ? 'border-red-500' : 'border-gray-300 hover:border-gray-400'}`}>
                        <label className="text-sm text-gray-500">Portada</label>
                        {main_image_url && (
                            <div className="flex-1 w-full flex justify-center items-center overflow-hidden mt-4">
                                <img src={main_image_url} alt="preview"
                                     className="max-h-full object-contain rounded" style={{maxHeight: '300px'}}/>
                            </div>
                        )}
                        <label
                            className="cursor-pointer inline-block bg-gray-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-600 transition self-center mt-4">
                            Seleccionar imagen
                            <input
                                key={imageInputKey}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        setMainImageFile(file);
                                        setImageUrl(URL.createObjectURL(file));
                                        setErrors(prev => ({...prev, main_image_url: ''}));
                                    }
                                }}
                            />
                        </label>
                        {errors.main_image_url && (
                            <p className="text-red-500 text-sm mt-1">{errors.main_image_url}</p>
                        )}
                    </div>
                </div>

                <h2 className="text-lg font-bold text-[#111c85] mx-2">CUERPO DEL CONTENIDO</h2>
                <hr className="mb-4 border-[#111c85] border-t-2"/>

                <DynamicFieldList onChange={setBlocks} onRawChange={setRawFields} errorMessage={errors.blocks}
                                  resetSignal={resetDynamic}/>
                <hr className="mb-2 border-[#111c85] border-t-2"/>

                <div className="flex justify-between items-center mt-4 flex-wrap gap-2">
                    <div className="flex gap-4">
                        <button
                            onClick={handleSubmit}
                            className="bg-[#111c85] text-white py-2 px-4 rounded-xl hover:bg-[#0b1460] transition inline-flex items-center gap-2"
                        >
                            <Save size={18}/> REGISTRAR CONTENIDO
                        </button>
                        <button
                            onClick={confirmResetForm}
                            className="bg-[#C62828] text-white py-2 px-4 rounded-xl hover:bg-[#9A1F1F] transition inline-flex items-center gap-2"
                        >
                            <BrushCleaning size={18}/> LIMPIAR FORMULARIO
                        </button>
                    </div>

                    <button
                        className="bg-[#111c85] text-white py-2 px-4 rounded-xl hover:bg-[#0b1460] transition inline-flex items-center gap-2"
                    >
                        <ArrowLeftFromLine size={18}/> VOLVER
                    </button>
                </div>

            </div>
        </div>
    );
};

export default AddNews;
