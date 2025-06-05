"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { EventFormData, eventFormSchema, formatToDateInput, formatToTimeInput } from "@/api/schemas/event.schema"
import { X } from "lucide-react"

import { EventDetail } from "@/api/types/events.types"
import { GetQuestionnaire } from "@/api/types/quetionnaire.type"
import { useCreateEventMutation, useUpdateEventMutation } from "@/api/mutations/events.mutation"
import FormEvent from "@/common/molecules/admin/event/form-event.molecule"


interface EventFormModalProps {
    isOpen: boolean
    onClose: () => void
    initialData?: EventDetail
    isEditing?: boolean
    selectedCuestion?: GetQuestionnaire | null
}


export default function EventFormModal({
    isOpen,
    onClose,
    initialData,
    isEditing = false,
    selectedCuestion
}: EventFormModalProps) {

    const { mutateAsync: useCreateEvent } = useCreateEventMutation()
    const { mutateAsync: useEditEvent } = useUpdateEventMutation()

    const form = useForm<EventFormData>({
        resolver: zodResolver(eventFormSchema),
        defaultValues: initialData ? {
            name: initialData.name,
            start_date: formatToDateInput(initialData.start_time),
            start_time: formatToTimeInput(initialData.start_time),
            end_date: formatToDateInput(initialData.end_time),
            end_time: formatToTimeInput(initialData.end_time),
        } : {
            name: selectedCuestion ? `Evento: ${selectedCuestion.title}` : "",
            start_date: "",
            start_time: "",
            end_date: "",
            end_time: "",
        }
    });

    useEffect(() => {
        if (isEditing && initialData) {
            form.reset({
                name: initialData.name,
                start_date: formatToDateInput(initialData.start_time),
                start_time: formatToTimeInput(initialData.start_time),
                end_date: formatToDateInput(initialData.end_time),
                end_time: formatToTimeInput(initialData.end_time)
            });
        } else if (selectedCuestion) {
            form.reset({
                name: `Evento: ${selectedCuestion.title}`,
                start_date: "",
                start_time: "",
                end_date: "",
                end_time: ""
            });
        } else {
            form.reset({
                name: "",
                start_date: "",
                start_time: "",
                end_date: "",
                end_time: ""
            });
        }
    }, [form, initialData, isEditing, selectedCuestion]);

    const handleFormSubmit = (data: EventFormData) => {
        const startDateTime = new Date(`${data.start_date}T${data.start_time}`);
        const endDateTime = new Date(`${data.end_date}T${data.end_time}`);

        const transformedData = {
            questionnaire_id: selectedCuestion?.id || 0,
            name: data.name,
            start_time: startDateTime.toISOString(),
            end_time: endDateTime.toISOString()
        };

        if (isEditing && initialData?.id) {
            useEditEvent({ id: initialData.id, data: transformedData })
        } else {

            useCreateEvent(transformedData);
        }
        form.reset();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/10 min-w-3xl backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl max-w-md w-full p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-white">
                        {isEditing ? "Editar Evento" : "Crear Nuevo Evento"}
                    </h2>
                    <button
                        onClick={()=>{
                            onClose();
                            form.reset();
                        }}
                        className="text-white/70 hover:text-white transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <FormEvent
                    isEditing={isEditing}
                    onClose={onClose}
                    form={form}
                    handleFormSubmit={handleFormSubmit}
                ></FormEvent>
            </div>
        </div>
    );
}