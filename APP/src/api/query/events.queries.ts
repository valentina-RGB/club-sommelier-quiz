import { useQuery } from "@tanstack/react-query";
import AuthClient from "@/api/client/axios";
import { EventDetail } from "../types/events.types";

const authClient = new AuthClient();


export const useEventsQuery = () => {
    return useQuery<EventDetail[], Error>({
        queryKey: ['events'],
        queryFn: async (): Promise<EventDetail[]> => {
            try {
                const response = await authClient.get<{ events: EventDetail[] }>('/events');

                if (!Array.isArray(response)) {
                    return [];
                }

                return response;
            } catch (error) {
                throw error;
            }
        },
        refetchOnWindowFocus: true,
        retry: 1
    });
};

/**
 * @param id The event ID to fetch
 */
export const useEventByIDQuery = (id: number | null) => {
    return useQuery<EventDetail, Error>({
        queryKey: ['event', id],
        queryFn: async (): Promise<EventDetail> => {
            try {
                if (!id) throw new Error('Event ID is required');

                const response = await authClient.get<EventDetail>(`/events/${id}`);

                return response;
            } catch (error) {
                throw error;
            }
        },
        enabled: !!id,
        refetchOnWindowFocus: true,
        retry: 1
    });
};

/**
 * @param code The event access code to fetch
 */
export const useEventByCodeQuery = (code: string | null) => {
    return useQuery<EventDetail, Error>({
        queryKey: ['event-by-code', code],
        queryFn: async (): Promise<EventDetail> => {
            try {
                if (!code) throw new Error('Event code is required');

                const response = await authClient.get<EventDetail>(`/events/code/${code}`);
                return response;
            } catch (error) {
                throw error;
            }
        },
        enabled: !!code && code.length > 0,
        retry: 1
    });
};